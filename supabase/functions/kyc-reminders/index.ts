// Weekly KYC remediation reminders. Counts incomplete customer_kyc rows per
// institution and emails the compliance lead the top items still outstanding.
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
    .select("id, company_name, compliance_lead_name, full_name");

  let sent = 0;

  for (const p of profiles || []) {
    const { data: incomplete } = await supabase
      .from("customer_kyc")
      .select("customer_id, missing_items, bvn_verified, address_verified, id_verified")
      .eq("user_id", p.id)
      .eq("kyc_status", "incomplete");
    const list = incomplete || [];
    if (list.length === 0) continue;

    const { data: authUser } = await supabase.auth.admin.getUserById(p.id);
    const email = authUser?.user?.email;
    if (!email) continue;

    const customerIds = list.slice(0, 5).map((r: any) => r.customer_id).filter(Boolean);
    const { data: customers } = customerIds.length > 0
      ? await supabase.from("customers").select("id, full_name").in("id", customerIds)
      : { data: [] };
    const nameById = new Map((customers || []).map((c: any) => [c.id, c.full_name]));

    const top = list.slice(0, 5).map((r: any) => {
      const missing: string[] = [];
      if (!r.bvn_verified) missing.push("BVN");
      if (!r.address_verified) missing.push("Address");
      if (!r.id_verified) missing.push("ID");
      const name = nameById.get(r.customer_id) || "Customer";
      return `<li style="padding:8px 12px;background:#F5F5F0;border-radius:6px;margin-bottom:4px;font-size:13px;"><b>${name}</b> — missing ${missing.join(", ") || "documents"}</li>`;
    }).join("");

    const institutionName = p.company_name || "Your Institution";
    const recipient = p.compliance_lead_name || p.full_name || "Compliance Officer";

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,Helvetica,Arial,sans-serif;background:#F5F5F0;margin:0;padding:24px;color:#0A0A0A;">
<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:14px;border:1px solid rgba(0,0,0,0.08);overflow:hidden;">
  <div style="padding:24px 28px;border-bottom:1px solid rgba(0,0,0,0.06);">
    <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6B6B;font-weight:700;">KYC Remediation Reminder</p>
    <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;">${institutionName}</h1>
  </div>
  <div style="padding:28px;">
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#0A0A0A;">
      You have <b>${list.length}</b> customer${list.length === 1 ? "" : "s"} with incomplete KYC. Outstanding KYC is a CBN finding waiting to happen.
    </p>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.08em;">Top 5 to action</p>
    <ul style="margin:0 0 18px;padding:0;list-style:none;">${top}</ul>
    <a href="${APP_URL}/dashboard/customer-360" style="display:block;background:#0A0A0A;color:#FFFFFF;text-decoration:none;text-align:center;padding:13px;border-radius:8px;font-weight:600;font-size:13px;">Open Customer 360</a>
  </div>
  <div style="padding:18px 28px;background:#FAFAF7;font-size:11px;color:#9B9B9B;text-align:center;">
    Dear ${recipient}, sent every Friday by RegCo Technologies Limited.
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
        subject: `${list.length} customer${list.length === 1 ? "" : "s"} need KYC remediation — ${institutionName}`,
        html,
      }),
    });
    if (r.ok) sent++;
  }

  return new Response(JSON.stringify({ success: true, sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
