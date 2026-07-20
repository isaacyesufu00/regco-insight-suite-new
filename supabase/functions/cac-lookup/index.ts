import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fail-closed CORS: only reflect a configured production origin.
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

async function fetchTimeout(url: string, opts: RequestInit, ms = 10000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: c.signal });
  } finally {
    clearTimeout(t);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req) });
  }

  try {
    // 1. Verify the caller (JWT signature checked server-side). Always trust the
    //    verified identity, never a hand-parsed token.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
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
    const caller = user.id;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { customer_id, rc_number, company_name } = body;
    if (!customer_id || !rc_number) {
      return new Response(JSON.stringify({ error: "customer_id and rc_number are required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // 2. Enforce tenant isolation: the caller must own this customer.
    const { data: owns, error: ownErr } = await admin.rpc("fn_user_owns_customer", {
      p_user_id: caller,
      p_customer_id: customer_id,
    });
    if (ownErr || !owns) {
      return new Response(JSON.stringify({ error: "Forbidden: customer does not belong to your institution" }), {
        status: 403,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { data: customer, error: custError } = await admin
      .from("customers")
      .select("id, institution_id, full_name")
      .eq("id", customer_id)
      .single();
    if (custError || !customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { data: cfg } = await admin
      .from("institution_kyc_configs")
      .select("provider, dojah_app_id_enc, dojah_secret_enc")
      .eq("institution_id", customer.institution_id)
      .single();

    const provider = cfg?.provider || "mock";

    const decrypt = async (enc: string | null) => {
      if (!enc) return null;
      const { data } = await admin.rpc("fn_decrypt_pii", { p_cipher: enc });
      return data as string;
    };

    // 3. Perform CAC lookup — REAL provider only. On any failure we FAIL CLOSED:
    //    we never fabricate directors or invent sanctions/PEP "hits".
    let cacData: {
      company_name: string;
      rc_number: string;
      directors: { name: string; bvn?: string; share_pct: number }[];
    } | null = null;

    if (provider === "dojah") {
      try {
        const appId = await decrypt(cfg!.dojah_app_id_enc);
        const secret = await decrypt(cfg!.dojah_secret_enc);
        if (!appId || !secret) throw new Error("Dojah credentials not configured in vault");

        const r = await fetchTimeout(
          `https://api.dojah.io/api/v1/kyc/cac?rc_number=${rc_number}&company_name=${company_name || ""}`,
          { headers: { AppId: appId, Authorization: secret } }
        );
        const j = await r.json();
        if (!r.ok) throw new Error(`Dojah API error: ${r.status}`);

        const result = j?.data;
        if (result) {
          const directors = (result.directors || []).map((d: any) => ({
            name: `${d.first_name || ""} ${d.last_name || ""}`.trim(),
            bvn: d.bvn || undefined,
            share_pct: Number(d.share_percentage || d.percentage_share || 0),
          }));
          cacData = {
            company_name: result.company_name || company_name || customer.full_name,
            rc_number: result.rc_number || rc_number,
            directors,
          };
        }
      } catch (e: any) {
        console.error("Dojah CAC Lookup failed:", e.message);
        return new Response(
          JSON.stringify({ error: "CAC verification unavailable. Please retry shortly or contact support.", provider_error: e.message }),
          { status: 502, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
        );
      }
    } else {
      // No real provider configured — do NOT fabricate. Surface the gap.
      return new Response(
        JSON.stringify({ error: "CAC verification is not configured for this institution." }),
        { status: 503, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    if (!cacData) {
      return new Response(
        JSON.stringify({ error: "CAC returned no data for this RC number." }),
        { status: 404, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // 4. Replace prior beneficial owners for this customer.
    await admin
      .from("customer_beneficial_owners")
      .delete()
      .eq("customer_id", customer_id);

    const scoreMatch = (nameParts: string[], matchName: string) => {
      const upper = matchName.toUpperCase();
      const parts = upper.split(/\s+/);
      let s = 0;
      for (const p of nameParts) {
        if (parts.includes(p)) s += 2;
        else if (upper.includes(p)) s += 1;
      }
      return s;
    };

    // 5. Screen each real director against the live watchlists. For
    //    sanctions_entries the authoritative name column is matched_name; for
    //    pep_entries it is full_name (added in Phase 1).
    const processedOwners: any[] = [];
    for (const d of cacData.directors) {
      const cleanName = d.name.toUpperCase().trim();
      const nameParts = cleanName.split(/\s+/).filter((p) => p.length > 2);
      const lastName = nameParts[nameParts.length - 1] || cleanName;

      const [sanctionsRes, pepRes] = await Promise.all([
        admin.from("sanctions_entries").select("*").ilike("matched_name", `%${lastName}%`),
        admin.from("pep_entries").select("*").ilike("full_name", `%${lastName}%`),
      ]);

      const sanctionsMatches = (sanctionsRes.data || [])
        .map((m: any) => ({ ...m, relevance_score: scoreMatch(nameParts, m.matched_name) }))
        .filter((m: any) => m.relevance_score > 0)
        .sort((a: any, b: any) => b.relevance_score - a.relevance_score);

      const pepMatches = (pepRes.data || [])
        .map((m: any) => ({ ...m, relevance_score: scoreMatch(nameParts, m.full_name) }))
        .filter((m: any) => m.relevance_score > 0)
        .sort((a: any, b: any) => b.relevance_score - a.relevance_score);

      const hasSanctions = sanctionsMatches.length > 0;
      const hasPep = pepMatches.length > 0;
      const riskLevel = hasSanctions ? "critical" : hasPep ? "medium" : "none";
      const status = hasSanctions || hasPep ? "flagged" : "clean";

      let bvnHash: string | null = null;
      if (d.bvn) {
        const { data } = await admin.rpc("fn_hash_bvn", { p_bvn: d.bvn });
        bvnHash = data as string;
      }

      const matchPayload = {
        sanctions: sanctionsMatches.slice(0, 5),
        pep: pepMatches.slice(0, 5),
      };

      const { error: insErr } = await admin.from("customer_beneficial_owners").insert({
        customer_id,
        user_id: caller,
        owner_name: d.name,
        ownership_pct: d.share_pct,
        bvn_hash: bvnHash,
        screening_status: status,
        screening_risk_level: riskLevel,
        screening_matches: matchPayload,
      });
      if (insErr) console.error("Failed to save beneficial owner:", d.name, insErr);

      processedOwners.push({
        name: d.name,
        share_pct: d.share_pct,
        is_controller: d.share_pct >= 25.0,
        screening: { status, risk_level: riskLevel, matches: sanctionsMatches.length + pepMatches.length },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        company_name: cacData.company_name,
        rc_number: cacData.rc_number,
        owners: processedOwners,
      }),
      { status: 200, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("cac-lookup unexpected error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});

function totalMatchesCount(s: number, p: number) {
  return s + p;
}
