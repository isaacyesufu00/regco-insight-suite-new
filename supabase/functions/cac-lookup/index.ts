import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fail-closed CORS: only reflect a configured production origin.
// Set CORS_ALLOWED_ORIGIN in Supabase function env to the Vercel domain
// (e.g. https://regco-insight-suite.vercel.app) before deploy.
function corsHeaders(req: Request): HeadersInit {
  const allowed = Deno.env.get("CORS_ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  const allow = allowed && origin === allowed ? allowed : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// Extract the caller's auth.uid() from the verified JWT without a network
// round-trip to the Auth server.
function callerUid(req: Request): string | null {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

async function fetchTimeout(url: string, opts: RequestInit, ms = 10000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: c.signal });
  } finally {
    clearTimeout(t);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req) });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Resolve the verified caller's auth.uid() from the JWT.
    const caller = callerUid(req);
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { customer_id, rc_number, company_name } = body;
    if (!customer_id || !rc_number) {
      return new Response(JSON.stringify({ error: "customer_id and rc_number are required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Initialize admin/service supabase client for secure ops
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // 1. Enforce tenant isolation: the caller must own this customer.
    const { data: owns, error: ownErr } = await admin.rpc("fn_user_owns_customer", {
      p_user_id: caller,
      p_customer_id: customer_id,
    });
    if (ownErr || !owns) {
      return new Response(JSON.stringify({ error: "Forbidden: customer does not belong to your institution" }), {
        status: 403,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // 2. Fetch customer (ownership already verified) for tenant context.
    const { data: customer, error: custError } = await admin
      .from("customers")
      .select("id, institution_id, full_name")
      .eq("id", customer_id)
      .single();

    if (custError || !customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // The actor for the beneficial-owner audit row is the verified caller.
    const userId = caller;

    // 2. Fetch KYC configuration to determine provider (Dojah / Mock)
    const { data: cfg } = await admin
      .from("institution_kyc_configs")
      .select("provider, dojah_app_id_enc, dojah_secret_enc")
      .eq("institution_id", customer.institution_id)
      .single();

    const provider = cfg?.provider || "mock";
    
    let cacData: {
      company_name: string;
      rc_number: string;
      directors: { name: string; bvn?: string; share_pct: number }[];
    } | null = null;

    // Decrypt keys utility
    const decrypt = async (enc: string | null) => {
      if (!enc) return null;
      const { data } = await admin.rpc("fn_decrypt_pii", { p_cipher: enc });
      return data as string;
    };

    // 3. Perform CAC Lookup
    if (provider === "dojah") {
      try {
        const appId = await decrypt(cfg!.dojah_app_id_enc);
        const secret = await decrypt(cfg!.dojah_secret_enc);
        if (!appId || !secret) throw new Error("Dojah credentials not configured in vault");

        const r = await fetchTimeout(
          `https://api.dojah.io/api/v1/kyc/cac?rc_number=${rc_number}&company_name=${company_name || ""}`,
          { headers: { AppId: appId, Authorization: secret } }
        );
        const j = await r.json();
        if (!r.ok) throw new Error(`Dojah API error: ${r.status}`);

        const result = j?.data;
        if (result) {
          // Map Dojah's directors/shareholders array
          const directors = (result.directors || []).map((d: any) => ({
            name: `${d.first_name || ""} ${d.last_name || ""}`.trim(),
            bvn: d.bvn || undefined,
            share_pct: Number(d.share_percentage || d.percentage_share || 0),
          }));
          cacData = {
            company_name: result.company_name || company_name || customer.full_name,
            rc_number: result.rc_number || rc_number,
            directors,
          };
        }
      } catch (e: any) {
        console.error("Dojah CAC Lookup Failed, falling back to mock:", e.message);
      }
    }

    // Mock provider or fallback if Dojah fails/is unconfigured
    if (!cacData) {
      const cleanRC = String(rc_number).toUpperCase().trim();
      if (cleanRC === "RC-1284091") {
        cacData = {
          company_name: "Adebayo Holdings Ltd",
          rc_number: "RC-1284091",
          directors: [
            { name: "Adebayo Tunde", bvn: "30723829118", share_pct: 62.50 },
            { name: "Adebayo Funmi", bvn: "22104928173", share_pct: 20.00 },
            { name: "Okonkwo Chidi", bvn: "22104928114", share_pct: 17.50 },
          ],
        };
      } else if (cleanRC === "RC-3041928") {
        cacData = {
          company_name: "Globalpay Holdings Ltd",
          rc_number: "RC-3041928",
          directors: [
            { name: "Okeke Festus", bvn: "22104928122", share_pct: 100.00 },
          ],
        };
      } else if (cleanRC === "RC-1990842") {
        cacData = {
          company_name: "Bola Estates Ltd",
          rc_number: "RC-1990842",
          directors: [
            { name: "Bola Julius", bvn: "22104928155", share_pct: 55.00 },
            { name: "Alabi Toyin", bvn: "22104928166", share_pct: 45.00 },
          ],
        };
      } else if (cleanRC === "RC-2811209") {
        cacData = {
          company_name: "Sunrise Trading Co.",
          rc_number: "RC-2811209",
          directors: [
            { name: "Ahmed Kabir", bvn: "22104928133", share_pct: 70.00 },
            { name: "Mensah Akua", bvn: "19472810203", share_pct: 30.00 },
          ],
        };
      } else {
        // Dynamic generic mock generator based on company name/RC
        const cleanName = String(company_name || customer.full_name || "Mock Corp").replace(/Ltd|Limited|Holdings/gi, "").trim();
        const lastDigit = parseInt(cleanRC.replace(/\D/g, "")) || 0;
        
        // If odd last digit, introduce a watchlist hit director
        const introducesHit = lastDigit % 2 !== 0;

        cacData = {
          company_name: `${cleanName} Ltd`,
          rc_number: cleanRC,
          directors: introducesHit ? [
            { name: `${cleanName} Owner`, bvn: "22104928001", share_pct: 75.00 },
            { name: "Mensah Akua", bvn: "19472810203", share_pct: 25.00 } // OFAC match
          ] : [
            { name: `${cleanName} Founder`, bvn: "22104928001", share_pct: 60.00 },
            { name: `${cleanName} Partner`, bvn: "22104928002", share_pct: 40.00 }
          ]
        };
      }
    }

    // 4. Clean old beneficial owners to prevent duplicate records
    await admin
      .from("customer_beneficial_owners")
      .delete()
      .eq("customer_id", customer_id);

    // Helper functions for scoring screening matches
    const scoreMatch = (nameParts: string[], matchName: string) => {
      const upper = matchName.toUpperCase();
      const parts = upper.split(/\s+/);
      let s = 0;
      for (const p of nameParts) {
        if (parts.includes(p)) s += 2;
        else if (upper.includes(p)) s += 1;
      }
      return s;
    };

    // 5. Process and Screen each Director/Owner
    const processedOwners = [];
    for (const d of cacData.directors) {
      const cleanName = d.name.toUpperCase().trim();
      const nameParts = cleanName.split(/\s+/).filter((p) => p.length > 2);
      const tsQuery = nameParts.join(" | ") || cleanName;
      const lastName = nameParts[nameParts.length - 1] || cleanName;

      // Direct PEP and Sanctions queries on DB
      const [sanctionsRes, pepRes] = await Promise.all([
        admin.from("sanctions_entries").select("*").ilike("full_name", `%${lastName}%`),
        admin.from("pep_entries").select("*").ilike("full_name", `%${lastName}%`)
      ]);

      const sanctionsMatches = (sanctionsRes.data || [])
        .map((m: any) => ({ ...m, relevance_score: scoreMatch(nameParts, m.full_name) }))
        .filter((m) => m.relevance_score > 0)
        .sort((a, b) => b.relevance_score - a.relevance_score);

      const pepMatches = (pepRes.data || [])
        .map((m: any) => ({ ...m, relevance_score: scoreMatch(nameParts, m.full_name) }))
        .filter((m) => m.relevance_score > 0)
        .sort((a, b) => b.relevance_score - a.relevance_score);

      // Determine risk and status
      const hasSanctions = sanctionsMatches.length > 0;
      const hasPep = pepMatches.length > 0;
      const riskLevel = hasSanctions ? "critical" : hasPep ? "medium" : "none";
      const status = hasSanctions || hasPep ? "flagged" : "clean";

      // Hash BVN if provided
      let bvnHash: string | null = null;
      if (d.bvn) {
        const { data } = await admin.rpc("fn_hash_bvn", { p_bvn: d.bvn });
        bvnHash = data as string;
      }

      const matchPayload = {
        sanctions: sanctionsMatches.slice(0, 5),
        pep: pepMatches.slice(0, 5)
      };

      // Save into DB
      const { error: insErr } = await admin.from("customer_beneficial_owners").insert({
        customer_id,
        user_id: userId,
        owner_name: d.name,
        ownership_pct: d.share_pct,
        bvn_hash: bvnHash,
        screening_status: status,
        screening_risk_level: riskLevel,
        screening_matches: matchPayload,
      });

      if (insErr) {
        console.error("Failed to save beneficial owner:", d.name, insErr);
      }

      processedOwners.push({
        name: d.name,
        share_pct: d.share_pct,
        is_controller: d.share_pct >= 25.0,
        screening: {
          status,
          risk_level: riskLevel,
          matches: totalMatchesCount(sanctionsMatches.length, pepMatches.length)
        }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        company_name: cacData.company_name,
        rc_number: cacData.rc_number,
        owners: processedOwners,
      }),
      {
        status: 200,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("cac-lookup unexpected error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});

function totalMatchesCount(s: number, p: number) {
  return s + p;
}
