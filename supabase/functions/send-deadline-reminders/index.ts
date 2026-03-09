import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CBN deadline logic
function getDeadlinesForReportType(reportType: string, refDate: Date): Date[] {
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const deadlines: Date[] = [];

  switch (reportType) {
    case "MFB Regulatory Return":
      // 10th of each month for previous month
      for (let m = 0; m < 12; m++) deadlines.push(new Date(year, m, 10));
      break;
    case "CBN Monetary Policy Return":
    case "Prudential Return":
      // 15th of each month
      for (let m = 0; m < 12; m++) deadlines.push(new Date(year, m, 15));
      break;
    case "AML/CFT Report":
    case "NFIU Regulatory Return":
      // 30 days after quarter end: Apr 30, Jul 31, Oct 31, Jan 31
      deadlines.push(new Date(year, 3, 30)); // Apr 30
      deadlines.push(new Date(year, 6, 31)); // Jul 31
      deadlines.push(new Date(year, 9, 31)); // Oct 31
      deadlines.push(new Date(year + 1, 0, 31)); // Jan 31 next year
      deadlines.push(new Date(year - 1 + 1, 0, 31)); // Jan 31 current year
      break;
    case "SCUML Compliance Report":
      // Mar 31 each year
      deadlines.push(new Date(year, 2, 31));
      break;
    case "CBN Forex Return":
      // 15th of each month (monthly) + every Monday (weekly)
      for (let m = 0; m < 12; m++) deadlines.push(new Date(year, m, 15));
      // Add weekly Mondays for the next 90 days from refDate
      const d = new Date(refDate);
      for (let i = 0; i < 90; i++) {
        const check = new Date(d.getTime() + i * 86400000);
        if (check.getDay() === 1) deadlines.push(check);
      }
      break;
  }
  return deadlines;
}

function getNextDeadline(reportType: string, refDate: Date): Date | null {
  const deadlines = getDeadlinesForReportType(reportType, refDate);
  const future = deadlines.filter((d) => d >= refDate).sort((a, b) => a.getTime() - b.getTime());
  return future[0] || null;
}

function getReportingPeriodKey(reportType: string, deadline: Date): string {
  return `${reportType}-${deadline.toISOString().split("T")[0]}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date();
    const results: string[] = [];

    // Get all active institutions (profiles with active status)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, company_name, full_name")
      .eq("account_status", "Active");

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: "No active profiles" }), { headers: corsHeaders });
    }

    for (const profile of profiles) {
      // Get assigned report types
      const { data: reportTypes } = await supabase
        .from("institution_report_types")
        .select("report_type")
        .eq("user_id", profile.id)
        .eq("is_active", true);

      if (!reportTypes || reportTypes.length === 0) continue;

      // Get user email from auth
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
      if (!authUser?.user?.email) continue;
      const email = authUser.user.email;

      // Get user's ready reports
      const { data: readyReports } = await supabase
        .from("reports")
        .select("report_type, status, reporting_period_start, reporting_period_end")
        .eq("user_id", profile.id)
        .eq("status", "Ready");

      for (const { report_type } of reportTypes) {
        // Check deadlines: 14-day, 3-day, overdue (within 7 days past)
        const allDeadlines = getDeadlinesForReportType(report_type, now);

        for (const deadline of allDeadlines) {
          const diffMs = deadline.getTime() - now.getTime();
          const diffDays = Math.round(diffMs / 86400000);
          const periodKey = getReportingPeriodKey(report_type, deadline);

          // Check if ready report exists for this period
          const hasReady = (readyReports || []).some(
            (r) => r.report_type === report_type && r.reporting_period_end && new Date(r.reporting_period_end) >= new Date(deadline.getTime() - 35 * 86400000)
          );
          if (hasReady) continue;

          let reminderType: string | null = null;
          let subject = "";

          if (diffDays === 14) {
            reminderType = "14-day";
            subject = `Reminder: Your ${report_type} is due in 14 days`;
          } else if (diffDays === 3) {
            reminderType = "3-day";
            subject = `Urgent: Your ${report_type} is due in 3 days`;
          } else if (diffDays < 0 && diffDays >= -7) {
            reminderType = "overdue";
            subject = `Action Required: Your ${report_type} submission is overdue`;
          }

          if (!reminderType) continue;

          // Check if already sent
          const { data: existing } = await supabase
            .from("email_reminders")
            .select("id")
            .eq("user_id", profile.id)
            .eq("report_type", report_type)
            .eq("reporting_period", periodKey)
            .eq("reminder_type", reminderType)
            .maybeSingle();

          if (existing) continue;

          // Send email via Resend
          const deadlineFmt = deadline.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
          const emailBody = `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
              <div style="background: #0f1b2d; padding: 32px; text-align: center;">
                <h1 style="color: #fff; font-size: 24px; margin: 0;">RegCo</h1>
              </div>
              <div style="padding: 32px;">
                <p style="font-size: 16px; color: #1a1a2e;">Dear ${profile.company_name || profile.full_name},</p>
                <p style="font-size: 15px; color: #444; line-height: 1.6;">
                  ${reminderType === "14-day" ? `This is a reminder that your <strong>${report_type}</strong> is due on <strong>${deadlineFmt}</strong> — 14 days from now.` : ""}
                  ${reminderType === "3-day" ? `<strong>Urgent:</strong> Your <strong>${report_type}</strong> is due on <strong>${deadlineFmt}</strong> — only 3 days away. Please generate and submit your report immediately.` : ""}
                  ${reminderType === "overdue" ? `Your <strong>${report_type}</strong> was due on <strong>${deadlineFmt}</strong> and has not been submitted. This may affect your compliance score. Please take action immediately.` : ""}
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://regco.app/dashboard/new-report" style="display: inline-block; background: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                    Generate Report Now
                  </a>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center;">This is an automated reminder from RegCo Compliance Platform.</p>
              </div>
            </div>
          `;

          const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "RegCo <onboarding@resend.dev>",
              to: [email],
              subject,
              html: emailBody,
            }),
          });
          await resendRes.text();

          // Record sent reminder
          await supabase.from("email_reminders").insert({
            user_id: profile.id,
            report_type,
            reporting_period: periodKey,
            reminder_type: reminderType,
          });

          results.push(`${reminderType} → ${email} for ${report_type}`);
        }
      }
    }

    return new Response(JSON.stringify({ sent: results.length, details: results }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
