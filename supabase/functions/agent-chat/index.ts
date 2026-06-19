import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_VERSION = '2023-06-01';
const ANTHROPIC_MODEL = 'claude-3-sonnet-20240229';

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

function extractAssistantText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const data = payload as { content?: Array<{ type?: string; text?: string } | string> };
  if (!Array.isArray(data.content)) return '';
  return data.content
    .map((part) => (typeof part === 'string' ? part : part.type === 'text' ? part.text ?? '' : ''))
    .join('')
    .trim();
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
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('agent-chat missing Supabase auth configuration');
      return jsonResponse({ error: 'Agent service is not configured.' }, 500);
    }

    if (!anthropicApiKey) {
      console.error('agent-chat missing ANTHROPIC_API_KEY');
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

    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': ANTHROPIC_API_VERSION,
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1200,
        system,
        messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text().catch(() => '');
      console.error(`agent-chat provider error status=${anthropicResponse.status} body=${errorText.slice(0, 220)}`);
      return jsonResponse({ error: `AI provider error (${anthropicResponse.status}).` }, 500);
    }

    const payload = await anthropicResponse.json().catch(() => null);
    const content = extractAssistantText(payload);

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
