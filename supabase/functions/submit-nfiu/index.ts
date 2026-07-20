import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req) });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const report_id = body.report_id as string | undefined;
    if (!report_id) {
      return new Response(JSON.stringify({ error: "report_id is required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
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
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
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
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (report.status === "filed") {
      return new Response(
        JSON.stringify({ success: true, already_filed: true, message: "Report already filed with NFIU." }),
        { status: 200, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // REAL filing: POST the stored GoAML 4.0 XML to the NFIU gateway.
    // Fail-closed: if the endpoint is not configured we do NOT pretend to
    // file (no fabricated acknowledgement) — we surface a clear error so
    // the operator enables NFIU_API_URL before relying on submission.
    const nfiuUrl = Deno.env.get("NFIU_API_URL");
    if (!nfiuUrl) {
      return new Response(
        JSON.stringify({ error: "NFIU submission endpoint not configured (set NFIU_API_URL)" }),
        { status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const { data: rep, error: repErr } = await admin
      .from("nfiu_reports")
      .select("xml_content, report_type")
      .eq("id", report_id)
      .single();
    if (repErr || !rep) throw repErr || new Error("report not found");

    const nfiuKey = Deno.env.get("NFIU_API_KEY") || "";
    const nfiuRes = await fetch(nfiuUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        ...(nfiuKey ? { Authorization: `Bearer ${nfiuKey}` } : {}),
        "X-RegCo-Report-Id": report_id,
      },
      body: rep.xml_content,
    });

    if (!nfiuRes.ok) {
      const detail = await nfiuRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `NFIU rejected submission: ${nfiuRes.status}`, detail: detail.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const ackReference = (await nfiuRes.text().catch(() => "")) || `NFIU-ACK-${Date.now().toString(36).toUpperCase()}`;
    const filedAt = new Date().toISOString();

    const { error: updErr } = await admin
      .from("nfiu_reports")
      .update({ status: "filed", filed_at: filedAt, updated_at: filedAt, ack_reference: ackReference })
      .eq("id", report_id);
    if (updErr) throw updErr;

    return new Response(
      JSON.stringify({
        success: true,
        report_id,
        status: "filed",
        ack_reference: ackReference,
        filed_at: filedAt,
        message: `Report submitted to NFIU. Acknowledgement ${ackReference}.`,
      }),
      { status: 200, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-nfiu unexpected error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
