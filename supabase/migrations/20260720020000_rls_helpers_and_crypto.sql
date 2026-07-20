-- ============================================================================
-- P0 — Tenant-isolation helpers + FAIL-CLOSED PII/BVN crypto.
--
-- Consolidates the helper functions that were only present in "DRAFT" (unapplied)
-- migrations into a definitive, ordered, idempotent migration so multi-tenant
-- isolation and encrypted PII are guaranteed to exist in prod (CBN Pillar 6/8).
--
-- Also re-asserts the fail-closed crypto functions so they override the
-- hardcoded-fallback versions shipped in the baseline reconstruction, removing
-- the known-constant-key exposure (C4).
--
-- Idempotent: every object uses CREATE OR REPLACE; safe to re-run.
-- ============================================================================

-- 1. Fail-closed secret reader (reads exclusively from Supabase Vault).
--    RAISES when the named secret is absent/empty so callers fail closed.
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

-- 2. PII decrypt — Vault-backed, fail-closed.
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

-- 3. BVN hash — Vault-backed pepper, fail-closed (STABLE, not IMMUTABLE, so
--    pepper rotation is honoured).
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

-- 4. PII encrypt — Vault-backed, fail-closed. Returns hex text so it can be
--    stored in the *_enc columns that fn_decrypt_pii expects to decode.
CREATE OR REPLACE FUNCTION public.fn_encrypt_pii(p_data text)
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  select case
    when p_data is null then null
    else encode(pgp_sym_encrypt(p_data, public._vault_secret('regco.app_enc_key')), 'hex')
  end;
$function$;

-- 5. Resolve the caller's institution (used to scope writes/reads).
CREATE OR REPLACE FUNCTION public.fn_user_institution(p_user uuid)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_inst uuid;
BEGIN
  IF p_user IS NULL THEN
    RETURN NULL;
  END IF;
  SELECT institution_id INTO v_inst
  FROM public.institution_users WHERE user_id = p_user LIMIT 1;
  RETURN v_inst;
END;
$$;

-- 6. Institution-scoped access check (used by audit ledger + RLS).
CREATE OR REPLACE FUNCTION public.has_institution_access(p_user uuid, p_institution uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_user IS NULL OR p_institution IS NULL THEN
    RETURN false;
  END IF;
  IF public.has_role(p_user, 'admin'::app_role) THEN
    RETURN true;
  END IF;
  PERFORM 1 FROM public.institution_users
    WHERE user_id = p_user AND institution_id = p_institution LIMIT 1;
  RETURN FOUND;
END;
$$;

-- 7. Customer ownership guard (used by cac-lookup before acting on a customer).
CREATE OR REPLACE FUNCTION public.fn_user_owns_customer(p_user uuid, p_customer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_inst uuid;
  v_cust_inst uuid;
BEGIN
  IF p_user IS NULL OR p_customer_id IS NULL THEN
    RETURN false;
  END IF;
  IF public.has_role(p_user, 'admin'::app_role) THEN
    RETURN true;
  END IF;
  SELECT institution_id INTO v_inst
  FROM public.institution_users WHERE user_id = p_user LIMIT 1;
  IF v_inst IS NULL THEN
    RETURN false;
  END IF;
  SELECT institution_id INTO v_cust_inst
  FROM public.customers WHERE id = p_customer_id;
  RETURN v_cust_inst IS NOT DISTINCT FROM v_inst;
END;
$$;

-- 8. Default used by several tables' institution_id column. Returns the
--    current caller's institution; NULL under service_role (callers that run
--    as service_role must supply institution_id explicitly).
CREATE OR REPLACE FUNCTION public.get_institution_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT public.fn_user_institution(auth.uid());
$function$;

-- Grants: helpers are invoked from RLS policies / edge functions.
GRANT EXECUTE ON FUNCTION public._vault_secret(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_decrypt_pii(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_hash_bvn(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_encrypt_pii(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_user_institution(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_institution_access(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_user_owns_customer(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_institution_id() TO authenticated;
