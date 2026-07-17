-- ============================================================================
-- P0 #2 — Make PII / BVN crypto FAIL-CLOSED (no hardcoded fallback keys).
--
-- Before: fn_decrypt_pii coalesced app.enc_key to a KNOWN hardcoded key, and
-- fn_hash_bvn baked in a hardcoded pepper. If Vault / app settings were unset,
-- encryption-at-rest was silently defeated — a CBN-examination failure.
--
-- After: both functions read their secret exclusively from
-- current_setting('app.enc_key' / 'app.bvn_pepper'). current_setting() without
-- the missing_ok flag RAISES undefined_configuration when unset, so the
-- functions fail closed instead of decrypting/hashing with a known constant.
--
-- Required Vault / postgresql config (set before this runs in prod):
--   app.enc_key   — 32-char symmetric key (pgp_sym_decrypt)
--   app.bvn_pepper — secret pepper for BVN hashing
--
-- Idempotent: CREATE OR REPLACE FUNCTION.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_decrypt_pii(p_cipher text)
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  select case
    when p_cipher is null then null
    else pgp_sym_decrypt(p_cipher::bytea, current_setting('app.enc_key'))
  end;
$function$;

-- NOTE: IMMUTABLE dropped -> STABLE. The pepper now comes from a GUC
-- (current_setting), which is not immutable; marking it IMMUTABLE would let
-- Postgres cache results across sessions and silently ignore pepper rotation.
-- Any index/constraint depending on fn_hash_bvn's immutability must be rebuilt
-- as a STABLE-expression index (see comment below).
CREATE OR REPLACE FUNCTION public.fn_hash_bvn(p_bvn text)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  select case
    when p_bvn is null then null
    else encode(extensions.digest(p_bvn || current_setting('app.bvn_pepper'), 'sha256'), 'hex')
  end;
$function$;
