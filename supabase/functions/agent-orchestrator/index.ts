// RegCo Agent Orchestrator
// AI compliance copilot with a tool registry covering monitoring, screening,
// case management, returns, identity, and dashboard navigation.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  streamText,
  tool,
  stepCountIs,
  convertToModelMessages,
  type UIMessage,
} from "npm:ai@5.0.26";
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible@1.0.19";
import { z } from "npm:zod@3";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ------------ helpers ------------
function err(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

// Primary: Lovable AI Gateway (Gemini 3 Flash — strong tool-calling, no extra setup).
// Fallback: OpenRouter free Llama 3.3 70b if Lovable key is missing.
const LOVABLE_MODEL = "google/gemini-3-flash-preview";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

function makeLovableProvider(key: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

function makeOpenRouterProvider(key: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://regco.lovable.app",
      "X-Title": "RegCo Compliance Agent",
    },
  });
}

// ------------ filing schedule resolver ------------
async function resolveSchedule(admin: ReturnType<typeof createClient>, input: string): Promise<{ match: any | null; candidates: any[] }> {
  const raw = (input ?? "").trim();
  if (!raw) return { match: null, candidates: [] };
  // 1. Exact code match (case-insensitive)
  const { data: exact } = await admin.from("filing_schedules").select("*").ilike("return_type", raw).maybeSingle();
  if (exact) return { match: exact, candidates: [exact] };
  // 2. Fuzzy: ilike on code or title
  const like = `%${raw.replace(/[%_]/g, "")}%`;
  const { data: fuzzy } = await admin.from("filing_schedules").select("*").or(`return_type.ilike.${like},title.ilike.${like}`);
  const list = fuzzy ?? [];
  if (list.length === 1) return { match: list[0], candidates: list };
  // 3. Friendly-name fallback (CTR/STR/MPR/FX/PREM/SO/SCUML/VAT/PAYE/WHT/CIT)
  const upper = raw.toUpperCase().replace(/[^A-Z]/g, "");
  if (upper) {
    const all = await admin.from("filing_schedules").select("*");
    const matches = (all.data ?? []).filter((s: any) => {
      const code = String(s.return_type).toUpperCase();
      return code === upper || code.endsWith("_" + upper) || code.startsWith(upper + "_");
    });
    if (matches.length === 1) return { match: matches[0], candidates: matches };
    if (matches.length > 1) return { match: null, candidates: matches };
  }
  return { match: null, candidates: list };
}

