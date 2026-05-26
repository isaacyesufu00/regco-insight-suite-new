import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

    const cleanName = name.toUpperCase();
    const nameParts = cleanName.split(/\s+/).filter((p) => p.length > 2);
    const tsQuery = nameParts.join(" | ") || cleanName;
    const lastName = nameParts[nameParts.length - 1] || cleanName;

    const [ftsRes, ilikeRes, pepFtsRes, pepIlikeRes] = await Promise.all([
      admin.from("sanctions_entries").select("*")
        .textSearch("full_name", tsQuery, { type: "websearch", config: "simple" })
        .limit(25),
      admin.from("sanctions_entries").select("*")
        .ilike("full_name", `%${lastName}%`).limit(25),
      admin.from("pep_entries").select("*")
        .textSearch("full_name", tsQuery, { type: "websearch", config: "simple" })
        .limit(15),
      admin.from("pep_entries").select("*")
        .ilike("full_name", `%${lastName}%`).limit(15),
    ]);

    const dedupe = <T extends { id: string }>(arr: T[]) =>
      arr.filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i);

    const allSanctions = dedupe([...(ftsRes.data || []), ...(ilikeRes.data || [])]);
    const allPep = dedupe([...(pepFtsRes.data || []), ...(pepIlikeRes.data || [])]);

    const score = (matchName: string) => {
      const upper = matchName.toUpperCase();
      const parts = upper.split(/\s+/);
      let s = 0;
      for (const p of nameParts) {
        if (parts.includes(p)) s += 2;
        else if (upper.includes(p)) s += 1;
      }
      return s;
    };

    const sanctionsMatches = allSanctions
      .map((m: any) => ({ ...m, relevance_score: score(m.full_name) }))
      .filter((m) => m.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 10);

    const pepMatches = allPep
      .map((m: any) => ({ ...m, relevance_score: score(m.full_name) }))
      .filter((m) => m.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 10);

    const risk_level =
      sanctionsMatches.length > 0 ? "critical" :
      pepMatches.length > 0 ? "medium" : "none";

    const total_matches = sanctionsMatches.length + pepMatches.length;

    await admin.from("screening_results").insert({
      user_id: userId,
      customer_id,
      search_name: name,
      search_bvn: bvn,
      matches_found: total_matches,
      highest_risk: risk_level,
      match_details: { sanctions: sanctionsMatches.slice(0, 5), pep: pepMatches.slice(0, 5) },
    });

    return new Response(JSON.stringify({
      risk_level,
      sanctions_matches: sanctionsMatches,
      pep_matches: pepMatches,
      total_matches,
      lists_checked: ["UN Security Council", "OFAC SDN", "EU Consolidated", "UK HM Treasury", "CBN Watchlist"],
      screened_at: new Date().toISOString(),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
