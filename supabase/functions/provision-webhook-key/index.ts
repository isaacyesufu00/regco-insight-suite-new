// Provision / rotate a webhook API key for the signed-in user.
// Returns the plaintext key ONCE. Subsequent reads only return the prefix.
import { createClient } from "npm:@supabase/supabase-js@2";

// Fail-closed CORS: only reflect a configured production origin.
// Set CORS_ALLOWED_ORIGIN in Supabase function env to the Vercel domain
// (e.g. https://regco-insight-suite.vercel.app) before deploy.
function corsHeaders(req: Request): HeadersInit {
  const allowed = Deno.env.get("CORS_ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  const allow = allowed && origin === allowed ? allowed : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Vary": "Origin",
  };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `rgc_${hex}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });

  const auth = req.headers.get("Authorization");
  if (!auth) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
  if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
  const userId = userData.user.id;

  if (req.method === "GET") {
    const { data } = await supabase
      .from("webhook_api_keys")
      .select("key_prefix, active, last_used_at, created_at")
      .eq("user_id", userId)
      .maybeSingle();
    return json({ key: data ?? null });
  }

  if (req.method === "POST") {
    const newKey = generateKey();
    const hash = await sha256(newKey);
    const prefix = newKey.slice(0, 10);

    // Stamp the owning institution so receive-transaction can bind each
    // request to the API key's institution (prevents cross-institution
    // forgery). A user may belong to several institutions; pick the first.
    const { data: instRow } = await supabase
      .from("institution_users")
      .select("institution_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    const institutionId = instRow?.institution_id ?? null;

    const { data: existing } = await supabase
      .from("webhook_api_keys")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("webhook_api_keys")
        .update({ key_hash: hash, key_prefix: prefix, active: true, institution_id: institutionId })
        .eq("user_id", userId);
      if (error) return json({ error: "Failed to rotate key" }, 500);
    } else {
      const { error } = await supabase
        .from("webhook_api_keys")
        .insert({ user_id: userId, key_hash: hash, key_prefix: prefix, active: true, institution_id: institutionId });
      if (error) return json({ error: "Failed to create key" }, 500);
    }

    return json({ api_key: newKey, prefix });
  }

  return json({ error: "Method not allowed" }, 405);
});