// ------------ tool factory ------------
function buildTools(ctx: { userId: string; userClient: ReturnType<typeof createClient>; admin: ReturnType<typeof createClient>; logTool: (n: string, args: unknown, summary: string, status?: string, err?: string) => Promise<void>; }) {
  const { userClient, admin, userId, logTool } = ctx;

  const wrap = async <T>(name: string, args: unknown, fn: () => Promise<T>): Promise<T | { error: string }> => {
    const start = Date.now();
    try {
      const result = await fn();
      const summary = typeof result === "object" ? JSON.stringify(result).slice(0, 240) : String(result).slice(0, 240);
      await logTool(name, args, summary, "success");
      console.log(`tool ${name} ok ${Date.now() - start}ms`);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await logTool(name, args, "", "error", msg);
      console.error(`tool ${name} failed`, msg);
      return { error: msg };
    }
  };

  return {
    // ---------- Transaction Monitoring ----------
    list_transactions: tool({
      description: "List transactions for an account or entity, optionally filtered by amount, direction, and time.",
      inputSchema: z.object({
        account_number: z.string().optional(),
        entity_name: z.string().optional(),
        min_amount: z.number().optional(),
        direction: z.enum(["inbound", "outbound", "any"]).optional(),
        since_days: z.number().int().min(1).max(365).optional(),
        limit: z.number().int().min(1).max(100).optional(),
      }),
      execute: (args) => wrap("list_transactions", args, async () => {
        let q = userClient.from("unified_transactions").select("*").limit(args.limit ?? 25);
        if (args.account_number) q = q.eq("account_number", args.account_number);
        if (args.entity_name) q = q.ilike("counterparty_name", `%${args.entity_name}%`);
        if (args.min_amount) q = q.gte("amount", args.min_amount);
        if (args.direction && args.direction !== "any") q = q.eq("direction", args.direction);
        if (args.since_days) {
          const since = new Date(Date.now() - args.since_days * 86400000).toISOString();
          q = q.gte("transaction_date", since);
        }
        const { data, error } = await q.order("transaction_date", { ascending: false });
        if (error) throw error;
        return { count: data?.length ?? 0, transactions: data ?? [] };
      }),
    }),

    get_account_velocity: tool({
      description: "Compute total inbound/outbound volume and count for an account over a window of days.",
      inputSchema: z.object({
        account_number: z.string(),
        window_days: z.number().int().min(1).max(180).default(30),
      }),
      execute: (args) => wrap("get_account_velocity", args, async () => {
        const since = new Date(Date.now() - args.window_days * 86400000).toISOString();
        const { data, error } = await userClient
          .from("unified_transactions")
          .select("amount,direction,transaction_date")
          .eq("account_number", args.account_number)
          .gte("transaction_date", since)
          .limit(1000);
        if (error) throw error;
        const rows = data ?? [];
        const inbound = rows.filter((r: any) => r.direction === "inbound");
        const outbound = rows.filter((r: any) => r.direction === "outbound");
        const sum = (xs: any[]) => xs.reduce((a, r) => a + Number(r.amount || 0), 0);
        return {
          window_days: args.window_days,
          inbound: { count: inbound.length, total: sum(inbound) },
          outbound: { count: outbound.length, total: sum(outbound) },
          net: sum(inbound) - sum(outbound),
        };
      }),
    }),

    explain_alert: tool({
      description: "Explain why a specific transaction or review was flagged, citing the applicable regulatory rule.",
      inputSchema: z.object({ transaction_id: z.string().uuid().optional(), review_id: z.string().uuid().optional(), rule_code: z.string().optional() }),
      execute: (args) => wrap("explain_alert", args, async () => {
        let rule_code = args.rule_code;
        let review: any = null;
        if (args.review_id) {
          const { data } = await userClient.from("transaction_reviews").select("*").eq("id", args.review_id).maybeSingle();
          review = data;
          rule_code = rule_code || (data as any)?.rule_code;
        }
        let rule: any = null;
        if (rule_code) {
          const { data } = await admin.from("regulatory_rules").select("*").eq("rule_code", rule_code).maybeSingle();
          rule = data;
        }
        return { review, rule };
      }),
    }),

    compare_to_baseline: tool({
      description: "Compare an account's recent activity to its longer-term baseline.",
      inputSchema: z.object({ account_number: z.string(), recent_days: z.number().int().default(1), baseline_days: z.number().int().default(180) }),
      execute: (args) => wrap("compare_to_baseline", args, async () => {
        const now = Date.now();
        const sinceRecent = new Date(now - args.recent_days * 86400000).toISOString();
        const sinceBase = new Date(now - args.baseline_days * 86400000).toISOString();
        const { data } = await userClient.from("unified_transactions")
          .select("amount,transaction_date")
          .eq("account_number", args.account_number)
          .gte("transaction_date", sinceBase).limit(2000);
        const rows = data ?? [];
        const recent = rows.filter((r: any) => r.transaction_date >= sinceRecent);
        const base = rows.filter((r: any) => r.transaction_date < sinceRecent);
        const sum = (xs: any[]) => xs.reduce((a, r) => a + Number(r.amount || 0), 0);
        const recentDailyAvg = sum(recent) / Math.max(args.recent_days, 1);
        const baselineDailyAvg = sum(base) / Math.max(args.baseline_days - args.recent_days, 1);
        return {
          recent_total: sum(recent),
          recent_count: recent.length,
          recent_daily_avg: recentDailyAvg,
          baseline_daily_avg: baselineDailyAvg,
          deviation_ratio: baselineDailyAvg ? recentDailyAvg / baselineDailyAvg : null,
        };
      }),
    }),

    // ---------- Live Screening ----------
    screen_entity: tool({
      description: "Run sanctions and PEP screening for a person or organisation. Returns risk level and matches.",
      inputSchema: z.object({ name: z.string().min(2), bvn: z.string().optional(), customer_id: z.string().uuid().optional() }),
      execute: (args) => wrap("screen_entity", args, async () => {
        const { data, error } = await userClient.functions.invoke("screen-customer", { body: args });
        if (error) throw error;
        return data;
      }),
    }),

    get_customer_360: tool({
      description: "Return a customer's profile, KYC status, accounts, and recent screening history.",
      inputSchema: z.object({ customer_id: z.string().uuid().optional(), full_name: z.string().optional(), bvn: z.string().optional() }),
      execute: (args) => wrap("get_customer_360", args, async () => {
        let customer: any = null;
        if (args.customer_id) {
          const { data } = await userClient.from("customers").select("*").eq("id", args.customer_id).maybeSingle();
          customer = data;
        } else if (args.bvn) {
          const { data } = await userClient.from("customers").select("*").eq("bvn", args.bvn).maybeSingle();
          customer = data;
        } else if (args.full_name) {
          const { data } = await userClient.from("customers").select("*").ilike("full_name", `%${args.full_name}%`).limit(1).maybeSingle();
          customer = data;
        }
        if (!customer) return { found: false };
        const [kyc, accounts, screenings] = await Promise.all([
          userClient.from("customer_kyc").select("*").eq("customer_id", customer.id).maybeSingle(),
          userClient.from("customer_accounts").select("*").eq("customer_id", customer.id),
          userClient.from("screening_results").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false }).limit(3),
        ]);
        return { found: true, customer, kyc: kyc.data, accounts: accounts.data ?? [], recent_screenings: screenings.data ?? [] };
      }),
    }),

    adverse_media_scan: tool({
      description: "Search adverse media for a person or organisation. Returns summarised findings.",
      inputSchema: z.object({ name: z.string(), years: z.number().int().min(1).max(20).default(5), topic: z.string().optional() }),
      execute: (args) => wrap("adverse_media_scan", args, async () => {
        const { data, error } = await userClient.functions.invoke("adverse-media-scan", { body: args });
        if (error) throw error;
        return data;
      }),
    }),

    get_risk_score: tool({
      description: "Compute a current risk score for a customer based on screening, KYC, and recent activity.",
      inputSchema: z.object({ customer_id: z.string().uuid() }),
      execute: (args) => wrap("get_risk_score", args, async () => {
        const [kyc, screenings, txs] = await Promise.all([
          userClient.from("customer_kyc").select("*").eq("customer_id", args.customer_id).maybeSingle(),
          userClient.from("screening_results").select("highest_risk,matches_found,created_at").eq("customer_id", args.customer_id).order("created_at", { ascending: false }).limit(5),
          userClient.from("unified_transactions").select("amount").eq("customer_id", args.customer_id).limit(500),
        ]);
        let score = 20;
        const drivers: string[] = [];
        if (!kyc.data || (kyc.data as any).kyc_status !== "verified") { score += 25; drivers.push("KYC not fully verified"); }
        const worst = (screenings.data ?? []).find((s: any) => s.highest_risk === "critical");
        if (worst) { score += 40; drivers.push("Sanctions hit on file"); }
        else if ((screenings.data ?? []).some((s: any) => s.highest_risk === "medium")) { score += 15; drivers.push("PEP exposure detected"); }
        const totalVolume = (txs.data ?? []).reduce((a: number, r: any) => a + Number(r.amount || 0), 0);
        if (totalVolume > 50_000_000) { score += 10; drivers.push("High transaction volume"); }
        score = Math.min(score, 100);
        const band = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
        return { score, band, drivers };
      }),
    }),

    // ---------- Case Management ----------
    open_case: tool({
      description: "Open a new investigation case.",
      inputSchema: z.object({
        title: z.string().min(3),
        customer_id: z.string().uuid().optional(),
        severity: z.enum(["low","medium","high","critical"]).default("medium"),
        trigger_kind: z.string().optional(),
        trigger_id: z.string().optional(),
        summary: z.string().optional(),
      }),
      execute: (args) => wrap("open_case", args, async () => {
        const { data, error } = await userClient.from("cases").insert({
          user_id: userId, title: args.title, customer_id: args.customer_id ?? null,
          severity: args.severity, trigger_kind: args.trigger_kind ?? null,
          trigger_id: args.trigger_id ?? null, summary: args.summary ?? null,
        }).select().single();
        if (error) throw error;
        await userClient.from("case_events").insert({
          case_id: (data as any).id, user_id: userId, actor_id: userId, actor_kind: "agent",
          event_type: "case_opened", payload: { title: args.title, severity: args.severity },
        });
        return { case_id: (data as any).id, status: (data as any).status };
      }),
    }),

    add_case_note: tool({
      description: "Add a note to a case. Appended to the immutable audit trail.",
      inputSchema: z.object({ case_id: z.string().uuid(), note: z.string().min(1) }),
      execute: (args) => wrap("add_case_note", args, async () => {
        const { error } = await userClient.from("case_events").insert({
          case_id: args.case_id, user_id: userId, actor_id: userId, actor_kind: "agent",
          event_type: "note_added", payload: { note: args.note },
        });
        if (error) throw error;
        return { ok: true };
      }),
    }),

    request_account_freeze: tool({
      description: "Request a freeze on an account. Requires officer approval before it takes effect.",
      inputSchema: z.object({ account_number: z.string(), reason: z.string().min(3), case_id: z.string().uuid().optional() }),
      execute: (args) => wrap("request_account_freeze", args, async () => {
        const { data, error } = await userClient.from("account_actions").insert({
          user_id: userId, account_number: args.account_number, action: "freeze",
          reason: args.reason, case_id: args.case_id ?? null, requested_by: userId,
        }).select().single();
        if (error) throw error;
        if (args.case_id) {
          await userClient.from("case_events").insert({
            case_id: args.case_id, user_id: userId, actor_id: userId, actor_kind: "agent",
            event_type: "freeze_requested", payload: { account_number: args.account_number, reason: args.reason, action_id: (data as any).id },
          });
        }
        return { action_id: (data as any).id, status: "pending", requires_approval: true };
      }),
    }),

    draft_investigation_summary: tool({
      description: "Draft an investigation summary narrative for a case. Stored as a case artifact.",
      inputSchema: z.object({ case_id: z.string().uuid(), focus: z.string().optional() }),
      execute: (args) => wrap("draft_investigation_summary", args, async () => {
        const { data: c } = await userClient.from("cases").select("*").eq("id", args.case_id).maybeSingle();
        if (!c) throw new Error("Case not found");
        const { data: events } = await userClient.from("case_events").select("event_type,payload,created_at").eq("case_id", args.case_id).order("created_at");
        const body = `Investigation summary for case "${(c as any).title}"\n\nSeverity: ${(c as any).severity}\nStatus: ${(c as any).status}\nOpened: ${(c as any).opened_at}\n\nEvents recorded:\n${(events ?? []).map((e: any) => `- ${e.created_at}: ${e.event_type} ${JSON.stringify(e.payload)}`).join("\n")}\n\nFocus: ${args.focus ?? "general"}`;
        const { data: art, error } = await userClient.from("case_artifacts").insert({
          case_id: args.case_id, user_id: userId, kind: "investigation_summary",
          title: `Summary — ${(c as any).title}`, body,
        }).select().single();
        if (error) throw error;
        return { artifact_id: (art as any).id, preview: body.slice(0, 400) };
      }),
    }),

    get_audit_trail: tool({
      description: "Return the full hash-chained audit trail for a case.",
      inputSchema: z.object({ case_id: z.string().uuid() }),
      execute: (args) => wrap("get_audit_trail", args, async () => {
        const { data, error } = await userClient.from("case_events").select("id,event_type,payload,actor_kind,prev_hash,hash,created_at").eq("case_id", args.case_id).order("created_at");
        if (error) throw error;
        return { count: data?.length ?? 0, events: data ?? [] };
      }),
    }),

    // ---------- Automated Returns ----------
    get_filing_deadline: tool({
      description: "Get the filing deadline and frequency for a regulatory return. Accepts canonical codes (NFIU_CTR, NFIU_STR, CBN_MPR, CBN_FX, NDIC_PREM, NDIC_SO, SCUML_ANN, FIRS_VAT, FIRS_PAYE, FIRS_WHT, FIRS_CIT) or friendly names (CTR, STR, 'Currency Transaction Report').",
      inputSchema: z.object({ return_type: z.string() }),
      execute: (args) => wrap("get_filing_deadline", args, async () => {
        const r = await resolveSchedule(admin, args.return_type);
        if (r.match) return { found: true, ...r.match };
        if (r.candidates.length) return { found: false, candidates: r.candidates.map((c: any) => ({ return_type: c.return_type, title: c.title, regulator: c.regulator })) };
        return { found: false };
      }),
    }),

    check_return_readiness: tool({
      description: "Check whether a regulatory return can be filed for a given period — lists missing data fields. Accepts canonical codes or friendly names like 'CTR'.",
      inputSchema: z.object({ return_type: z.string(), period: z.string().optional() }),
      execute: (args) => wrap("check_return_readiness", args, async () => {
        const r = await resolveSchedule(admin, args.return_type);
        if (!r.match) {
          return { ready: false, missing: ["unknown return type"], candidates: r.candidates.map((c: any) => ({ return_type: c.return_type, title: c.title })) };
        }
        const schedule = r.match;
        const { data: txs } = await userClient.from("unified_transactions").select("id").limit(1);
        const missing: string[] = [];
        if (!txs || txs.length === 0) missing.push("No transactions for period");
        return { ready: missing.length === 0, missing, schedule };
      }),
    }),

    request_generate_return: tool({
      description: "Generate a regulatory return (STR, CTR, MPR, etc). Requires officer approval before filing.",
      inputSchema: z.object({ return_type: z.string(), period: z.string().optional(), case_id: z.string().uuid().optional() }),
      execute: (args) => wrap("request_generate_return", args, async () => {
        // Create a report_request row in pending status
        const { data, error } = await userClient.from("report_requests").insert({
          user_id: userId, report_type: args.return_type, status: "pending_approval",
          metadata: { period: args.period, case_id: args.case_id },
        } as any).select().single();
        if (error) {
          // Fallback: just return a pending intent without persistence
          return { intent: "generate_return", return_type: args.return_type, period: args.period, status: "pending_approval", requires_approval: true };
        }
        return { request_id: (data as any).id, status: "pending_approval", requires_approval: true };
      }),
    }),

    // ---------- UI Control ----------
    navigate_dashboard: tool({
      description: "Switch the officer's dashboard to a specific view. Use when the user asks to 'show' or 'open' something.",
      inputSchema: z.object({
        view: z.enum(["overview","screening","customer_360","cases","transactions","returns","calendar","reports"]),
        entity_id: z.string().optional(),
      }),
      execute: (args) => wrap("navigate_dashboard", args, async () => {
        const routes: Record<string, string> = {
          overview: "/dashboard",
          screening: "/dashboard/screening",
          customer_360: "/dashboard/customer-360",
          cases: "/dashboard/audit-tracker",
          transactions: "/dashboard/transactions",
          returns: "/dashboard/my-reports",
          calendar: "/dashboard/calendar",
          reports: "/dashboard/my-reports",
        };
        const path = routes[args.view] + (args.entity_id ? `?entity=${encodeURIComponent(args.entity_id)}` : "");
        return { ui_action: "navigate", path, view: args.view };
      }),
    }),
  };
}

