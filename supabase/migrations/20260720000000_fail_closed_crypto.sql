-- ============================================================================
-- P0 #2 — Make PII / BVN crypto FAIL-CLOSED (no hardcoded fallback keys).
--
-- Before: fn_decrypt_pii coalesced app.enc_key to a KNOWN hardcoded key, and
-- fn_hash_bvn baked in a hardcoded pepper. If the secret was unset,
-- encryption-at-rest was silently defeated — a CBN-examination failure.
--
-- After: both functions read their secret EXCLUSIVELY from Supabase Vault via
-- vault.decrypted_secrets (named 'regco.app_enc_key' / 'regco.app_bvn_pepper').
-- If the secret row is missing, the lookup raises — the functions FAIL CLOSED
-- instead of decrypting/hashing with a known constant. Secrets are generated
-- server-side and stored in Vault only; they are never in code or git.
--
-- Required Vault secrets (created out-of-band, never committed):
--   regco.app_enc_key   — 32-byte hex (pgp_sym_decrypt key)
--   regco.app_bvn_pepper — 32-byte hex pepper for BVN hashing
--
-- Idempotent: CREATE OR REPLACE FUNCTION.
-- ============================================================================

-- Internal fail-closed secret reader. SECURITY DEFINER so it can read the
-- vault view; restricted search_path prevents namespace hijack. RAISES when
-- the named secret is absent or empty, so callers fail closed rather than
-- operating on a NULL key/pepper.
CREATE OR REPLACE FUNCTION public._vault_secret(p_name text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'vault'
AS $function$
DECLARE
  v text;
BEGIN
  SELECT decrypted_secret INTO v FROM vault.decrypted_secrets WHERE name = p_name;
  IF v IS NULL OR v = '' THEN
    RAISE EXCEPTION 'secret % not available in Vault', p_name;
  END IF;
  RETURN v;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_decrypt_pii(p_cipher text)
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  select case
    when p_cipher is null then null
    else pgp_sym_decrypt(decode(p_cipher, 'hex'), public._vault_secret('regco.app_enc_key'))
  end;
$function$;

-- NOTE: IMMUTABLE dropped -> STABLE. The pepper now comes from Vault (a view
-- lookup), which is not immutable; marking it IMMUTABLE would let Postgres
-- cache results across sessions and silently ignore pepper rotation.
CREATE OR REPLACE FUNCTION public.fn_hash_bvn(p_bvn text)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  select case
    when p_bvn is null then null
    else encode(extensions.digest(p_bvn || public._vault_secret('regco.app_bvn_pepper'), 'sha256'), 'hex')
  end;
$function$;
