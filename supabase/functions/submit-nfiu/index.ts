import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const report_id = body.report_id as string | undefined;
    if (!report_id) {
      return new Response(JSON.stringify({ error: "report_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );
    const { data: claims } = await admin.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized: User ID not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify tenant ownership of the report before filing.
    const { data: reports, error: repErr } = await admin
      .from("nfiu_reports")
      .select("id, status, report_type")
      .eq("id", report_id)
      .eq("user_id", userId)
      .limit(1);
    if (repErr) throw repErr;
    const report = reports && reports.length > 0 ? reports[0] : null;
    if (!report) {
      return new Response(JSON.stringify({ error: "Report not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (report.status === "filed") {
      return new Response(
        JSON.stringify({ success: true, already_filed: true, message: "Report already filed with NFIU." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // MOCK filing: simulate a successful submission to the NFIU gateway.
    // In production this would POST the stored xml_content to the NFIU endpoint.
    const ackReference = `NFIU-ACK-${Date.now().toString(36).toUpperCase()}`;
    const filedAt = new Date().toISOString();

    const { error: updErr } = await admin
      .from("nfiu_reports")
      .update({ status: "filed", filed_at: filedAt, updated_at: filedAt })
      .eq("id", report_id);
    if (updErr) throw updErr;

    return new Response(
      JSON.stringify({
        success: true,
        report_id,
        status: "filed",
        ack_reference: ackReference,
        filed_at: filedAt,
        message: `Mock filing accepted by NFIU. Acknowledgement ${ackReference}.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-nfiu unexpected error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
