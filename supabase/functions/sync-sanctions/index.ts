import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fail-closed CORS: only reflect the configured production origin.
// Set CORS_ALLOWED_ORIGIN in Supabase function env to the Vercel domain.
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

// Public endpoint — invoked by cron daily and manually from dashboard.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const body = await req.json().catch(() => ({}));
  const targetList: string = body.list || "all";

  type ListResult = { added: number; total: number; duration: number; error?: string };
  const results: Record<string, ListResult> = {};

  const decodeXml = (s: string) =>
    s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");

  // ───────────── LIST 1: UN Security Council ─────────────
  if (targetList === "all" || targetList === "UN Security Council") {
    const start = Date.now();
    let added = 0, total = 0;
    try {
      const response = await fetch("https://scsanctions.un.org/resources/xml/en/consolidated.xml", {
        headers: { Accept: "application/xml", "User-Agent": "RegCo-Compliance-Platform/1.0" },
      });
      if (!response.ok) throw new Error(`UN HTTP ${response.status}`);
      const xmlText = await response.text();

      const extractTag = (block: string, tag: string) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? decodeXml(m[1].trim()) : "";
      };

      const individuals = xmlText.match(/<INDIVIDUAL>[\s\S]*?<\/INDIVIDUAL>/g) || [];
      for (const block of individuals) {
        const parts = ["FIRST_NAME", "SECOND_NAME", "THIRD_NAME", "FOURTH_NAME"]
          .map((t) => extractTag(block, t)).filter(Boolean);
        const fullName = parts.join(" ").trim();
        if (!fullName || fullName.length < 2) continue;

        const aliasMatches = block.match(/<ALIAS_NAME>([\s\S]*?)<\/ALIAS_NAME>/g) || [];
        const aliases = aliasMatches.map((a) => decodeXml(a.replace(/<\/?ALIAS_NAME>/g, "").trim())).filter(Boolean);
        const nationality = extractTag(block, "NATIONALITY");
        const dateListed = extractTag(block, "LISTED_ON");
        const comments = extractTag(block, "COMMENTS1");

        total++;
        const { error } = await supabase.from("sanctions_entries").upsert({
          full_name: fullName,
          aliases: aliases.length ? aliases.join("; ") : null,
          nationality: nationality || null,
          date_listed: dateListed || null,
          list_name: "UN Security Council",
          list_type: "sanctions",
          entity_type: "individual",
          reason: comments ? comments.slice(0, 500) : null,
          source_url: "https://scsanctions.un.org",
          last_updated: new Date().toISOString(),
        }, { onConflict: "full_name,list_name" });
        if (!error) added++;
      }

      const entities = xmlText.match(/<ENTITY>[\s\S]*?<\/ENTITY>/g) || [];
      for (const block of entities) {
        const name = extractTag(block, "FIRST_NAME") || extractTag(block, "ENTITY_NAME");
        if (!name || name.length < 2) continue;
        total++;
        const { error } = await supabase.from("sanctions_entries").upsert({
          full_name: name,
          list_name: "UN Security Council",
          list_type: "sanctions",
          entity_type: "entity",
          source_url: "https://scsanctions.un.org",
          last_updated: new Date().toISOString(),
        }, { onConflict: "full_name,list_name" });
        if (!error) added++;
      }
      results["UN Security Council"] = { added, total, duration: Date.now() - start };
    } catch (e) {
      results["UN Security Council"] = { added, total, error: (e as Error).message, duration: Date.now() - start };
    }
  }

  // ───────────── LIST 2: OFAC SDN ─────────────
  if (targetList === "all" || targetList === "OFAC SDN") {
    const start = Date.now();
    let added = 0, total = 0;
    try {
      const response = await fetch("https://www.treasury.gov/ofac/downloads/sdn.csv", {
        headers: { "User-Agent": "RegCo-Compliance-Platform/1.0" },
      });
      if (!response.ok) throw new Error(`OFAC HTTP ${response.status}`);
      const csvText = await response.text();
      const lines = csvText.split("\n").filter((l) => l.trim());

      for (const line of lines.slice(0, 3000)) {
        const parts = line.split(",").map((p) => p.replace(/^"|"$/g, "").trim());
        const name = parts[1];
        const entityType = parts[2] || "";
        const remarks = parts[11];
        if (!name || name.length < 2 || name === "SDN_Name") continue;
        total++;
        const { error } = await supabase.from("sanctions_entries").upsert({
          full_name: name,
          list_name: "OFAC SDN",
          list_type: "sanctions",
          entity_type: entityType.toLowerCase().includes("individual") ? "individual" : "entity",
          reason: remarks ? remarks.slice(0, 500) : null,
          source_url: "https://www.treasury.gov/ofac",
          last_updated: new Date().toISOString(),
        }, { onConflict: "full_name,list_name" });
        if (!error) added++;
      }
      results["OFAC SDN"] = { added, total, duration: Date.now() - start };
    } catch (e) {
      results["OFAC SDN"] = { added, total, error: (e as Error).message, duration: Date.now() - start };
    }
  }

  // ───────────── LIST 3: EU Consolidated ─────────────
  if (targetList === "all" || targetList === "EU Consolidated") {
    const start = Date.now();
    let added = 0, total = 0;
    try {
      const response = await fetch(
        "https://webgate.ec.europa.eu/fsd/fsf/public/files/xmlFullSanctionsList_1_1/content?token=dG9rZW4tMjAxNw",
        { headers: { "User-Agent": "RegCo-Compliance-Platform/1.0" } },
      );
      if (!response.ok) throw new Error(`EU HTTP ${response.status}`);
      const xmlText = await response.text();
      const entityBlocks = xmlText.match(/<sanctionEntity[\s\S]*?<\/sanctionEntity>/g) || [];
      for (const block of entityBlocks.slice(0, 2000)) {
        const primary = block.match(/wholeName="([^"]+)"/)?.[1];
        const firstName = block.match(/firstName="([^"]+)"/)?.[1];
        const lastName = block.match(/lastName="([^"]+)"/)?.[1];
        const fullName = primary || [firstName, lastName].filter(Boolean).join(" ");
        if (!fullName || fullName.length < 2) continue;
        const subjectType = block.match(/subjectType[^>]*classification="([^"]+)"/)?.[1]?.toLowerCase() || "entity";
        total++;
        const { error } = await supabase.from("sanctions_entries").upsert({
          full_name: fullName.trim(),
          list_name: "EU Consolidated",
          list_type: "sanctions",
          entity_type: subjectType.includes("person") ? "individual" : "entity",
          source_url: "https://webgate.ec.europa.eu/fsd",
          last_updated: new Date().toISOString(),
        }, { onConflict: "full_name,list_name" });
        if (!error) added++;
      }
      results["EU Consolidated"] = { added, total, duration: Date.now() - start };
    } catch (e) {
      results["EU Consolidated"] = { added, total, error: (e as Error).message, duration: Date.now() - start };
    }
  }

  // ───────────── LIST 4: UK HM Treasury ─────────────
  if (targetList === "all" || targetList === "UK HM Treasury") {
    const start = Date.now();
    let added = 0, total = 0;
    try {
      const response = await fetch("https://ofsistorage.blob.core.windows.net/publishlive/ConList.csv", {
        headers: { "User-Agent": "RegCo-Compliance-Platform/1.0" },
      });
      if (!response.ok) throw new Error(`UK HTTP ${response.status}`);
      const csvText = await response.text();
      const lines = csvText.split("\n").filter((l) => l.trim());
      for (const line of lines.slice(1, 2000)) {
        const parts = line.split(",").map((p) => p.replace(/^"|"$/g, "").trim());
        const lastName = parts[0];
        const nameParts = [parts[1], parts[2], parts[3], lastName].filter(Boolean);
        const fullName = nameParts.join(" ").trim();
        const entityType = parts[10] || "";
        if (!fullName || fullName.length < 2 || fullName === "Name 6") continue;
        total++;
        const { error } = await supabase.from("sanctions_entries").upsert({
          full_name: fullName,
          list_name: "UK HM Treasury",
          list_type: "sanctions",
          entity_type: entityType.toLowerCase().includes("individual") ? "individual" : "entity",
          source_url: "https://www.gov.uk/government/publications/financial-sanctions-consolidated-list-of-targets",
          last_updated: new Date().toISOString(),
        }, { onConflict: "full_name,list_name" });
        if (!error) added++;
      }
      results["UK HM Treasury"] = { added, total, duration: Date.now() - start };
    } catch (e) {
      results["UK HM Treasury"] = { added, total, error: (e as Error).message, duration: Date.now() - start };
    }
  }

  // ───────────── LIST 5: CBN Watchlist (curated) ─────────────
  if (targetList === "all" || targetList === "CBN Watchlist") {
    const start = Date.now();
    let added = 0;
    const cbnEntries = [
      { name: "Boko Haram", type: "entity", reason: "Designated terrorist organisation — CBN/NFIU" },
      { name: "Islamic State West Africa Province", type: "entity", reason: "ISWAP — designated terrorist organisation" },
      { name: "Ansaru", type: "entity", reason: "Designated terrorist organisation — CBN circular" },
      { name: "Movement for the Emancipation of the Niger Delta", type: "entity", reason: "MEND — designated" },
    ];
    for (const e of cbnEntries) {
      const { error } = await supabase.from("sanctions_entries").upsert({
        full_name: e.name,
        list_name: "CBN Watchlist",
        list_type: "sanctions",
        entity_type: e.type,
        reason: e.reason,
        source_url: "https://www.cbn.gov.ng",
        last_updated: new Date().toISOString(),
      }, { onConflict: "full_name,list_name" });
      if (!error) added++;
    }
    results["CBN Watchlist"] = { added, total: cbnEntries.length, duration: Date.now() - start };
  }

  // ───────────── Log sync results ─────────────
  for (const [listName, r] of Object.entries(results)) {
    await supabase.from("sanctions_sync_log").insert({
      list_name: listName,
      records_added: r.added,
      total_records: r.total,
      status: r.error ? "error" : "success",
      error_message: r.error || null,
      duration_ms: r.duration,
    });
  }

  const totalAdded = Object.values(results).reduce((s, r) => s + r.added, 0);
  const totalErrors = Object.values(results).filter((r) => r.error).length;

  return new Response(JSON.stringify({
    success: totalErrors === 0,
    total_entries_synced: totalAdded,
    lists_synced: Object.keys(results).length,
    lists_with_errors: totalErrors,
    results,
    synced_at: new Date().toISOString(),
  }), { headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
});
