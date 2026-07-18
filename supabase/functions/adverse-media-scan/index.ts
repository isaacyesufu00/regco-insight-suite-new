// Adverse media scan via Lovable AI Gateway. Cached for 24h in adverse_media_cache.
import { createClient } from "npm:@supabase/supabase-js@2";

// Fail-closed CORS: only reflect the configured production origin.
// Set CORS_ALLOWED_ORIGIN in Supabase function env to the Vercel domain.
function corsHeaders(req: Request): HeadersInit {
  const allowed = Deno.env.get("CORS_ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  const allow = allowed && origin === allowed ? allowed : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders(req) });

  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
  const { data: claims, error } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
  if (error || !claims?.claims) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders(req) });
  if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: corsHeaders(req) });

  const body = await req.json().catch(() => ({})) as { name?: string; years?: number; topic?: string };
  if (!body.name) return new Response(JSON.stringify({ error: "name required" }), { status: 400, headers: corsHeaders(req) });
  const years = body.years ?? 5;
  const topic = body.topic ?? "financial crime, fraud, sanctions, regulatory action";

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const queryKey = await sha256(`${body.name.toLowerCase()}|${years}|${topic}`);

  // Cache lookup
  const { data: cached } = await admin.from("adverse_media_cache").select("result,expires_at").eq("query_hash", queryKey).maybeSingle();
  if (cached && new Date((cached as any).expires_at) > new Date()) {
    return new Response(JSON.stringify({ ...((cached as any).result), cached: true }), { headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }

  const prompt = `Search public reporting for adverse media about "${body.name}" in the last ${years} years on topics: ${topic}. Return a concise JSON object with fields: risk_level ("none"|"low"|"medium"|"high"), summary (1-2 sentences), findings (array of {title, source, date_estimate, severity}). If no credible findings, return risk_level:"none" with an empty findings array.`;
  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: "You are an adverse media analyst. Output only valid JSON." }, { role: "user", content: prompt }],
      temperature: 0.1, max_tokens: 800,
    }),
  });
  if (!aiRes.ok) {
    const t = await aiRes.text();
    return new Response(JSON.stringify({ error: `AI backend error ${aiRes.status}: ${t.slice(0, 200)}` }), { status: 500, headers: corsHeaders(req) });
  }
  const aiJson = await aiRes.json().catch(() => null) as any;
  const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
  let parsed: any = {};
  try { parsed = JSON.parse(content); } catch { parsed = { risk_level: "unknown", summary: content, findings: [] }; }

  const result = { name: body.name, years, ...parsed, generated_at: new Date().toISOString() };
  const expires = new Date(Date.now() + 24 * 3600_000).toISOString();
  await admin.from("adverse_media_cache").upsert({ query_hash: queryKey, query: body.name, years, result, expires_at: expires }, { onConflict: "query_hash" });

  return new Response(JSON.stringify(result), { headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
});
