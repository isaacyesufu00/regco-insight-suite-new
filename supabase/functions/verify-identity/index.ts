// Deterministic mock identity verification for BVN / NIN / CAC.
// Phase 3 will swap this for a real vendor (Dojah/Smile ID/VerifyMe).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mockBvn(bvn: string) {
  const h = hash(bvn);
  return {
    verified: bvn.length === 11,
    full_name: ["Adaeze Okafor", "Tunde Bakare", "Halima Yusuf", "Chinedu Eze"][h % 4],
    date_of_birth: `19${70 + (h % 30)}-0${1 + (h % 9)}-1${h % 9}`,
    phone: `+23480${String(h % 100000000).padStart(8, "0")}`,
    enrollment_bank: ["GTBank", "Access Bank", "Zenith Bank", "UBA"][h % 4],
  };
}

function mockNin(nin: string) {
  const h = hash(nin);
  return {
    verified: nin.length === 11,
    full_name: ["Aisha Mohammed", "Emeka Nwosu", "Funmi Adeleke"][h % 3],
    gender: h % 2 ? "M" : "F",
    state_of_origin: ["Lagos", "Kano", "Rivers", "Enugu"][h % 4],
  };
}

function mockCac(rc: string) {
  const h = hash(rc);
  return {
    verified: /^RC\d{4,}/i.test(rc),
    company_name: ["Halcyon Logistics Ltd", "Nexus Trading Co", "Atlas Manufacturing Plc"][h % 3],
    rc_number: rc,
    incorporation_date: `20${10 + (h % 14)}-0${1 + (h % 9)}-15`,
    status: h % 5 ? "active" : "dormant",
    directors: ["John Adekunle", "Mary Obi", "Samuel Bello"].slice(0, 2 + (h % 2)),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
  const { data, error } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
  if (error || !data?.claims) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const body = await req.json().catch(() => ({})) as { id_type?: string; id_number?: string };
  if (!body.id_type || !body.id_number) {
    return new Response(JSON.stringify({ error: "id_type and id_number required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const id = body.id_number.trim();
  let result: Record<string, unknown>;
  switch (body.id_type.toLowerCase()) {
    case "bvn": result = mockBvn(id); break;
    case "nin": result = mockNin(id); break;
    case "cac": case "rc": result = mockCac(id); break;
    default: return new Response(JSON.stringify({ error: "Unsupported id_type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ source: "mock", checked_at: new Date().toISOString(), ...result }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
