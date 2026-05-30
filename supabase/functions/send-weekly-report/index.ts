// Weekly compliance summary email. Iterates profiles, computes a basic health
// score, and dispatches one email per institution via Resend.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = "https://regco-insight-suite.vercel.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, company_name, full_name, compliance_lead_name");

  let sent = 0;
  const month = new Date().toISOString().slice(0, 7);

  for (const p of profiles || []) {
    const { data: authUser } = await supabase.auth.admin.getUserById(p.id);
    const email = authUser?.user?.email;
    if (!email) continue;

    const [{ data: tasks }, { data: flags }, { data: reports }] = await Promise.all([
      supabase.from("monthly_compliance_tasks").select("status").eq("user_id", p.id).eq("month", month),
      supabase.from("unified_transactions").select("review_status, flag_severity").eq("user_id", p.id).eq("is_flagged", true),
      supabase.from("reports").select("status").eq("user_id", p.id).gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    ]);

    const taskList = tasks || [];
    const flagList = flags || [];
    const reportList = reports || [];

    const pendingTasks = taskList.filter((t: any) => t.status !== "completed").length;
    const pendingFlags = flagList.filter((f: any) => f.review_status === "pending").length;
    const criticalFlags = flagList.filter((f: any) => f.flag_severity === "critical" && f.review_status === "pending").length;
    const failedReports = reportList.filter((r: any) => r.status === "failed").length;

    let score = 100;
    score -= Math.min(pendingTasks * 3, 20);
    score -= Math.min(pendingFlags * 4, 25);
    score -= Math.min(criticalFlags * 6, 30);
    score -= Math.min(failedReports * 5, 15);
    score = Math.max(0, score);

    const institutionName = p.company_name || "Your Institution";
    const recipient = p.compliance_lead_name || p.full_name || "Compliance Officer";

    const scoreColor = score >= 85 ? "#16A34A" : score >= 65 ? "#D97706" : "#DC2626";

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,Helvetica,Arial,sans-serif;background:#F5F5F0;margin:0;padding:24px;color:#0A0A0A;">
<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid rgba(0,0,0,0.08);">
  <div style="padding:24px 28px;border-bottom:1px solid rgba(0,0,0,0.06);">
    <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6B6B;font-weight:700;">RegCo Weekly Summary</p>
    <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;letter-spacing:-0.3px;">${institutionName}</h1>
  </div>
  <div style="padding:32px 28px;text-align:center;">
    <p style="margin:0 0 6px;font-size:11px;color:#9B9B9B;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Compliance Health Score</p>
    <p style="margin:0;font-size:54px;font-weight:800;color:${scoreColor};letter-spacing:-2px;">${score}<span style="font-size:22px;color:#9B9B9B;">/100</span></p>
  </div>
  <div style="padding:0 28px 24px;">
    <p style="font-size:13px;color:#0A0A0A;font-weight:700;margin:0 0 10px;">This week's outstanding items</p>
    <ul style="margin:0;padding:0;list-style:none;">
      <li style="padding:10px 14px;background:#F5F5F0;border-radius:8px;margin-bottom:6px;font-size:13px;">${pendingTasks} compliance tasks pending</li>
      <li style="padding:10px 14px;background:#F5F5F0;border-radius:8px;margin-bottom:6px;font-size:13px;">${pendingFlags} flagged transactions awaiting review${criticalFlags > 0 ? ` (${criticalFlags} critical)` : ""}</li>
      <li style="padding:10px 14px;background:#F5F5F0;border-radius:8px;font-size:13px;">${failedReports} failed report${failedReports === 1 ? "" : "s"} in the last 30 days</li>
    </ul>
  </div>
  <div style="padding:0 28px 28px;">
    <a href="${APP_URL}/dashboard" style="display:block;background:#0A0A0A;color:#FFFFFF;text-decoration:none;text-align:center;padding:13px;border-radius:8px;font-weight:600;font-size:13px;">Open RegCo Dashboard</a>
  </div>
  <div style="padding:18px 28px;background:#FAFAF7;font-size:11px;color:#9B9B9B;text-align:center;">
    Dear ${recipient}, this is your weekly compliance summary. — RegCo Technologies Limited
  </div>
</div>
</body></html>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RegCo <reports@regco.com.ng>",
        to: [email],
        subject: `RegCo Weekly Summary — Score: ${score}/100 — ${institutionName}`,
        html,
      }),
    });
    if (r.ok) sent++;
  }

  return new Response(JSON.stringify({ success: true, sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
