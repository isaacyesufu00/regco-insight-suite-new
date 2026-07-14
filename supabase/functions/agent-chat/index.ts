import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const LOVABLE_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const DEFAULT_OPENROUTER_MODEL = Deno.env.get('OPENROUTER_MODEL') || 'google/gemini-2.5-flash';
const LOVABLE_MODEL = 'google/gemini-3-flash-preview';

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
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('agent-chat missing Supabase auth configuration');
      return jsonResponse({ error: 'Agent service is not configured.' }, 500);
    }
    if (!openRouterKey && !lovableApiKey) {
      console.error('agent-chat missing AI provider key');
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

    // Prefer OpenRouter (customer's own billing); fall back to Lovable gateway only if no OR key.
    const useOpenRouter = !!openRouterKey;
    const url = useOpenRouter ? OPENROUTER_URL : LOVABLE_GATEWAY_URL;
    const model = useOpenRouter ? DEFAULT_OPENROUTER_MODEL : LOVABLE_MODEL;
    const headers: Record<string, string> = useOpenRouter
      ? {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://regco.lovable.app',
          'X-Title': 'RegCo Compliance Agent',
        }
      : {
          'Content-Type': 'application/json',
          'Lovable-API-Key': lovableApiKey!,
        };

    const payload = {
      model,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.25,
      max_tokens: 1200,
    };

    console.log(`agent-chat calling ${useOpenRouter ? 'OpenRouter' : 'Lovable'} model=${model}`);

    const aiResponse = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text().catch(() => '');
      console.error(`agent-chat gateway error status=${aiResponse.status} body=${errText.slice(0, 500)}`);
      if (aiResponse.status === 401) {
        return jsonResponse({ error: 'AI gateway authentication failed. Check the OpenRouter API key in Supabase secrets.' }, 500);
      }
      if (aiResponse.status === 429) {
        return jsonResponse({ error: 'AI rate limit reached. Please try again shortly.' }, 500);
      }
      if (aiResponse.status === 402) {
        return jsonResponse({ error: 'OpenRouter credits exhausted. Top up at openrouter.ai/credits.' }, 500);
      }
      const shortMessage = errText.replace(/\s+/g, ' ').trim().slice(0, 240) || aiResponse.statusText || 'Unknown AI backend failure';
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
