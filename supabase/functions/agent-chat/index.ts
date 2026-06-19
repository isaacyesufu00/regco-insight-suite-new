import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { generateText } from 'npm:ai';
import { createOpenAICompatible } from 'npm:@ai-sdk/openai-compatible';

const AGENT_MODEL = 'google/gemini-3-flash-preview';
const LOVABLE_AIG_RUN_ID_HEADER = 'X-Lovable-AIG-Run-ID';

type AgentRole = 'user' | 'assistant';
type AgentMessage = { role: AgentRole; content: string };

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isAgentMessage(value: unknown): value is AgentMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<AgentMessage>;
  return (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string';
}

function createLovableGateway(lovableApiKey: string, initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return createOpenAICompatible({
    name: 'lovable',
    baseURL: 'https://ai.gateway.lovable.dev/v1',
    headers: {
      'Lovable-API-Key': lovableApiKey,
      'X-Lovable-AIG-SDK': 'vercel-ai-sdk',
    },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      const response = await fetch(input, { ...init, headers });
      runId = response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || runId;
      return response;
    },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const startedAt = Date.now();
  console.log('agent-chat request started');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('agent-chat missing Supabase auth configuration');
      return jsonResponse({ error: 'Agent service is not configured.' }, 500);
    }

    if (!lovableApiKey) {
      console.error('agent-chat missing LOVABLE_API_KEY');
      return jsonResponse({ error: 'AI model is not configured.' }, 500);
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userResult, error: userError } = await userClient.auth.getUser();
    if (userError || !userResult?.user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const body = await req.json().catch(() => null) as { messages?: unknown; system?: unknown } | null;
    const system = typeof body?.system === 'string' ? body.system : '';
    const messages = Array.isArray(body?.messages) ? body.messages.filter(isAgentMessage) : [];

    if (!system.trim()) {
      return jsonResponse({ error: 'System prompt is required.' }, 400);
    }

    if (messages.length === 0) {
      return jsonResponse({ error: 'At least one message is required.' }, 400);
    }

    console.log(`agent-chat validated request user=${userResult.user.id} messages=${messages.length}`);

    const gateway = createLovableGateway(lovableApiKey, req.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
    const result = await generateText({
      model: gateway(AGENT_MODEL),
      system,
      messages,
      temperature: 0.25,
      maxOutputTokens: 1200,
    });

    const content = result.text.trim();

    if (!content) {
      console.error('agent-chat provider returned no text');
      return jsonResponse({ error: 'AI provider returned no content.' }, 500);
    }

    console.log(`agent-chat request completed duration_ms=${Date.now() - startedAt}`);
    return jsonResponse({ content });
  } catch (error) {
    console.error('agent-chat unexpected error', error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: 'Agent request failed.' }, 500);
  }
});
