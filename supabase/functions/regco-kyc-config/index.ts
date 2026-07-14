// supabase/functions/save-kyc-config/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
Deno.serve(async (req)=>{
  const { institution_id, provider, dojah_app_id, dojah_secret, smile_partner_id, smile_api_key } = await req.json();
  // encrypt with your fn_encrypt_pii (uses vault master key)
  const enc = async (v:string) => v ? (await supabase.rpc('fn_encrypt_pii',{p_data:v})).data : null;
  await supabase.from('institution_kyc_configs').upsert({
    institution_id, provider,
    dojah_app_id_enc: await enc(dojah_app_id),
    dojah_secret_enc: await enc(dojah_secret),
    smile_partner_id_enc: await enc(smile_partner_id),
    smile_api_key_enc: await enc(smile_api_key),
    updated_at: new Date().toISOString()
  });
  return new Response(JSON.stringify({ok:true}));
})