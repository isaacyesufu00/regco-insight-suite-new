import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const name: string = String(body.name || "").trim();
    const bvn: string | null = body.bvn ? String(body.bvn) : null;
    const customer_id: string | null = body.customer_id || null;

    if (name.length < 2) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const tokens = name.split(/\s+/).filter((t) => t.length > 1);
    const tsQuery = tokens.join(" | ") || name;

    const [sanctionsRes, pepRes] = await Promise.all([
      admin.from("sanctions_entries").select("*")
        .textSearch("full_name", tsQuery, { type: "websearch" })
        .limit(10),
      admin.from("pep_entries").select("*")
        .textSearch("full_name", tsQuery, { type: "websearch" })
        .limit(10),
    ]);

    const sanctionsMatches = sanctionsRes.data || [];
    const pepMatches = pepRes.data || [];

    const criticalMatch = sanctionsMatches.some((m: any) => (m.list_type || "").toLowerCase() === "sanctions");
    const highRisk = sanctionsMatches.some((m: any) => (m.list_type || "").toLowerCase() === "crime");
    const pepMatch = pepMatches.length > 0;
    const risk_level = criticalMatch ? "critical" : highRisk ? "high" : pepMatch ? "medium" : "none";

    const total_matches = sanctionsMatches.length + pepMatches.length;

    await admin.from("screening_results").insert({
      user_id: userId,
      customer_id,
      search_name: name,
      search_bvn: bvn,
      matches_found: total_matches,
      highest_risk: risk_level,
      match_details: { sanctions: sanctionsMatches, pep: pepMatches },
    });

    return new Response(JSON.stringify({
      risk_level,
      sanctions_matches: sanctionsMatches,
      pep_matches: pepMatches,
      total_matches,
      screened_at: new Date().toISOString(),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
