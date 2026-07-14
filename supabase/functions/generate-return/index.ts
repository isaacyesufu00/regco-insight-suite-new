// Generic, template-driven regulatory return generator.
// Reads a `report_templates` row, runs declared data sources, runs readiness
// checks, then renders the requested output formats (CSV / XLSX / XML / PDF stub).
//
// Body: { request_id: uuid, override_readiness?: boolean }
//   OR  { template_code: string, period?: string, params?: object, formats?: string[] }

import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function err(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
function ok(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------- types ----------
type Definition = {
  code: string; title: string; regulator?: string; frequency?: string; version?: number;
  period: { kind: "day" | "week" | "month" | "quarter" | "year" | "event" };
  parameters?: { key: string; label: string; type: "string" | "number" | "date" | "boolean"; required?: boolean }[];
  sources?: SourceDef[];
  readiness?: ReadinessRule[];
  layout?: { cover?: Field[]; sections?: Section[] };
  xml?: XmlNode;
  formats?: string[];
};
type SourceDef = {
  id: string; table: string; select?: string;
  filters?: { col: string; op: "eq"|"neq"|"gt"|"gte"|"lt"|"lte"|"ilike"|"in"; value: any }[];
  user_scoped?: boolean; // default true; scopes by user_id = ctx.userId
  limit?: number;
};
type ReadinessRule =
  | { rule: "min_rows"; source: string; min: number; label: string }
  | { rule: "field_present"; source: string; field: string; label: string };
type Field = { label: string; value: string };
type Section = { id: string; title: string; type: "table" | "fields"; source?: string; columns?: { header: string; value: string }[]; fields?: Field[] };
type XmlNode = {
  name: string;
  namespaces?: Record<string, string>;
  attrs?: Record<string, string>;
  value?: string;
  elements?: XmlNode[];
  repeat_source?: string;
  child?: XmlNode;
  root?: string; // unused, for top-level objects
};

type Ctx = {
  admin: ReturnType<typeof createClient>;
  userClient: ReturnType<typeof createClient>;
  userId: string;
  period: { kind: string; label: string; start: string; end: string };
  params: Record<string, any>;
  data: Record<string, any[]>;
  institution: { name: string };
};

// ---------- period resolver ----------
function resolvePeriod(kind: string, requested?: string) {
  const now = new Date();
  const utcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  let start: Date, end: Date, label: string;
  const req = (requested ?? "").trim().toLowerCase();
  if (req === "today" || req === "") {
    if (kind === "day") { start = utcDay(now); end = new Date(start.getTime() + 86_400_000); label = start.toISOString().slice(0, 10); }
    else if (kind === "week") {
      const d = utcDay(now); const dow = d.getUTCDay(); start = new Date(d.getTime() - dow * 86_400_000); end = new Date(start.getTime() + 7 * 86_400_000); label = `Week of ${start.toISOString().slice(0, 10)}`;
    }
    else if (kind === "month") { start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)); label = start.toISOString().slice(0, 7); }
    else if (kind === "quarter") { const q = Math.floor(now.getUTCMonth() / 3); start = new Date(Date.UTC(now.getUTCFullYear(), q * 3, 1)); end = new Date(Date.UTC(now.getUTCFullYear(), q * 3 + 3, 1)); label = `${now.getUTCFullYear()}-Q${q + 1}`; }
    else if (kind === "year") { start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1)); end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1)); label = String(now.getUTCFullYear()); }
    else { start = utcDay(now); end = new Date(start.getTime() + 86_400_000); label = start.toISOString().slice(0, 10); }
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(req)) {
    start = new Date(req + "T00:00:00Z"); end = new Date(start.getTime() + 86_400_000); label = req;
  } else if (/^\d{4}-\d{2}$/.test(req)) {
    const [y, m] = req.split("-").map(Number); start = new Date(Date.UTC(y, m - 1, 1)); end = new Date(Date.UTC(y, m, 1)); label = req;
  } else if (/^\d{4}-q[1-4]$/.test(req)) {
    const [y, q] = req.split("-q").map(Number); start = new Date(Date.UTC(y, (q - 1) * 3, 1)); end = new Date(Date.UTC(y, (q - 1) * 3 + 3, 1)); label = req.toUpperCase();
  } else if (/^\d{4}$/.test(req)) {
    const y = Number(req); start = new Date(Date.UTC(y, 0, 1)); end = new Date(Date.UTC(y + 1, 0, 1)); label = req;
  } else {
    start = utcDay(now); end = new Date(start.getTime() + 86_400_000); label = start.toISOString().slice(0, 10);
  }
  return { kind, label, start: start.toISOString(), end: end.toISOString() };
}

