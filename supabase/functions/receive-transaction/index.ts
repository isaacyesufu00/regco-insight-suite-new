import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

function toHex(bytes) {
return Array.from(bytes).map(function (b) {
return b.toString(16).padStart(2, "0");
}).join("");
}

function timingSafeEqual(a, b) {
if (typeof a !== "string" || typeof b !== "string") return false;
if (a.length !== b.length) return false;
let out = 0;
for (let i = 0; i < a.length; i++) {
out |= a.charCodeAt(i) ^ b.charCodeAt(i);
}
return out === 0;
}

async function hmacSha256Hex(secret, message) {
const key = await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(secret),
{ name: "HMAC", hash: "SHA-256" },
false,
["sign"],
);
const sig = await crypto.subtle.sign(
"HMAC",
key,
new TextEncoder().encode(message),
);
return toHex(new Uint8Array(sig));
}

function isHex64(value) {
return typeof value === "string" && /^[0-9a-f]{64}$/i.test(value);
}

Deno.serve(async function (req) {
try {
if (req.method !== "POST") {
return new Response(
JSON.stringify({ ok: false, error: "method_not_allowed" }),
{ status: 405, headers: { "content-type": "application/json" } },
);
}
const apiKeyPrefix = req.headers.get("x-api-key-prefix") || "";
const apiKey = req.headers.get("x-api-key") || "";
const signature = (req.headers.get("x-signature") || "").toLowerCase();
const timestamp = req.headers.get("x-timestamp") || "";
const idempotencyKey = req.headers.get("x-idempotency-key") || "";
if (!apiKeyPrefix || !apiKey || !signature || !timestamp || !idempotencyKey) {
return new Response(
JSON.stringify({ ok: false, error: "missing_headers" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
if (!isHex64(signature)) {
return new Response(
JSON.stringify({ ok: false, error: "invalid_signature_format" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
if (!/^[0-9]+$/.test(timestamp)) {
return new Response(
JSON.stringify({ ok: false, error: "invalid_timestamp" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
if (idempotencyKey.length < 8 || idempotencyKey.length > 128) {
return new Response(
JSON.stringify({ ok: false, error: "invalid_idempotency_key" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
const rawBody = await req.text();
if (rawBody.length > 1024 * 1024) {
return new Response(
JSON.stringify({ ok: false, error: "payload_too_large" }),
{ status: 413, headers: { "content-type": "application/json" } },
);
}
let payload;
try {
payload = JSON.parse(rawBody);
} catch (_err) {
return new Response(
JSON.stringify({ ok: false, error: "invalid_json" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
const ts = Number(timestamp);
if (!Number.isSafeInteger(ts)) {
return new Response(
JSON.stringify({ ok: false, error: "invalid_timestamp" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
const skewMs = Math.abs(Date.now() - ts);
if (skewMs > 5 * 60 * 1000) {
return new Response(
JSON.stringify({ ok: false, error: "timestamp_skew_too_large" }),
{ status: 401, headers: { "content-type": "application/json" } },
);
}
const secret =
Deno.env.get("RECEIVE_TRANSACTION_HMAC_SECRET") ||
Deno.env.get("HMAC_SECRET") ||
"regco-sentinel-v1";
const canonical =
"v1\nPOST\nreceive-transaction\n" +
timestamp +
"\n" +
idempotencyKey +
"\n" +
rawBody;
const expectedSignature = await hmacSha256Hex(secret, canonical);
if (!timingSafeEqual(signature, expectedSignature)) {
return new Response(
JSON.stringify({ ok: false, error: "bad_signature" }),
{ status: 401, headers: { "content-type": "application/json" } },
);
}
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey =
Deno.env.get("REGCO_SERVICE_ROLE_KEY") ||
Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !serviceRoleKey) {
return new Response(
JSON.stringify({ ok: false, error: "missing_supabase_env" }),
{ status: 500, headers: { "content-type": "application/json" } },
);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, {
auth: { persistSession: false },
});
const institutionId = payload.institution_id || null;
if (!institutionId) {
return new Response(
JSON.stringify({ ok: false, error: "missing_institution_id" }),
{ status: 400, headers: { "content-type": "application/json" } },
);
}
const { data: existing, error: existingError } = await supabase
.from("receive_transaction_requests")
.select("id, transaction_id")
.eq("institution_id", institutionId)
.eq("idempotency_key", idempotencyKey)
.maybeSingle();
if (existingError) {
return new Response(
JSON.stringify({ ok: false, error: existingError.message }),
{ status: 500, headers: { "content-type": "application/json" } },
);
}
if (existing && existing.transaction_id) {
return new Response(
JSON.stringify({
ok: true,
duplicate: true,
request_id: existing.id,
transaction_id: existing.transaction_id,
}),
{ status: 200, headers: { "content-type": "application/json" } },
);
}
const { data: result, error: rpcError } = await supabase.rpc(
"ingest_transaction_webhook",
{
p_institution_id: institutionId,
p_idempotency_key: idempotencyKey,
p_request_signature: signature,
p_raw_payload: payload,
},
);
if (rpcError) {
return new Response(
JSON.stringify({ ok: false, error: rpcError.message }),
{ status: 500, headers: { "content-type": "application/json" } },
);
}
return new Response(
JSON.stringify({
ok: true,
duplicate: false,
result: result,
}),
{ status: 200, headers: { "content-type": "application/json" } },
);
} catch (err) {
return new Response(
JSON.stringify({
ok: false,
error: err instanceof Error ? err.message : "unknown_error",
}),
{ status: 500, headers: { "content-type": "application/json" } },
);
}
});
