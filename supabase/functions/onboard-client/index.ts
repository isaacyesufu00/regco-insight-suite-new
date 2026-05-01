import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateTempPassword(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    // Verify caller is admin using their token
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      institution_name,
      rc_number,
      cbn_license_category,
      compliance_lead_name,
      email,
      phone,
      report_types,
      onboarding_notes,
    } = body;

    if (!institution_name || !email || !compliance_lead_name || !rc_number || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tempPassword = generateTempPassword();

    // 1. Create auth user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: compliance_lead_name,
        company_name: institution_name,
      },
    });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = newUser.user.id;

    // 2. Update profile with full details (profile is auto-created by trigger)
    await adminClient
      .from("profiles")
      .update({
        company_name: institution_name,
        rc_number,
        cbn_license_category,
        compliance_lead_name,
        phone,
        full_name: compliance_lead_name,
      })
      .eq("id", userId);

    // 3. Delete default report types seeded by trigger and insert selected ones
    await adminClient
      .from("institution_report_types")
      .delete()
      .eq("user_id", userId);

    if (report_types && report_types.length > 0) {
      const reportRows = report_types.map((rt: string) => ({
        user_id: userId,
        report_type: rt,
        is_active: true,
      }));
      await adminClient.from("institution_report_types").insert(reportRows);
    }

    // 4. Update role from default 'user' to 'compliance_lead'
    await adminClient
      .from("user_roles")
      .update({ role: "compliance_lead" })
      .eq("user_id", userId)
      .eq("role", "user");

    // 5. Generate password reset link
    const { data: resetData } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email,
    });

    const resetLink = resetData?.properties?.action_link || `${supabaseUrl}/auth/v1/recover?email=${encodeURIComponent(email)}`;

    // 6. Send welcome email via Resend
    const reportTypesHtml = (report_types || [])
      .map((rt: string) => `<li style="padding:4px 0;color:#334155;">${rt}</li>`)
      .join("");

    const emailHtml = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:40px 32px;text-align:center;">
        <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px;">Welcome to RegCo</h1>
        <p style="color:#93c5fd;font-size:14px;margin:0;">Regulatory Compliance, Simplified</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">Dear ${compliance_lead_name},</p>
        <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 16px;">
          Your institution, <strong>${institution_name}</strong>, has been successfully onboarded to the RegCo platform. 
          You can now generate CBN-ready regulatory reports in minutes instead of days.
        </p>
        <p style="font-size:15px;color:#475569;margin:0 0 8px;font-weight:600;">Your assigned report types:</p>
        <ul style="font-size:14px;margin:0 0 24px;padding-left:20px;">
          ${reportTypesHtml}
        </ul>
        <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">
          To get started, please set up your account password by clicking the button below:
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1e40af);color:#ffffff;font-size:16px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
            Set Up My Account
          </a>
        </div>
        <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0;">
          If you did not expect this email, please disregard it.
        </p>
      </div>
      <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="font-size:12px;color:#94a3b8;margin:0;">© ${new Date().getFullYear()} RegCo. All rights reserved.</p>
      </div>
    </div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RegCo <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to RegCo — Set up your account",
        html: emailHtml,
      }),
    });

    const emailSent = resendRes.ok;

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        email_sent: emailSent,
        institution_name,
        report_types,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
