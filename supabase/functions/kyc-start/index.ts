import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const mask = (bvn: string) => bvn.slice(0,3) + "****" + bvn.slice(-4);
const norm = (s: string) => s?.toLowerCase().trim().replace(/\s+/g," ") || "";

async function fetchTimeout(url: string, opts: RequestInit, ms=10000){
  const c = new AbortController(); const t = setTimeout(()=>c.abort(), ms);
  try { return await fetch(url, { ...opts, signal: c.signal }); } finally { clearTimeout(t); }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"authorization, content-type" }});
  if (req.method !== "POST") return new Response(JSON.stringify({error:"method not allowed"}), {status:405});

  let body: any;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({error:"invalid json"}),{status:400}); }
  const { institution_id, customer_id, bvn, first_name, last_name, dob } = body;

  if (!UUID_RE.test(institution_id||"") || !UUID_RE.test(customer_id||"") ) return new Response(JSON.stringify({error:"invalid institution_id or customer_id"}),{status:400});
  if (!/^\d{11}$/.test(bvn||"")) return new Response(JSON.stringify({error:"BVN must be 11 digits"}),{status:400});
  if (!first_name || !last_name) return new Response(JSON.stringify({error:"first_name and last_name required"}),{status:400});

  // 1. Load customer and enforce tenant isolation server-side
  const { data: cust, error: cErr } = await supabase.from("customers").select("id,institution_id,kyc_attempts,locked_until,bvn_verified").eq("id",customer_id).single();
  if (cErr || !cust) return new Response(JSON.stringify({error:"customer not found"}),{status:404});
  if (cust.institution_id !== institution_id) return new Response(JSON.stringify({error:"tenant mismatch"}),{status:403});
  if (cust.bvn_verified) return new Response(JSON.stringify({ok:true, already_verified:true}),{headers:{"Content-Type":"application/json"}});
  if (cust.locked_until && new Date(cust.locked_until) > new Date()) return new Response(JSON.stringify({error:`locked until ${cust.locked_until}`, bvn_masked: mask(bvn)}),{status:429});

  // 2. Load per-bank provider config - NEVER log decrypted values
  const { data: cfg } = await supabase.from("institution_kyc_configs").select("provider,dojah_app_id_enc,dojah_secret_enc,smile_partner_id_enc,smile_api_key_enc").eq("institution_id",institution_id).single();
  const provider = cfg?.provider || "mock";
  const decrypt = async (enc:string|null) => { if(!enc) return null; const {data}=await supabase.rpc("fn_decrypt_pii",{p_cipher:enc}); return data as string; };

  let nibss: any = null; let provider_ref = ""; let rawResponseForAudit: string | null = null;

  try {
    if (provider === "dojah") {
      const appId = await decrypt(cfg!.dojah_app_id_enc); const secret = await decrypt(cfg!.dojah_secret_enc);
      if(!appId||!secret) throw new Error("dojah keys not configured");
      const r = await fetchTimeout(`https://api.dojah.io/api/v1/kyc/bvn/full?bvn=${bvn}`, { headers: { AppId: appId, Authorization: secret }});
      const j = await r.json(); if(!r.ok) throw new Error(`dojah ${r.status}`);
      nibss = j?.data?.entity || j?.entity; provider_ref = j?.reference || `DOJAH-${bvn}`; rawResponseForAudit = JSON.stringify(j);
    } else if (provider === "smile") {
      const partner = await decrypt(cfg!.smile_partner_id_enc); const apiKey = await decrypt(cfg!.smile_api_key_enc);
      const r = await fetchTimeout("https://api.smileidentity.com/v1/id_verification", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ partner_id: partner, api_key: apiKey, id_number: bvn, id_type:"BVN" })});
      const j = await r.json(); if(!r.ok) throw new Error(`smile ${r.status}`);
      nibss = { first_name: j?.Result?.FirstName, last_name: j?.Result?.LastName, date_of_birth: j?.Result?.DOB, bvn }; provider_ref = j?.SmileJobID || `SMILE-${bvn}`; rawResponseForAudit = JSON.stringify(j);
    } else {
      // MOCK: even last digit = pass, odd = fail, for testing both branches
      const pass = parseInt(bvn.slice(-1)) % 2 === 0;
      if(pass){ nibss = { first_name, last_name, date_of_birth: dob, bvn }; provider_ref = `MOCK-${bvn}`; rawResponseForAudit = JSON.stringify(nibss); }
    }
  } catch (e) {
    console.error("provider error", provider, mask(bvn), (e as Error).message);
    return new Response(JSON.stringify({error:"verification provider unavailable", provider}),{status:502});
  }

  // 3. Bank-grade matching - 40+40+20
  let score = 0; let isMatch = false;
  if(nibss){
    const fn = norm(nibss.first_name||nibss.firstname||""); const ln = norm(nibss.last_name||nibss.lastname||"");
    const dobN = (nibss.date_of_birth||nibss.dob||"").slice(0,10);
    score += fn === norm(first_name) ? 40 : 0; score += ln === norm(last_name) ? 40 : 0; score += !dob || dobN === dob ? 20 : 0;
    isMatch = score >= 80;
  }
  const status = isMatch ? "success" : "failed";

  // 4. Hash + encrypt via DB functions - single source of truth, pepper never leaves Vault
  const { data: bvn_hash } = await supabase.rpc("fn_hash_bvn",{p_bvn:bvn});
  const { data: request_hash } = await supabase.rpc("fn_hash_bvn",{p_bvn:bvn});
  let encResp: string | null = null;
  if(rawResponseForAudit){ const {data}=await supabase.rpc("fn_encrypt_pii",{p_data: rawResponseForAudit}); encResp = data as string; }

  // 5. Atomic WORM commit - no partial state possible
  const { error: atomErr } = await supabase.rpc("fn_atomic_kyc_success",{
    p_institution_id: institution_id, p_customer_id: customer_id, p_bvn_hash: bvn_hash,
    p_provider: provider, p_provider_ref: provider_ref, p_match_score: score, p_status: status,
    p_request_hash: request_hash, p_response_enc: encResp
  });
  if(atomErr){ console.error("atomic fail", atomErr); return new Response(JSON.stringify({error:"commit failed"}),{status:500}); }

  return new Response(JSON.stringify({ ok:isMatch, status, match_score:score, provider, provider_ref, bvn_masked: mask(bvn) }), { headers:{ "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" }});
});