import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const AGENT_MODEL = 'google/gemini-3-flash-preview';
const LOVABLE_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type AgentRole = 'user' | 'assistant' | 'system';
type AgentMessage = { role: AgentRole; content: string };

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isAgentMessage(value: unknown): value is AgentMessage {
  if (!value || typeof value !== 'object') return false;
  const m = value as Partial<AgentMessage>;
  return (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

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
    if (!authHeader) return jsonResponse({ error: 'Unauthorized' }, 401);

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userResult, error: userError } = await userClient.auth.getUser();
    if (userError || !userResult?.user) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await req.json().catch(() => null) as { messages?: unknown; system?: unknown } | null;
    const system = typeof body?.system === 'string' ? body.system.trim() : '';
    const messages = Array.isArray(body?.messages) ? body.messages.filter(isAgentMessage) : [];

    if (!system) return jsonResponse({ error: 'System prompt is required.' }, 400);
    if (messages.length === 0) return jsonResponse({ error: 'At least one message is required.' }, 400);

    console.log(`agent-chat validated user=${userResult.user.id} msgs=${messages.length}`);

    // Build OpenAI-compatible payload — Lovable AI Gateway accepts this shape.
    const payload = {
      model: AGENT_MODEL,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.25,
      max_tokens: 1200,
    };

    console.log(`agent-chat calling Lovable AI Gateway url=${LOVABLE_GATEWAY_URL}`);

    const aiResponse = await fetch(LOVABLE_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': lovableApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text().catch(() => '');
      console.error(`agent-chat gateway error status=${aiResponse.status} body=${errText.slice(0, 500)}`);
      const shortMessage = errText.replace(/\s+/g, ' ').trim().slice(0, 240) || aiResponse.statusText || 'Unknown AI backend failure';
      if (aiResponse.status === 429) {
        return jsonResponse({ error: 'AI rate limit reached. Please try again shortly.' }, 500);
      }
      if (aiResponse.status === 402) {
        return jsonResponse({ error: 'AI credits exhausted. Please top up your workspace.' }, 500);
      }
      return jsonResponse({ error: `AI backend error (${aiResponse.status}): ${shortMessage}` }, 500);
    }

    const data = await aiResponse.json().catch(() => null) as
      | { choices?: Array<{ message?: { content?: string } }>; content?: string | Array<{ type?: string; text?: string }> }
      | null;

    const arrayContent = Array.isArray(data?.content)
      ? data.content.map((part) => typeof part?.text === 'string' ? part.text : '').join('').trim()
      : '';
    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      arrayContent ||
      (typeof data?.content === 'string' ? data.content.trim() : '');

    if (!content) {
      console.error('agent-chat empty content from gateway', JSON.stringify(data).slice(0, 500));
      return jsonResponse({ error: 'AI provider returned no content.' }, 500);
    }

    console.log(`agent-chat completed duration_ms=${Date.now() - startedAt}`);
    return jsonResponse({ content });
  } catch (error) {
    console.error('agent-chat unexpected error', error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: 'Agent request failed.' }, 500);
  }
});