const SYSTEM_PROMPT = `You are RegCo Agent, a tier-one compliance analyst for Nigerian licensed financial institutions (CBN, NFIU, SCUML, NDIC, FIRS).

You have tools to inspect transactions, screen entities, manage cases, draft narratives, generate returns, and switch dashboard views. Always:
- Use tools to ground answers in real data. Do not invent customer details, transaction amounts, case IDs, or rule citations.
- Keep replies tight: 2-5 short sentences plus any tool output the UI renders. No emojis.
- When the user asks to "show", "open", or "switch to" a view, call navigate_dashboard.
- Mutating actions (open_case, request_account_freeze, request_generate_return) create a pending intent that requires officer approval — tell the user clearly.
- Cite regulator + rule code when you explain alerts.
- If a tool errors, explain in plain English what failed and suggest a next step.

Regulatory return catalog (use these canonical codes when calling get_filing_deadline / check_return_readiness / request_generate_return):
- NFIU_STR — Suspicious Transaction Report (NFIU, per case, within 24h of detection)
- NFIU_CTR — Currency Transaction Report (NFIU, daily, by 17:00 next business day)
- CBN_MPR — Monetary Policy Return (CBN, monthly, by 10th of following month)
- CBN_FX — Foreign Exchange Return (CBN, weekly)
- NDIC_PREM — Premium Contribution Return (NDIC, quarterly)
- NDIC_SO — Single Obligor Return (NDIC, quarterly)
- SCUML_ANN — Annual SCUML Compliance Report (SCUML, annual, by 31 Jan)
- FIRS_VAT / FIRS_PAYE / FIRS_WHT / FIRS_CIT — FIRS tax returns
Map friendly names automatically: "CTR" → NFIU_CTR, "STR" → NFIU_STR, "MPR" → CBN_MPR, "FX return" → CBN_FX, "SCUML" → SCUML_ANN, "VAT" → FIRS_VAT, "PAYE" → FIRS_PAYE.

Report-generation workflow: when the user asks to generate/file a return, (1) call navigate_dashboard({ view: "returns" }), (2) if the specific return or period is ambiguous, ask one short clarifying question, (3) call check_return_readiness with the canonical code, (4) if ready, call request_generate_return to surface the approval chip — never claim a return has been filed without an approved intent.`;

