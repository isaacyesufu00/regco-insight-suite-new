const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
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
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('notify-automation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  }
});
