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

async function sha256Hex(value) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(buf));
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

// Per-institution binding. The request also carries an API key
// (x-api-key-prefix / x-api-key). We resolve the owning
// institution from that key and reject any payload that targets a
// different institution_id — otherwise a single shared HMAC secret
// would let one institution push transactions attributed to another
// (cross-institution forgery). The HMAC signature check below
// still runs against the global Vault secret (contract unchanged).
const keyClient = createClient(
Deno.env.get("SUPABASE_URL")!,
Deno.env.get("REGCO_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
{ auth: { persistSession: false } },
);
const { data: keyRow, error: keyErr } = await keyClient
.from("webhook_api_keys")
.select("key_hash, institution_id")
.eq("key_prefix", apiKeyPrefix)
.eq("active", true)
.maybeSingle();
if (keyErr || !keyRow || !keyRow.key_hash) {
return new Response(
JSON.stringify({ ok: false, error: "unknown_api_key" }),
{ status: 401, headers: { "content-type": "application/json" } },
);
}
const providedKeyHash = await sha256Hex(apiKey);
if (!timingSafeEqual(providedKeyHash, keyRow.key_hash)) {
return new Response(
JSON.stringify({ ok: false, error: "bad_api_key" }),
{ status: 401, headers: { "content-type": "application/json" } },
);
}
const keyInstitution = keyRow.institution_id;
if (!keyInstitution) {
return new Response(
JSON.stringify({ ok: false, error: "key_not_bound_to_institution" }),
{ status: 401, headers: { "content-type": "application/json" } },
);
}
// Bind: force the payload institution to the key's institution.
if (payload.institution_id && payload.institution_id !== keyInstitution) {
return new Response(
JSON.stringify({ ok: false, error: "institution_mismatch" }),
{ status: 403, headers: { "content-type": "application/json" } },
);
}
payload.institution_id = keyInstitution;

// Fail-closed: the HMAC secret is read from Supabase Vault via webhook_hmac_secret().
// If the secret row is absent the helper RAISES and we reject the request — we never
// fall back to a known constant. The supabase client is created just below.
const supabaseForSecret = createClient(
Deno.env.get("SUPABASE_URL")!,
Deno.env.get("REGCO_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
{ auth: { persistSession: false } },
);
const { data: secretData, error: secretErr } = await supabaseForSecret.rpc("webhook_hmac_secret");
if (secretErr || !secretData) {
console.error("webhook HMAC secret unavailable in Vault", secretErr?.message);
return new Response(
JSON.stringify({ ok: false, error: "webhook_secret_unavailable" }),
{ status: 500, headers: { "content-type": "application/json" } },
);
}
const secret = secretData as string;
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
