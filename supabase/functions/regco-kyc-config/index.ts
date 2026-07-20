// supabase/functions/regco-kyc-config/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// Fail-closed CORS: only reflect the configured production origin.
function corsHeaders(req: Request): HeadersInit {
  const allowed = Deno.env.get("CORS_ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  const allow = allowed && origin === allowed ? allowed : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req) });
  }

  try {
    // 1. Verify the caller is an authenticated user (JWT signature checked).
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await authClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(supabaseUrl, serviceKey);

    // 2. Resolve the caller's institution + role. The institution is taken from
    //    the caller's verified membership, never from the request body.
    const { data: instRow } = await serviceClient
      .from("institution_users")
      .select("institution_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!instRow) {
      return new Response(JSON.stringify({ error: "Forbidden: no institution membership" }), {
        status: 403,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("institution_id", instRow.institution_id)
      .maybeSingle();
    const role = roleRow?.role;
    if (role !== "admin" && role !== "compliance_lead") {
      return new Response(JSON.stringify({ error: "Forbidden: admin or compliance_lead required" }), {
        status: 403,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { provider, dojah_app_id, dojah_secret, smile_partner_id, smile_api_key } = await req.json();
    const institution_id = instRow.institution_id;

    // 3. Encrypt secrets with the Vault-backed fail-closed function.
    const enc = async (v: string | undefined) =>
      v ? (await serviceClient.rpc("fn_encrypt_pii", { p_data: v })).data : null;

    await serviceClient.from("institution_kyc_configs").upsert({
      institution_id,
      provider,
      dojah_app_id_enc: await enc(dojah_app_id),
      dojah_secret_enc: await enc(dojah_secret),
      smile_partner_id_enc: await enc(smile_partner_id),
      smile_api_key_enc: await enc(smile_api_key),
      updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
