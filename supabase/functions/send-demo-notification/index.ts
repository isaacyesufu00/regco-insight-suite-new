import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const raw = await req.json();
    const escHtml = (s: unknown) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    const full_name = escHtml(raw.full_name);
    const company_name = escHtml(raw.company_name);
    const email = escHtml(raw.email);
    const phone = escHtml(raw.phone);
    const report_type = escHtml(raw.report_type);
    const message = escHtml(raw.message);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      throw new Error("Missing RESEND_API_KEY or NOTIFICATION_EMAIL secret");
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #3b6ef8; padding-bottom: 12px;">
          New Demo Request — RegCo
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 160px;">Full Name</td>
            <td style="padding: 8px 12px; color: #1a1a2e;">${full_name}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 12px; font-weight: bold; color: #555;">Company</td>
            <td style="padding: 8px 12px; color: #1a1a2e;">${company_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px 12px; color: #1a1a2e;">${email}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 12px; font-weight: bold; color: #555;">Phone</td>
            <td style="padding: 8px 12px; color: #1a1a2e;">${phone || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #555;">Report Type</td>
            <td style="padding: 8px 12px; color: #1a1a2e;">${report_type || "Not specified"}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 12px; font-weight: bold; color: #555;">Message</td>
            <td style="padding: 8px 12px; color: #1a1a2e;">${message || "No message"}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          Sent automatically by RegCo lead capture
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "RegCo <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        subject: `New Demo Request from ${String(raw.full_name ?? "").slice(0, 100)} — ${String(raw.company_name ?? "").slice(0, 100)}`,
        html: htmlBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
