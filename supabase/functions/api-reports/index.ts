// Programmatic reports API for higher-tier clients.
// Authenticates with an x-api-key header that matches profiles.reporting_api_key.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-api-key, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey.length < 16) {
    return new Response(JSON.stringify({ error: "Missing or invalid x-api-key header" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, company_name")
    .eq("reporting_api_key", apiKey)
    .maybeSingle();

  if (!profile) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: reports } = await supabase
    .from("reports")
    .select("id, report_type, regulator, status, generated_at, report_filename, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return new Response(JSON.stringify({
    institution: profile.company_name,
    reports: reports || [],
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
