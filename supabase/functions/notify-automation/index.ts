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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(req) });
  }

  try {
    const body = await req.json();

    // Fire and forget — trigger process-report without waiting for it to finish
    const processPromise = fetch(
      'https://pdplkprcomjslilznbsl.supabase.co/functions/v1/process-report',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.get('Authorization') || '',
          apikey: Deno.env.get('SUPABASE_ANON_KEY') || '',
        },
        body: JSON.stringify(body),
      },
    );

    // Keep the runtime alive until process-report responds, if EdgeRuntime supports it
    try {
      // @ts-ignore
      EdgeRuntime.waitUntil(processPromise);
    } catch {
      // Not in EdgeRuntime context — proceed without waitUntil
    }

    return new Response(
      JSON.stringify({ received: true, message: 'Report processing started' }),
      {
        status: 200,
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('notify-automation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      },
    );
  }
});
