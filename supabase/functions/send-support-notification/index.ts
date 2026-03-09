import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { institution_name, subject, message, user_email } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "isaacyesufu00@gmail.com";

    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "RegCo Support <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `Support Ticket: ${subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#1a1a2e;">New Support Ticket</h2>
            <p><strong>Institution:</strong> ${institution_name}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:12px 0;">${message}</div>
            <p style="color:#666;font-size:14px;">Reply directly to the user at <a href="mailto:${user_email}">${user_email}</a></p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
