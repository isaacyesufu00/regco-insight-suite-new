import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY =
  Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? ''
const AI_MODEL_ID = Deno.env.get('AI_MODEL_ID') ?? 'google/gemini-2.0-flash-001:free'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !OPENROUTER_API_KEY) {
  throw new Error('Missing SUPABASE_URL, SERVICE_ROLE_KEY, or OPENROUTER_API_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function pickSignalId(body: any) {
  return body?.signal_id ?? body?.id ?? body?.record?.id ?? body?.event?.record?.id ?? null
}

function stripJson(raw: string) {
  const first = raw.indexOf('{')
  const last = raw.lastIndexOf('}')
  if (first < 0 || last < 0 || last <= first) return null
  try {
    return JSON.parse(raw.slice(first, last + 1))
  } catch {
    return null
  }
}

function clampRisk(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 50
  return Math.max(0, Math.min(100, Math.round(n)))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json(405, { error: 'POST only' })

  try {
    const body = await req.json().catch(() => ({}))
    const signalId = pickSignalId(body)
    if (!signalId) return json(400, { error: 'Missing signal_id' })

    const { data: signal, error: signalErr } = await supabase
      .from('fraud_signals')
      .select('id, institution_id, transaction_id, signal_type, status, risk_score, ai_status')
      .eq('id', signalId)
      .maybeSingle()

    if (signalErr) throw signalErr
    if (!signal) return json(404, { error: 'Signal not found' })
    if (signal.ai_status === 'reviewed') {
      return json(200, { status: 'already_reviewed', signal_id: signal.id })
    }

    const { data: transaction, error: txErr } = await supabase
      .from('transactions')
      .select('id, institution_id, account_id, customer_id, amount, currency, created_at, reference, channel, narration, counterparty_name')
      .eq('id', signal.transaction_id)
      .maybeSingle()

    if (txErr) throw txErr
    if (!transaction) return json(404, { error: 'Transaction not found' })

    let customer: any = null
    if (transaction.customer_id) {
      const { data: customerData, error: customerErr } = await supabase
        .from('customers')
        .select('id, institution_id, full_name, email_hash, phone_hash, bvn_hash')
        .eq('id', transaction.customer_id)
        .maybeSingle()

      if (customerErr) throw customerErr
      customer = customerData
    }

    if (transaction.institution_id !== signal.institution_id) {
      return json(409, { error: 'Tenant mismatch between signal and transaction' })
    }
    if (customer?.institution_id && customer.institution_id !== signal.institution_id) {
      return json(409, { error: 'Tenant mismatch between customer and signal' })
    }

    await supabase
      .from('fraud_signals')
      .update({ ai_status: 'processing' })
      .eq('id', signal.id)
      .neq('ai_status', 'reviewed')

    const prompt = {
      signal: {
        id: signal.id,
        type: signal.signal_type,
        current_risk_score: signal.risk_score,
      },
      transaction: {
        id: transaction.id,
        account_id: transaction.account_id,
        amount: transaction.amount,
        currency: transaction.currency,
        created_at: transaction.created_at,
        reference: transaction.reference,
        channel: transaction.channel,
        narration: transaction.narration,
        counterparty_name: transaction.counterparty_name,
      },
      customer: customer
        ? {
            id: customer.id,
            full_name: customer.full_name,
            email_hash: customer.email_hash,
            phone_hash: customer.phone_hash,
            bvn_hash: customer.bvn_hash,
          }
        : null,
    }

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: Bearer ${OPENROUTER_API_KEY},
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL_ID,
        temperature: 0.1,
        max_tokens: 240,
        messages: [
          {
            role: 'system',
            content:
              'Return strict JSON only with keys risk_score, recommended_action, reasoning, open_case. ' +
              'risk_score must be an integer from 0 to 100. recommended_action must be one of close, monitor, review, escalate. ' +
              'reasoning must be short and concrete. open_case must be true or false. No markdown.',
          },
          {
            role: 'user',
            content: JSON.stringify(prompt),
          },
        ],
      }),
    })

    if (!aiRes.ok) {
      const text = await aiRes.text()
      throw new Error(AI request failed: ${aiRes.status} ${text})
    }

    const aiJson = await aiRes.json()
    const rawContent = String(aiJson?.choices?.[0]?.message?.content ?? '{}')
    const parsed = stripJson(rawContent) ?? {}

    const riskScore = clampRisk(parsed.risk_score ?? parsed.riskScore)
    const recommendedAction =
      ['close', 'monitor', 'review', 'escalate'].includes(parsed.recommended_action)
        ? parsed.recommended_action
        : 'review'
    const reasoning = String(parsed.reasoning ?? 'No reasoning returned').slice(0, 1000)
    const openCase = Boolean(parsed.open_case) || riskScore >= 80

    const { error: updateErr } = await supabase
      .from('fraud_signals')
      .update({
        ai_status: 'reviewed',
        ai_reviewed_at: new Date().toISOString(),
        ai_model_id: AI_MODEL_ID,
        risk_score: riskScore,
        recommended_action: recommendedAction,
        reasoning,
      })
      .eq('id', signal.id)

    if (updateErr) throw updateErr

    if (openCase) {
      const { error: caseErr } = await supabase.from('cases').insert({
        institution_id: signal.institution_id,
        title: Automated Risk Alert: ${recommendedAction} - ${customer?.full_name ?? 'Unknown'},
        description: reasoning,
        status: 'pending_review',
        priority: riskScore >= 75 ? 'high' : 'medium',
      })

      if (caseErr) throw caseErr
    }

    return json(200, {
      status: 'success',
      signal_id: signal.id,
      risk_score: riskScore,
      recommended_action: recommendedAction,
      open_case: openCase,
    })
  } catch (err) {
    return json(500, { error: err instanceof Error ? err.message : String(err) })
  }
})
