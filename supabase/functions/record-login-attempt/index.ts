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

    const { data: existing } = await supabase
      .from("login_attempts")
      .select("id, attempt_count, locked_until")
      .eq("email", normalizedEmail)
      .maybeSingle();

    let attemptCount: number;
    let lockedUntil: string | null = null;

    if (!existing) {
      attemptCount = 1;
      await supabase.from("login_attempts").insert({
        email: normalizedEmail,
        attempt_count: 1,
        last_attempt_at: new Date().toISOString(),
        locked_until: null,
      });
    } else {
      attemptCount = (existing.attempt_count ?? 0) + 1;
      if (attemptCount >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      await supabase
        .from("login_attempts")
        .update({
          attempt_count: attemptCount,
          last_attempt_at: new Date().toISOString(),
          locked_until: lockedUntil,
        })
        .eq("id", existing.id);
    }

    const isLocked = !!lockedUntil && new Date(lockedUntil) > new Date();
    const secondsRemaining = isLocked
      ? Math.ceil((new Date(lockedUntil!).getTime() - Date.now()) / 1000)
      : 0;

    return new Response(
      JSON.stringify({
        attempt_count: attemptCount,
        is_locked: isLocked,
        locked_until: lockedUntil,
        remaining_attempts: Math.max(0, 5 - attemptCount),
        seconds_remaining: secondsRemaining,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("record-login-attempt error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
