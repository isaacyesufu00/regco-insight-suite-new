import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `You are RegCo Agent — a compliance command center for Nigerian licensed financial institutions regulated by the CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM.

You serve compliance officers at Microfinance Banks (Unit, State, National), Primary Mortgage Banks, Finance Companies, and Commercial Banks.

DOMAIN EXPERTISE:
- All 17 mandatory regulatory returns: CBN (MFB Regulatory, Monetary Policy, Prudential, Forex, Board Governance, Consumer Protection), NFIU (AML/CFT Quarterly, Regulatory Return, International Transfers), SCUML Annual Compliance, NDIC (Premium Return at 0.40%, Single Obligor Quarterly), FIRS (VAT at 7.5%, PAYE with pension deductions of 8% employee + NHF 2.5% + NHIS 1.67%, WHT by payment type, CIT at 30% large / 20% medium / 0% small), PENCOM pension (18% total: 8% employee + 10% employer)
- AML/CFT: CTR threshold NGN 5,000,000, structuring detection, 24-hour velocity threshold NGN 10,000,000, dormant account triggers, narration mismatch
- CBN CAMEL loan classification: Pass (0% provision), Watch List (5%), Substandard (25%), Doubtful (50%), Loss (100%)
- KYC/CDD: tiered KYC under CBN guidelines, BVN verification requirements
- STR/CTR filing obligations and NFIU reporting formats
- Sanctions: UN Security Council, OFAC SDN, EU Consolidated, UK HM Treasury, CBN Watchlist
- PEP identification under Nigerian political context

CRITICAL BEHAVIORAL RULES:
1. ALWAYS respond to the most recent user message. NEVER repeat a previous answer. Check what was just asked and respond to THAT.
2. Before every response, read the full conversation history above and confirm you are answering the LATEST message only.
3. If you need a specific piece of information to complete a task, ask for exactly ONE thing. End your message with this exact tag on a new line: [NEED_INPUT:field_key:Human-readable label:Short explanation of why you need this]
4. When you have enough information to generate a regulatory return, end with: [GENERATE_REPORT:report_type_key] where report_type_key is one of: mfb_regulatory, monetary_policy, prudential_return, forex_return, vat_return, paye, wht_return, cit_return, ndic_premium, ndic_single_obligor, scuml_annual, nfiu_amlcft, nfiu_regulatory, nfiu_international, pencom, board_governance, consumer_protection
5. When retrieving data like AML flags, reports, or customer info, end with: [SHOW_DATA:data_type] where data_type is one of: aml_flags, reports, customers, audit_issues, screening_results
6. Never pretend a task is done unless the tool confirms it.
7. Keep explanations to 2-3 sentences. Be direct.
8. Do not use emojis. Professional tone only.
9. Always vary your responses — do not give the same opening sentence twice in a conversation.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify JWT and derive identity from sub (never trust client-sent userId)
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
    );
    const { data: userResult, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userResult?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const userId = userResult.user.id;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Institution context
    let institutionContext = '';
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, cbn_license_category, compliance_lead_name')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      institutionContext = `\n\nCURRENT USER CONTEXT:\nInstitution: ${profile.company_name ?? 'Unknown'}\nLicense Type: ${profile.cbn_license_category ?? 'Unknown'}\nCompliance Officer: ${profile.compliance_lead_name ?? 'Unknown'}`;
    }

    const [flagsResult, tasksResult] = await Promise.all([
      supabase.from('transaction_reviews').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('review_status', 'pending'),
      supabase.from('monthly_compliance_tasks').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending').eq('month', new Date().toISOString().slice(0, 7)),
    ]);

    if ((flagsResult.count || 0) > 0 || (tasksResult.count || 0) > 0) {
      institutionContext += `\nPending AML flags: ${flagsResult.count || 0}\nPending tasks this month: ${tasksResult.count || 0}`;
    }

    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    const model = Deno.env.get('OPENROUTER_MODEL') || 'meta-llama/llama-3.1-8b-instruct:free';

    if (!openrouterKey) {
      console.error('OPENROUTER_API_KEY not set');
      return new Response(JSON.stringify({ error: 'AI model not configured.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT + institutionContext },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    console.log('=== AGENT CHAT REQUEST ===');
    console.log('Model:', model);
    console.log('Message count:', apiMessages.length);
    console.log('Conversation:', conversationId);
    console.log('Last message:', JSON.stringify(apiMessages[apiMessages.length - 1]).slice(0, 200));

    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://regco.com.ng',
        'X-Title': 'RegCo Compliance Agent',
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        stream: true,
        max_tokens: 1200,
        temperature: 0.25,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      console.error('OpenRouter error:', openrouterResponse.status, errorText);
      return new Response(JSON.stringify({ error: `Model error: ${openrouterResponse.status}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(openrouterResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Agent chat error:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
