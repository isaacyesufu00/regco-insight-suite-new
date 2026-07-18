// Seeds the regulatory_news table with a curated list of CBN/NDIC/NFIU circulars.
// Public endpoint — verify_jwt disabled in config.toml. Uses service role for upsert.
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
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const circulars = [
    { title: "Revised Minimum Capital Requirements for Microfinance Banks", ref: "FPR/DIR/GEN/CIR/07/007", date: "2024-03-28", affects: "Unit MFB, State MFB, National MFB", category: "Capital Requirements" },
    { title: "Revised AML/CFT Compliance Framework", ref: "NFIU/CGF/I/2023/001", date: "2023-06-15", affects: "All licensed institutions", category: "AML/CFT" },
    { title: "Consumer Protection Framework — Complaints Resolution", ref: "BSD/DIR/GEN/LAB/12/036", date: "2022-10-01", affects: "All licensed institutions", category: "Consumer Protection" },
    { title: "Guidelines on Dormant Accounts and Unclaimed Balances", ref: "FPR/DIR/GEN/CIR/2021/002", date: "2021-08-15", affects: "All deposit-taking institutions", category: "Operations" },
    { title: "SCUML Registration Renewal Requirements", ref: "SCUML/001/2022", date: "2022-03-01", affects: "All licensed institutions", category: "SCUML Compliance" },
    { title: "Operational Guidelines for Agency Banking", ref: "FPR/DIR/GEN/CIR/09/001", date: "2023-11-20", affects: "State MFB, National MFB, Commercial Bank", category: "Agency Banking" },
    { title: "Risk-Based Supervision Framework for MFBs", ref: "BSD/DIR/GEN/CIR/2023/004", date: "2023-04-10", affects: "Unit MFB, State MFB, National MFB", category: "Prudential" },
    { title: "CBN Interest Rate Policy — MPR Adjustment Guidelines", ref: "MPD/DIR/CIR/2024/001", date: "2024-07-23", affects: "All licensed institutions", category: "Monetary Policy" },
    { title: "Know Your Customer Policy Update — Tiered KYC Requirements", ref: "FPR/DIR/GEN/CIR/07/003", date: "2023-09-01", affects: "All licensed institutions", category: "KYC" },
  ];

  let stored = 0;
  for (const c of circulars) {
    const url = `https://www.cbn.gov.ng/regulations/${c.ref.replace(/\//g, "-")}`;
    const { error } = await supabase.from("regulatory_news").upsert({
      title: `[${c.ref}] ${c.title}`,
      description: `Circular Reference: ${c.ref}. Affects: ${c.affects}. Category: ${c.category}.`,
      url,
      published_at: new Date(c.date).toISOString(),
      source: "CBN Official",
      category: "cbn_circular",
      fetched_at: new Date().toISOString(),
    }, { onConflict: "url" });
    if (!error) stored++;
  }

  return new Response(JSON.stringify({ success: true, stored }), {
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
});
