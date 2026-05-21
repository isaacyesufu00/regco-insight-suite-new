// CBS webhook receiver — authenticates via x-api-key, screens AML rules,
// inserts into unified_transactions. NEVER exposes how it works internally.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-api-key, authorization",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface ScreenInput {
  amount: number;
  narration?: string;
  channel?: string;
  account_number?: string;
}

function screen(t: ScreenInput): { is_flagged: boolean; severity?: string; reason?: string; rule?: string } {
  const amt = Number(t.amount) || 0;
  const narration = (t.narration || "").toLowerCase();

  if (amt >= 5_000_000) {
    return { is_flagged: true, severity: "critical", rule: "CTR", reason: `Single transaction ₦${amt.toLocaleString("en-NG")} meets/exceeds the ₦5,000,000 Currency Transaction Report threshold.` };
  }
  if (amt >= 4_500_000 && amt < 5_000_000 && amt % 1000 === 0) {
    return { is_flagged: true, severity: "high", rule: "STRUCTURING", reason: `Round-figure ₦${amt.toLocaleString("en-NG")} positioned just below CTR threshold — possible structuring.` };
  }
  if (amt >= 1_000_000 && amt % 500_000 === 0) {
    return { is_flagged: true, severity: "medium", rule: "ROUND_FIGURE", reason: `Round-figure ₦${amt.toLocaleString("en-NG")} ≥ ₦1M may indicate layering.` };
  }
  if (/\b(cash|bearer|courier|hawala)\b/.test(narration)) {
    return { is_flagged: true, severity: "high", rule: "NARRATION_KEYWORD", reason: `Narration contains high-risk keyword: "${narration.match(/\b(cash|bearer|courier|hawala)\b/)?.[0]}"` };
  }
  return { is_flagged: false };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return json({ error: "Missing x-api-key header" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const keyHash = await sha256(apiKey);
  const { data: keyRow } = await supabase
    .from("webhook_api_keys")
    .select("user_id, active")
    .eq("key_hash", keyHash)
    .maybeSingle();

  if (!keyRow || !keyRow.active) return json({ error: "Invalid API key" }, 401);
  const userId = keyRow.user_id as string;

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  const account_number = String(body.account_number ?? "").trim();
  const customer_name = String(body.customer_name ?? "").trim();
  const amount = Number(body.amount);
  const transaction_type = String(body.transaction_type ?? "").trim() || null;
  const transaction_date = body.transaction_date ? new Date(String(body.transaction_date)).toISOString() : new Date().toISOString();
  const narration = body.narration ? String(body.narration) : null;
  const channel = body.channel ? String(body.channel) : null;
  const branch_code = body.branch_code ? String(body.branch_code) : null;

  if (!account_number || !customer_name || !Number.isFinite(amount)) {
    return json({ error: "account_number, customer_name and amount are required" }, 400);
  }

  // Try to attach to known customer by account number
  const { data: acctMatch } = await supabase
    .from("customer_accounts")
    .select("customer_id")
    .eq("user_id", userId)
    .eq("account_number", account_number)
    .maybeSingle();

  const screening = screen({ amount, narration: narration ?? "", channel: channel ?? "", account_number });

  const { data: inserted, error } = await supabase
    .from("unified_transactions")
    .insert({
      user_id: userId,
      customer_id: acctMatch?.customer_id ?? null,
      account_number,
      customer_name,
      amount,
      transaction_type,
      transaction_date,
      narration,
      channel,
      branch_code,
      is_flagged: screening.is_flagged,
      flag_severity: screening.severity ?? null,
      flag_reason: screening.reason ?? null,
      flag_rule: screening.rule ?? null,
      review_status: screening.is_flagged ? "pending" : "cleared",
    })
    .select("id, is_flagged, flag_severity")
    .single();

  if (error) return json({ error: "Failed to record transaction" }, 500);

  await supabase.from("webhook_api_keys").update({ last_used_at: new Date().toISOString() }).eq("user_id", userId);

  return json({
    id: inserted.id,
    status: inserted.is_flagged ? "flagged" : "cleared",
    severity: inserted.flag_severity,
  });
});