// ---------- expression eval ----------
// Supports ${path.to.value|filter[:arg]} with nested defaults: ${row.x|default:${row.y}}
function getPath(scope: Record<string, any>, path: string): any {
  return path.split(".").reduce<any>((acc, k) => (acc == null ? undefined : acc[k]), scope);
}
function applyFilter(v: any, filter: string, arg?: string, scope?: Record<string, any>): any {
  switch (filter) {
    case "date": return v ? new Date(v).toISOString().slice(0, 10) : "";
    case "datetime": return v ? new Date(v).toISOString().replace("T", " ").slice(0, 19) : "";
    case "naira": return v == null ? "" : `NGN ${Number(v).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "number": return v == null ? "" : Number(v).toLocaleString("en-NG");
    case "upper": return String(v ?? "").toUpperCase();
    case "lower": return String(v ?? "").toLowerCase();
    case "default":
      if (v != null && v !== "") return v;
      if (arg == null) return "";
      // arg can itself be an expression
      return interpolate(arg, scope ?? {});
    default: return v;
  }
}
export function interpolate(template: string, scope: Record<string, any>): any {
  if (template == null) return template;
  if (typeof template !== "string") return template;
  // Whole-string expression -> preserve raw type
  const whole = template.match(/^\$\{([^}]+)\}$/);
  if (whole) return evalExpr(whole[1], scope);
  return template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    const v = evalExpr(expr, scope);
    return v == null ? "" : String(v);
  });
}
function evalExpr(expr: string, scope: Record<string, any>): any {
  // split into pipeline: path|filter[:arg]|filter2...
  const parts = expr.split("|").map((p) => p.trim());
  const path = parts[0];
  let val = getPath(scope, path);
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const colon = seg.indexOf(":");
    const fname = colon < 0 ? seg : seg.slice(0, colon);
    const arg = colon < 0 ? undefined : seg.slice(colon + 1);
    val = applyFilter(val, fname, arg, scope);
  }
  return val;
}

// ---------- sources ----------
async function runSources(defs: SourceDef[] | undefined, ctx: Ctx): Promise<Record<string, any[]>> {
  const out: Record<string, any[]> = {};
  if (!defs?.length) return out;
  for (const s of defs) {
    let q: any = ctx.userClient.from(s.table).select(s.select ?? "*");
    if (s.user_scoped !== false) q = q.eq("user_id", ctx.userId);
    for (const f of s.filters ?? []) {
      const v = interpolate(String(f.value ?? ""), { period: ctx.period, params: ctx.params });
      if (f.op === "in") q = q.in(f.col, Array.isArray(v) ? v : String(v).split(","));
      else q = (q as any)[f.op](f.col, v);
    }
    if (s.limit) q = q.limit(s.limit);
    const { data, error } = await q;
    if (error) throw new Error(`source ${s.id} failed: ${error.message}`);
    out[s.id] = data ?? [];
  }
  return out;
}

// ---------- readiness ----------
function runReadiness(rules: ReadinessRule[] | undefined, data: Record<string, any[]>) {
  const missing: { field: string; count: number; sample_ids?: string[] }[] = [];
  for (const r of rules ?? []) {
    const rows = data[r.source] ?? [];
    if (r.rule === "min_rows") {
      if (rows.length < r.min) missing.push({ field: r.label, count: r.min - rows.length });
    } else if (r.rule === "field_present") {
      const gaps = rows.filter((row) => row[r.field] == null || row[r.field] === "");
      if (gaps.length) missing.push({ field: r.label, count: gaps.length, sample_ids: gaps.slice(0, 5).map((g) => g.id).filter(Boolean) });
    }
  }
  return { ready: missing.length === 0, missing_fields: missing };
}

// ---------- renderers ----------
function buildTableRows(section: Section, ctx: Ctx): { headers: string[]; rows: string[][] } {
  const cols = section.columns ?? [];
  const headers = cols.map((c) => c.header);
  const src = section.source ? (ctx.data[section.source] ?? []) : [];
  const rows = src.map((row) => cols.map((c) => String(interpolate(c.value, { row, period: ctx.period, params: ctx.params, institution: ctx.institution }) ?? "")));
  return { headers, rows };
}

function renderCsv(def: Definition, ctx: Ctx): string {
  const lines: string[] = [];
  const esc = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  // Cover as key/value pairs
  for (const f of def.layout?.cover ?? []) {
    lines.push(`${esc(f.label)},${esc(String(interpolate(f.value, { period: ctx.period, params: ctx.params, institution: ctx.institution }) ?? ""))}`);
  }
  lines.push("");
  for (const sec of def.layout?.sections ?? []) {
    lines.push(esc(sec.title));
    if (sec.type === "table") {
      const { headers, rows } = buildTableRows(sec, ctx);
      lines.push(headers.map(esc).join(","));
      for (const r of rows) lines.push(r.map(esc).join(","));
    } else {
      for (const f of sec.fields ?? []) {
        lines.push(`${esc(f.label)},${esc(String(interpolate(f.value, { period: ctx.period, params: ctx.params, institution: ctx.institution }) ?? ""))}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}

function renderXlsx(def: Definition, ctx: Ctx): Uint8Array {
  const wb = XLSX.utils.book_new();
  const cover: any[][] = [[def.title], []];
  for (const f of def.layout?.cover ?? []) {
    cover.push([f.label, String(interpolate(f.value, { period: ctx.period, params: ctx.params, institution: ctx.institution }) ?? "")]);
  }
  const ws = XLSX.utils.aoa_to_sheet(cover);
  XLSX.utils.book_append_sheet(wb, ws, "Cover");
  for (const sec of def.layout?.sections ?? []) {
    let sheet: any[][];
    if (sec.type === "table") {
      const { headers, rows } = buildTableRows(sec, ctx);
      sheet = [headers, ...rows];
    } else {
      sheet = (sec.fields ?? []).map((f) => [f.label, String(interpolate(f.value, { period: ctx.period, params: ctx.params, institution: ctx.institution }) ?? "")]);
    }
    const s = XLSX.utils.aoa_to_sheet(sheet);
    XLSX.utils.book_append_sheet(wb, s, sec.title.slice(0, 31) || sec.id);
  }
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return new Uint8Array(buf);
}

function xmlEscape(s: string): string {
  return String(s).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]!));
}
function renderXmlNode(node: XmlNode, scope: Record<string, any>, ctx: Ctx): string {
  if (node.repeat_source && node.child) {
    const src = ctx.data[node.repeat_source] ?? [];
    return src.map((row) => renderXmlNode(node.child!, { ...scope, row }, ctx)).join("");
  }
  const attrs = Object.entries({ ...(node.namespaces ?? {}), ...(node.attrs ?? {}) })
    .map(([k, v]) => ` ${k}="${xmlEscape(String(interpolate(String(v), scope) ?? ""))}"`).join("");
  if (node.elements?.length) {
    const inner = node.elements.map((c) => renderXmlNode(c, scope, ctx)).join("");
    return `<${node.name}${attrs}>${inner}</${node.name}>`;
  }
  const value = node.value != null ? xmlEscape(String(interpolate(node.value, scope) ?? "")) : "";
  return `<${node.name}${attrs}>${value}</${node.name}>`;
}
function renderXml(def: Definition, ctx: Ctx): string | undefined {
  if (!def.xml) return undefined;
  const scope = { period: ctx.period, params: ctx.params, institution: ctx.institution };
  return `<?xml version="1.0" encoding="UTF-8"?>\n` + renderXmlNode(def.xml, scope, ctx);
}

