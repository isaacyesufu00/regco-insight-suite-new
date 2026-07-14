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
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid request." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const normalizedEmail = email.trim().toLowerCase();

    const { data } = await supabase
      .from("login_attempts")
      .select("attempt_count, locked_until")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!data) {
      return new Response(
        JSON.stringify({ is_locked: false, locked_until: null, attempt_count: 0, seconds_remaining: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isLocked = !!data.locked_until && new Date(data.locked_until) > new Date();
    const secondsRemaining = isLocked
      ? Math.ceil((new Date(data.locked_until).getTime() - Date.now()) / 1000)
      : 0;

    return new Response(
      JSON.stringify({
        is_locked: isLocked,
        locked_until: isLocked ? data.locked_until : null,
        attempt_count: data.attempt_count ?? 0,
        seconds_remaining: secondsRemaining,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("check-login-lockout error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
