import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length!== b.length) return false
  let res = 0
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return res === 0
}

function badRequest(msg: string, details?: unknown) {
  return new Response(JSON.stringify({ error: msg, details: details || null }), { status: 400, headers: { 'content-type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method!== 'POST') return badRequest('method must be POST')

  const internalSecret = Deno.env.get('INTERNAL_API_SECRET') || ''
  const provided = req.headers.get('x-internal-secret') || ''
  if (!internalSecret ||!provided ||!constantTimeEqual(provided, internalSecret)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } })
  }

  let body: any
  try { body = await req.json() } catch { return badRequest('invalid json') }

  const institution_id = body.institution_id
  const customer_id = body.customer_id
  const external_ref = String(body.external_ref || '').trim()
  const amount = Number(body.amount)
  const channel = String(body.channel || '').toLowerCase()
  const direction = String(body.direction || '').toLowerCase()
  const counterparty_name = body.counterparty_name? String(body.counterparty_name) : null
  const device_id = body.device_id? String(body.device_id) : null
  const ip_address = body.ip_address? String(body.ip_address) : null
  const geo_country = body.geo_country? String(body.geo_country).toUpperCase() : null
  const geo_city = body.geo_city? String(body.geo_city) : null
  const occurred_at = body.occurred_at? new Date(body.occurred_at) : new Date()

  if (!institution_id ||!customer_id ||!external_ref ||!amount || amount <= 0) return badRequest('missing required fields', { required: 'institution_id,customer_id,external_ref,amount,channel,direction' })
  if (external_ref.length > 128) return badRequest('external_ref too long')
  if (['cash','transfer','card','ussd','mobile'].indexOf(channel) === -1) return badRequest('invalid channel')
  if (['in','out'].indexOf(direction) === -1) return badRequest('invalid direction')

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  // idempotency, institution scoped
  const { data: existing } = await supabase.from('monitored_transactions').select('id').eq('institution_id', institution_id).eq('external_ref', external_ref).maybeSingle()
  if (existing) {
    return new Response(JSON.stringify({ ok: true, duplicate: true, transaction_id: existing.id }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  // risk score at time
  let riskScore = 50
  const { data: risk } = await supabase.from('risk_profiles').select('risk_score').eq('institution_id', institution_id).eq('customer_id', customer_id).maybeSingle()
  if (risk && typeof risk.risk_score === 'number') riskScore = risk.risk_score

  // insert transaction
  const { data: txn, error: txnErr } = await supabase.from('monitored_transactions').insert({
    institution_id: institution_id,
    customer_id: customer_id,
    external_ref: external_ref,
    amount: amount,
    channel: channel,
    direction: direction,
    counterparty_name: counterparty_name,
    device_id: device_id,
    ip_address: ip_address,
    geo_country: geo_country,
    geo_city: geo_city,
    occurred_at: occurred_at.toISOString(),
    risk_score_at_time: riskScore
  }).select('id').single()

  if (txnErr ||!txn) {
    return new Response(JSON.stringify({ error: 'insert failed', details: txnErr }), { status: 500, headers: { 'content-type': 'application/json' } })
  }

  const txnId = txn.id
  const alertsToCreate: any[] = []
  const amlToCreate: any[] = []

  // load active rules for this institution
  const { data: fraudRules } = await supabase.from('fraud_rules').select('id,rule_code,threshold,severity').eq('institution_id', institution_id).eq('is_active', true)
  const { data: amlRules } = await supabase.from('aml_rules').select('id,rule_code,threshold,severity').eq('institution_id', institution_id).eq('is_active', true)

  function findRule(rules: any[], code: string) { if (!rules) return null; for (let i = 0; i < rules.length; i++) { if (rules[i].rule_code === code) return rules[i] } return null }

  const now = occurred_at.getTime()
  const tenMinAgo = new Date(now - 10 * 60 * 1000).toISOString()
  const sixtyMinAgo = new Date(now - 60 * 60 * 1000).toISOString()
  const fiveMinAgo = new Date(now - 5 * 60 * 1000).toISOString()
  const twentyFourHrsAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  const twoHrsAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString()

  // FRD_VEL_10M
  if (findRule(fraudRules, 'FRD_VEL_10M')) {
    const { count } = await supabase.from('monitored_transactions').select('id', { count: 'exact', head: true }).eq('institution_id', institution_id).eq('customer_id', customer_id).gte('occurred_at', tenMinAgo)
    if (count && count >= 10) {
      const r = findRule(fraudRules, 'FRD_VEL_10M'); alertsToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 85, evidence: { count: count, window: '10m' }, status: 'open' })
    }
  }

  // FRD_VEL_20H
  if (findRule(fraudRules, 'FRD_VEL_20H')) {
    const { count } = await supabase.from('monitored_transactions').select('id', { count: 'exact', head: true }).eq('institution_id', institution_id).eq('customer_id', customer_id).gte('occurred_at', sixtyMinAgo)
    if (count && count >= 20) {
      const r = findRule(fraudRules, 'FRD_VEL_20H'); alertsToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 75, evidence: { count: count, window: '60m' }, status: 'open' })
    }
  }

  // FRD_AMT_ANOMALY 3x avg 30d over 500k
  if (findRule(fraudRules, 'FRD_AMT_ANOMALY') && amount >= 500000) {
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: hist } = await supabase.from('monitored_transactions').select('amount').eq('institution_id', institution_id).eq('customer_id', customer_id).gte('occurred_at', thirtyDaysAgo).limit(200)
    if (hist && hist.length >= 3) {
      let sum = 0; for (let i = 0; i < hist.length; i++) sum += Number(hist[i].amount); const avg = sum / hist.length
      if (avg > 0 && amount >= avg * 3) {
        const r = findRule(fraudRules, 'FRD_AMT_ANOMALY'); alertsToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 90, evidence: { amount: amount, avg_30d: avg }, status: 'open' })
      }
    }
  }

  // FRD_NEW_DEVICE_HIGH
  if (findRule(fraudRules, 'FRD_NEW_DEVICE_HIGH') && device_id && amount >= 200000) {
    const { data: devHist } = await supabase.from('monitored_transactions').select('id').eq('institution_id', institution_id).eq('customer_id', customer_id).eq('device_id', device_id).limit(1)
    if (!devHist || devHist.length === 0) {
      const r = findRule(fraudRules, 'FRD_NEW_DEVICE_HIGH'); alertsToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 88, evidence: { device_id: device_id, amount: amount }, status: 'open' })
    }
  }

  // FRD_GEO_IMPOSSIBLE
  if (findRule(fraudRules, 'FRD_GEO_IMPOSSIBLE') && geo_country) {
    const { data: last } = await supabase.from('monitored_transactions').select('geo_country,occurred_at').eq('institution_id', institution_id).eq('customer_id', customer_id).neq('id', txnId).order('occurred_at', { ascending: false }).limit(1).maybeSingle()
    if (last && last.geo_country && last.geo_country!== geo_country) {
      const diffMins = (now - new Date(last.occurred_at).getTime()) / 60000
      if (diffMins < 30) {
        const r = findRule(fraudRules, 'FRD_GEO_IMPOSSIBLE'); alertsToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 92, evidence: { from: last.geo_country, to: geo_country, mins: diffMins }, status: 'open' })
      }
    }
  }

  // FRD_CARD_TESTING
  if (findRule(fraudRules, 'FRD_CARD_TESTING') && channel === 'card') {
    const { count } = await supabase.from('monitored_transactions').select('id', { count: 'exact', head: true }).eq('institution_id', institution_id).eq('customer_id', customer_id).eq('channel', 'card').gte('occurred_at', fiveMinAgo)
    if (count && count >= 5) {
      const r = findRule(fraudRules, 'FRD_CARD_TESTING'); alertsToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 80, evidence: { count: count }, status: 'open' })
    }
  }

  // AML_CTR_5M
  if (findRule(amlRules, 'AML_CTR_5M') && amount >= 5000000) {
    const r = findRule(amlRules, 'AML_CTR_5M'); amlToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 95, evidence: { amount: amount, channel: channel }, status: 'open' })
  }

  // AML_HIGH_RISK_GEO
  if (findRule(amlRules, 'AML_HIGH_RISK_GEO') && geo_country) {
    const high = ['IR','KP','SY','RU','MM']; if (high.indexOf(geo_country)!== -1) { const r = findRule(amlRules, 'AML_HIGH_RISK_GEO'); amlToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 90, evidence: { geo_country: geo_country }, status: 'open' }) }
  }

  // AML_STRUCT_24H
  if (findRule(amlRules, 'AML_STRUCT_24H')) {
    const { data: recent } = await supabase.from('monitored_transactions').select('amount').eq('institution_id', institution_id).eq('customer_id', customer_id).gte('occurred_at', twentyFourHrsAgo)
    if (recent) { let c = 0; let total = 0; for (let i = 0; i < recent.length; i++) { const a = Number(recent[i].amount); if (a >= 4000000 && a <= 4999999) { c++; total += a } } if (c >= 3 && total >= 10000000) { const r = findRule(amlRules, 'AML_STRUCT_24H'); amlToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 93, evidence: { count: c, total: total }, status: 'open' }) } }
  }

  // AML_RAPID_MOVE
  if (findRule(amlRules, 'AML_RAPID_MOVE') && direction === 'out') {
    const { data: inflows } = await supabase.from('monitored_transactions').select('amount').eq('institution_id', institution_id).eq('customer_id', customer_id).eq('direction', 'in').gte('occurred_at', twoHrsAgo)
    let inSum = 0; if (inflows) { for (let i = 0; i < inflows.length; i++) inSum += Number(inflows[i].amount) }
    if (inSum > 0 && amount >= inSum * 0.8) { const r = findRule(amlRules, 'AML_RAPID_MOVE'); amlToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 87, evidence: { outflow: amount, inflow_2h: inSum }, status: 'open' }) }
  }

  // AML_PEP_HIGH
  if (findRule(amlRules, 'AML_PEP_HIGH') && amount >= 1000000) {
    const { data: rp } = await supabase.from('risk_profiles').select('risk_tier').eq('institution_id', institution_id).eq('customer_id', customer_id).maybeSingle()
    if (rp && (rp.risk_tier === 'high' || rp.risk_tier === 'pep')) { const r = findRule(amlRules, 'AML_PEP_HIGH'); amlToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 88, evidence: { risk_tier: rp.risk_tier, amount: amount }, status: 'open' }) }
  }

  // AML_DORMANT_WAKE
  if (findRule(amlRules, 'AML_DORMANT_WAKE') && amount >= 500000) {
    const { data: lastTxn } = await supabase.from('monitored_transactions').select('occurred_at').eq('institution_id', institution_id).eq('customer_id', customer_id).neq('id', txnId).order('occurred_at', { ascending: false }).limit(1).maybeSingle()
    if (lastTxn) { const days = (now - new Date(lastTxn.occurred_at).getTime()) / (1000*60*60*24); if (days >= 90) { const r = findRule(amlRules, 'AML_DORMANT_WAKE'); amlToCreate.push({ institution_id: institution_id, customer_id: customer_id, transaction_id: txnId, rule_id: r.id, severity: r.severity, score: 78, evidence: { dormant_days: Math.floor(days), amount: amount }, status: 'open' }) } }
  }

  let fraudIds: string[] = []
  let amlIds: string[] = []
  if (alertsToCreate.length > 0) {
    const { data: ins } = await supabase.from('fraud_alerts').insert(alertsToCreate).select('id'); if (ins) fraudIds = ins.map((x: any) => x.id)
  }
  if (amlToCreate.length > 0) {
    const { data: ins } = await supabase.from('aml_alerts').insert(amlToCreate).select('id'); if (ins) amlIds = ins.map((x: any) => x.id)
  }

  // auto create case for critical
  const hasCritical = alertsToCreate.some((a) => a.severity === 'critical') || amlToCreate.some((a) => a.severity === 'critical')
  if (hasCritical) {
    const { data: c } = await supabase.from('cases').insert({ institution_id: institution_id, customer_id: customer_id, title: 'Auto case for critical alert', status: 'open', priority: 'high' }).select('id').single()
    if (c) {
      const caseId = c.id
      const links: any[] = []
      for (let i = 0; i < fraudIds.length; i++) links.push({ case_id: caseId, alert_id: fraudIds[i], alert_type: 'fraud', institution_id: institution_id })
      for (let i = 0; i < amlIds.length; i++) links.push({ case_id: caseId, alert_id: amlIds[i], alert_type: 'aml', institution_id: institution_id })
      if (links.length > 0) await supabase.from('case_alerts').insert(links)
    }
  }

  return new Response(JSON.stringify({ ok: true, transaction_id: txnId, fraud_alerts: fraudIds.length, aml_alerts: amlIds.length }), { status: 200, headers: { 'content-type': 'application/json' } })
})