function renderPdfStub(def: Definition, ctx: Ctx): string {
  // Minimal text PDF wrapping — uses the CSV body as readable text.
  // (Full PDF rendering deferred; this still produces a downloadable .txt-as-pdf is unsafe,
  // so we ship a .txt file under pdf_url with a clear filename and TODO note.)
  return `${def.title}\n${ctx.period.label}\n\n${renderCsv(def, ctx)}`;
}

// ---------- storage ----------
async function uploadFile(admin: ReturnType<typeof createClient>, userId: string, filename: string, body: Uint8Array | string, contentType: string): Promise<string> {
  const path = `${userId}/${Date.now()}-${filename}`;
  const blob = typeof body === "string" ? new Blob([body], { type: contentType }) : new Blob([body], { type: contentType });
  const { error } = await admin.storage.from("reports").upload(path, blob, { contentType, upsert: false });
  if (error) throw new Error(`upload ${filename} failed: ${error.message}`);
  const signed = await admin.storage.from("reports").createSignedUrl(path, 3600);
  if (signed.error) throw new Error(signed.error.message);
  return signed.data.signedUrl;
}

// ---------- main ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return err(405, "Method not allowed");

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return err(401, "Unauthorized");
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } }, auth: { persistSession: false },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claims?.claims?.sub) return err(401, "Unauthorized");
  const userId = claims.claims.sub as string;
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const body = await req.json().catch(() => null) as
    | { request_id?: string; template_code?: string; period?: string; params?: Record<string, any>; formats?: string[]; override_readiness?: boolean }
    | null;
  if (!body) return err(400, "Body required");

  // Resolve request_id OR ad-hoc
  let templateCode = body.template_code, period = body.period, params = body.params ?? {}, formats = body.formats ?? [];
  let requestId: string | null = null;
  if (body.request_id) {
    const { data: rr, error } = await admin.from("report_requests").select("*").eq("id", body.request_id).eq("user_id", userId).maybeSingle();
    if (error || !rr) return err(404, "Request not found");
    if (rr.status === "completed") return err(400, "Request already completed");
    templateCode = (rr as any).report_type;
    period = (rr.metadata as any)?.period;
    params = (rr.params as any) ?? (rr.metadata as any)?.params ?? {};
    formats = (rr.formats as any) ?? (rr.metadata as any)?.formats ?? [];
    requestId = rr.id as string;
  }
  if (!templateCode) return err(400, "template_code or request_id required");

  const { data: tplRow, error: tplErr } = await admin.from("report_templates").select("*").eq("code", templateCode).eq("status", "active").maybeSingle();
  if (tplErr || !tplRow) return err(404, `No active template for code ${templateCode}`);
  const def = tplRow.definition as Definition;

  // Institution
  const { data: profile } = await admin.from("profiles").select("company_name,full_name").eq("id", userId).maybeSingle();
  const institution = { name: (profile as any)?.company_name || "Institution" };

  const periodObj = resolvePeriod(def.period?.kind ?? "day", period);
  const ctx: Ctx = { admin, userClient, userId, period: periodObj, params, data: {}, institution };

  try {
    ctx.data = await runSources(def.sources, ctx);
  } catch (e: any) {
    return err(500, e.message ?? "source query failed");
  }
  const readiness = runReadiness(def.readiness, ctx.data);
  if (!readiness.ready && !body.override_readiness) {
    return ok({ ready: false, readiness, period: periodObj, template: { code: def.code, title: def.title } });
  }

  const enabled = formats.length ? formats : (def.formats ?? ["xlsx", "csv"]);
  const safeCode = def.code.replace(/[^A-Z0-9_]/gi, "_");
  const stamp = `${safeCode}_${periodObj.label.replace(/[^0-9A-Za-z-]/g, "")}`;
  const urls: Record<string, string> = {};
  try {
    if (enabled.includes("csv")) urls.csv_url = await uploadFile(admin, userId, `${stamp}.csv`, renderCsv(def, ctx), "text/csv");
    if (enabled.includes("xlsx")) urls.xlsx_url = await uploadFile(admin, userId, `${stamp}.xlsx`, renderXlsx(def, ctx), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    if (enabled.includes("xml") && def.xml) {
      const xml = renderXml(def, ctx)!;
      urls.xml_url = await uploadFile(admin, userId, `${stamp}.xml`, xml, "application/xml");
    }
    if (enabled.includes("pdf")) {
      urls.pdf_url = await uploadFile(admin, userId, `${stamp}.txt`, renderPdfStub(def, ctx), "text/plain");
    }
  } catch (e: any) {
    return err(500, e.message ?? "render failed");
  }

  // reports row
  const { data: reportRow, error: insertErr } = await admin.from("reports").insert({
    user_id: userId, report_name: def.title, report_type: def.code, return_type: def.code,
    template_id: tplRow.id, template_version: tplRow.version, regulator: def.regulator,
    period_start: periodObj.start, period_end: periodObj.end,
    reporting_period_start: periodObj.start, reporting_period_end: periodObj.end,
    status: "Ready", report_filename: `${stamp}`,
    generated_at: new Date().toISOString(), validation_passed: readiness.ready,
    pdf_url: urls.pdf_url ?? null, xlsx_url: urls.xlsx_url ?? null,
    xml_url: urls.xml_url ?? null, csv_url: urls.csv_url ?? null,
    file_url: urls.xml_url ?? urls.xlsx_url ?? urls.csv_url ?? urls.pdf_url ?? null,
  } as any).select().single();
  if (insertErr) return err(500, `report insert failed: ${insertErr.message}`);

  if (requestId) {
    await admin.from("report_requests").update({
      status: "completed", approved_at: new Date().toISOString(), approved_by: userId,
      readiness, report_id: (reportRow as any).id,
    }).eq("id", requestId);
  }

  return ok({
    ok: true, ready: readiness.ready, readiness, period: periodObj,
    template: { code: def.code, title: def.title, version: tplRow.version },
    report_id: (reportRow as any).id, urls,
  });
});
