import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length!== b.length) return false
  let res = 0
  for (let i = 0; i < a.length; i++) {
    res = res | (a.charCodeAt(i) ^ b.charCodeAt(i))
  }
  return res === 0
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data))
  const bytes = new Uint8Array(sig)
  let hex = ""
  for (let i = 0; i < bytes.length; i++) {
    const h = bytes[i].toString(16)
    hex = hex + (h.length === 1? "0" + h : h)
  }
  return hex
}

serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "")
  const raw = await req.text()
  const secret = Deno.env.get("KYC_WEBHOOK_SECRET") || ""
  if (secret) {
    const sigHeader = req.headers.get("x-dojah-signature") || req.headers.get("x-smile-signature") || req.headers.get("x-webhook-signature") || ""
    if (!sigHeader) {
      return new Response(JSON.stringify({ error: "missing signature" }), { status: 401, headers: { "Content-Type": "application/json" } })
    }
    const expected = await hmacHex(secret, raw)
    if (!timingSafeEqual(expected, sigHeader.toLowerCase())) {
      return new Response(JSON.stringify({ error: "invalid signature" }), { status: 401, headers: { "Content-Type": "application/json" } })
    }
  }
  let body: any = {}
  try { body = JSON.parse(raw) } catch { body = {} }
  const ref = body.job_id || body.reference || body.request_id || ""
  if (!ref) return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
  const { data: screening } = await supabase.from("identity_screening").select("id,institution_id,status,provider_payload").eq("provider_reference", ref).maybeSingle()
  if (!screening) return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
  const isPass = body.ResultCode === "1012" || body.job_success === true || (body.entity && body.entity.nin_status === "verified")
  const isFail = body.ResultCode === "1020" || body.verification_status === false
  let newStatus = "pending"
  if (isPass) newStatus = "approved"
  if (isFail) newStatus = "rejected"
  if (newStatus === "pending") return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
  if (screening.status === newStatus) return new Response(JSON.stringify({ ok: true, idempotent: true }), { headers: { "Content-Type": "application/json" } })
  const updatedPayload = {...screening.provider_payload, last_webhook_at: new Date().toISOString(), last_result_code: body.ResultCode || body.status || "unknown" }
  await supabase.from("identity_screening").update({ provider_payload: updatedPayload, provider_status: newStatus }).eq("id", screening.id)
  await supabase.from("kyc_attempts").insert({ screening_id: screening.id, institution_id: screening.institution_id, provider: req.headers.get("x-provider") || "unknown", check_type: "webhook", response_payload: { job_id: ref, result: body.ResultCode || body.status }, status: newStatus })
  const { error } = await supabase.rpc("review_identity_screening", { p_screening_id: screening.id, p_new_status: newStatus, p_note: "webhook verified " + (body.ResultCode || "") })
  if (error) {
    await supabase.from("identity_review_events").insert({ screening_id: screening.id, institution_id: screening.institution_id, old_status: screening.status, new_status: newStatus, note: "webhook fallback, rpc error " + error.message })
    await supabase.from("identity_screening").update({ status: newStatus }).eq("id", screening.id)
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
})