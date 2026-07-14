import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const HMAC_SECRET = Deno.env.get("RECEIVE_TRANSACTION_HMAC_SECRET") || "regco-sentinel-v1";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function hexToBytes(hex: string): Uint8Array {
  if (!/^[0-9a-f]{64}$/i.test(hex)) {
    throw new Error("invalid_signature_format");
  }

  const normalized = hex.toLowerCase();
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const signature = req.headers.get("x-signature") || "";
    const timestamp = req.headers.get("x-timestamp") || "";
    const idempotencyKey = req.headers.get("x-idempotency-key") || "";

    if (!signature || !timestamp || !idempotencyKey) {
      return new Response("Missing headers", { status: 400 });
    }

    if (!/^[0-9a-f]{64}$/i.test(signature)) {
      return new Response("Invalid signature format", { status: 401 });
    }

    const timestampMs = parseInt(timestamp, 10);
    if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 300000) {
      return new Response("Invalid timestamp", { status: 401 });
    }

    const rawBody = await req.text();
    if (rawBody.length > 1024 * 1024) {
      return new Response("Payload too large", { status: 413 });
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(HMAC_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const message = "v1\nPOST\nreceive-transaction\n" + timestamp + "\n" + idempotencyKey + "\n" + rawBody;
    const sigBytes = hexToBytes(signature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(message)
    );

    if (!isValid) {
      return new Response("Signature mismatch", { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response("Server misconfigured", { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase.rpc("ingest_transaction_webhook", {
      p_institution_id: payload.institution_id,
      p_idempotency_key: idempotencyKey,
      p_request_signature: signature,
      p_raw_payload: payload
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
      duplicate: false,
      transaction_id: data
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";

    if (message === "invalid_signature_format") {
      return new Response("Invalid signature format", { status: 401 });
    }

    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});