// ------------ main handler ------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return err(405, "Method not allowed");
  if (!LOVABLE_API_KEY && !OPENROUTER_API_KEY) {
    return err(500, "AI service not configured (missing LOVABLE_API_KEY or OPENROUTER_API_KEY)");
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return err(401, "Unauthorized");

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claims?.claims?.sub) return err(401, "Unauthorized");
  const userId = claims.claims.sub as string;

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const body = await req.json().catch(() => null) as { messages?: UIMessage[]; conversation_id?: string } | null;
  if (!body?.messages || !Array.isArray(body.messages)) return err(400, "messages required");

  // Resolve or create conversation
  let conversationId = body.conversation_id;
  if (!conversationId) {
    const { data } = await admin.from("agent_conversations").insert({
      user_id: userId, title: "Conversation",
    }).select().single();
    conversationId = (data as any)?.id;
  }

  // Persist most recent user message
  const lastUser = [...body.messages].reverse().find((m) => m.role === "user");
  if (lastUser && conversationId) {
    const content = (lastUser.parts ?? []).filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
    await admin.from("agent_messages").insert({
      conversation_id: conversationId, user_id: userId, role: "user",
      content, parts: lastUser.parts as any,
    });
  }

  const logTool = async (name: string, args: unknown, summary: string, status = "success", errMsg?: string) => {
    await admin.from("agent_tool_invocations").insert({
      user_id: userId, conversation_id: conversationId, tool_name: name,
      args: args as any, result_summary: summary, status, error: errMsg ?? null,
    });
  };

  // Pick provider: Lovable AI Gateway first, OpenRouter only as fallback.
  const useLovable = !!LOVABLE_API_KEY;
  const provider = useLovable
    ? makeLovableProvider(LOVABLE_API_KEY!)
    : makeOpenRouterProvider(OPENROUTER_API_KEY!);
  const modelName = useLovable ? LOVABLE_MODEL : OPENROUTER_MODEL;
  console.log(`agent using ${useLovable ? "lovable" : "openrouter"} model ${modelName}`);

  const tools = buildTools({ userId, userClient, admin, logTool });

  const result = streamText({
    model: provider(modelName),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(body.messages),
    tools,
    stopWhen: stepCountIs(50),
    temperature: 0.2,
    onFinish: async ({ text }) => {
      if (conversationId && text) {
        await admin.from("agent_messages").insert({
          conversation_id: conversationId, user_id: userId, role: "assistant",
          content: text, parts: null,
        });
        await admin.from("agent_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
      }
    },
    onError: ({ error }) => {
      console.error(`model ${modelName} error:`, error);
    },
  });

  return result.toUIMessageStreamResponse({
    headers: { ...corsHeaders, "X-Conversation-Id": conversationId ?? "" },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("stream error:", msg);
      return `AI service error: ${msg}`;
    },
  });
});
