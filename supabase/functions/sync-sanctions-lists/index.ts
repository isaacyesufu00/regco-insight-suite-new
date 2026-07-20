import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Public endpoint — triggered by cron. No JWT required.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const results = { synced: 0, errors: [] as string[] };
  // Global watchlists are shared across institutions (institution_id NULL).
  const institutionId = null;

  // UN Security Council Consolidated List (XML)
  try {
    const r = await fetch("https://scsanctions.un.org/resources/xml/en/consolidated.xml");
    if (r.ok) {
      const xml = await r.text();
      const firsts = xml.match(/<FIRST_NAME>(.*?)<\/FIRST_NAME>/g) || [];
      const seconds = xml.match(/<SECOND_NAME>(.*?)<\/SECOND_NAME>/g) || [];
      const max = Math.min(firsts.length, 500);
      for (let i = 0; i < max; i++) {
        const f = firsts[i]?.replace(/<\/?FIRST_NAME>/g, "") || "";
        const s = seconds[i]?.replace(/<\/?SECOND_NAME>/g, "") || "";
        const full = `${f} ${s}`.trim();
        if (full.length > 2) {
          const { error } = await admin.from("sanctions_entries").upsert({
            matched_name: full,
            watchlist_name: "UN",
            entity_type: "individual",
            source_url: "https://scsanctions.un.org",
            last_updated: new Date().toISOString(),
            institution_id: institutionId,
          }, { onConflict: "matched_name,watchlist_name" });
          if (!error) results.synced++;
        }
      }
    }
  } catch (e) {
    results.errors.push(`UN: ${(e as Error).message}`);
  }

  // OFAC SDN CSV
  try {
    const r = await fetch("https://www.treasury.gov/ofac/downloads/sdn.csv");
    if (r.ok) {
      const csv = await r.text();
      const lines = csv.split("\n").slice(0, 500);
      for (const line of lines) {
        const parts = line.split(",");
        const name = parts[1]?.replace(/"/g, "").trim();
        if (name && name.length > 2) {
          const { error } = await admin.from("sanctions_entries").upsert({
            matched_name: name,
            watchlist_name: "OFAC",
            entity_type: parts[2]?.toLowerCase().includes("individual") ? "individual" : "entity",
            source_url: "https://treasury.gov/ofac",
            last_updated: new Date().toISOString(),
            institution_id: institutionId,
          }, { onConflict: "matched_name,watchlist_name" });
          if (!error) results.synced++;
        }
      }
    }
  } catch (e) {
    results.errors.push(`OFAC: ${(e as Error).message}`);
  }

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
