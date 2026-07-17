-- ============================================================================
-- DRAFT — NOT YET APPLIED. For review only.
-- File lives in supabase/migrations/_drafts/ so it is NOT picked up by
-- `supabase db push` until moved to ../ (one level up) and reviewed.
--
-- Fixes (security/integrity, CBN Pillar 6 — Immutable Audit Trail):
--   1. Audit ledger was a SINGLE global hash chain across ALL tenants,
--      ordered by created_at. Cross-tenant inserts reseed each other's
--      prev_hash, so any tenant's chain "breaks" due to another tenant.
--      Verification (fn_verify_audit_chain) walked the whole table and
--      leaked cross-tenant data to admins.
--   2. fn_append_audit_log() was SECURITY DEFINER and never checked that
--      p_user_id matched auth.uid(), allowing forged/spoofed audit rows.
--   3. customers carries institution_id (no user_id), so the trigger wrote
--      user_id = NULL for the most sensitive table -> orphaned rows that
--      match no RLS policy.
--
-- New design: audit_logs is keyed by institution_id (the real isolation
-- boundary used by the rest of the schema). Each institution has its OWN
-- hash chain. Verification is scoped to the caller's institution.
-- ============================================================================

-- 1. Add the tenant key column. Backfill from the row the trigger can see
--    is not possible here (trigger logic changes below instead). We just add
--    the column and an index; existing rows keep NULL until re-chained.
ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS institution_id uuid;

DROP INDEX IF EXISTS idx_audit_logs_inst;
CREATE INDEX idx_audit_logs_inst ON public.audit_logs(institution_id);
-- Keep tenant-scoped chain traversal fast (institution, then chronological).
DROP INDEX IF EXISTS idx_audit_logs_chain;
CREATE INDEX idx_audit_logs_chain
  ON public.audit_logs(institution_id, created_at ASC, id ASC);

-- 2. Helper: resolve an institution_id from a triggering row, regardless of
--    which tenant column that table uses.
CREATE OR REPLACE FUNCTION public.fn_resolve_institution(p_row jsonb)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_inst uuid;
  v_user uuid;
BEGIN
  -- Path A: row already carries institution_id.
  IF p_row ? 'institution_id' AND (p_row ->> 'institution_id') IS NOT NULL THEN
    RETURN (p_row ->> 'institution_id')::uuid;
  END IF;
  -- Path B: row carries user_id -> look up that user's institution.
  IF p_row ? 'user_id' AND (p_row ->> 'user_id') IS NOT NULL THEN
    v_user := (p_row ->> 'user_id')::uuid;
    SELECT institution_id INTO v_inst FROM public.profiles WHERE id = v_user;
    IF v_inst IS NOT NULL THEN
      RETURN v_inst;
    END IF;
    -- Fallback: some tables store institution on the institution_users link.
    SELECT institution_id INTO v_inst
    FROM public.institution_users WHERE user_id = v_user
    LIMIT 1;
    IF v_inst IS NOT NULL THEN
      RETURN v_inst;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

-- 3. Rewrite append to chain PER INSTITUTION and bind the caller.
--    Signature changed (p_user_id -> p_institution_id), so drop the old one.
DROP FUNCTION IF EXISTS public.fn_append_audit_log(uuid, text, text, uuid, jsonb);
CREATE OR REPLACE FUNCTION public.fn_append_audit_log(
  p_institution_id uuid,
  p_action text,
  p_entity text,
  p_entity_id uuid,
  p_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_prev_hash text;
  v_curr_hash text;
  v_log_id uuid;
  v_seed constant text := '0000000000000000000000000000000000000000000000000000000000000000';
BEGIN
  -- Bind the tenant: a DEFINER function must never let caller forge another
  -- institution's ledger. If an institution is supplied it must equal the
  -- caller's resolved institution; anonymous/system writes use NULL seed.
  IF p_institution_id IS NOT NULL THEN
    IF NOT public.has_institution_access(auth.uid(), p_institution_id) THEN
      RAISE EXCEPTION 'Audit write denied: institution mismatch';
    END IF;
  END IF;

  -- Chain only within the same institution.
  SELECT curr_hash INTO v_prev_hash
  FROM public.audit_logs
  WHERE institution_id IS NOT DISTINCT FROM p_institution_id
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  IF v_prev_hash IS NULL THEN
    v_prev_hash := v_seed;
  END IF;

  v_curr_hash := encode(digest(v_prev_hash || p_payload::text, 'sha256'), 'hex');

  INSERT INTO public.audit_logs
    (institution_id, user_id, action, entity, entity_id, payload, prev_hash, curr_hash)
  VALUES
    (p_institution_id, auth.uid(), p_action, p_entity, p_entity_id, p_payload, v_prev_hash, v_curr_hash)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- 4. Rewrite the generic trigger handler to resolve institution_id per row.
CREATE OR REPLACE FUNCTION public.fn_audit_trigger_handler()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row_json jsonb;
  v_entity_id uuid;
  v_inst uuid;
  v_payload jsonb;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    v_row_json := to_jsonb(NEW);
  ELSE
    v_row_json := to_jsonb(OLD);
  END IF;

  v_inst := public.fn_resolve_institution(v_row_json);

  IF v_row_json ? 'id' THEN
    v_entity_id := (v_row_json ->> 'id')::uuid;
  END IF;

  IF TG_OP = 'INSERT' THEN
    v_payload := jsonb_build_object('new', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    v_payload := jsonb_build_object('new', to_jsonb(NEW), 'old', to_jsonb(OLD));
  ELSIF TG_OP = 'DELETE' THEN
    v_payload := jsonb_build_object('old', to_jsonb(OLD));
  END IF;

  PERFORM public.fn_append_audit_log(
    v_inst,
    TG_OP,
    TG_TABLE_NAME::text,
    v_entity_id,
    v_payload
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 5. Resolve the caller's institution (used to scope both writes and reads).
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
  -- Membership via institution_users (profiles has no institution_id column).
  SELECT institution_id INTO v_inst
  FROM public.institution_users WHERE user_id = p_user LIMIT 1;
  RETURN v_inst;
END;
$$;

GRANT EXECUTE ON FUNCTION public.fn_user_institution(uuid) TO authenticated;

-- 5b. Authorization helper referenced above (institution-scoped access).
--    A user may write to an institution's ledger only if they belong to it
--    or are a platform admin.
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
  -- Direct institution membership via institution_users.
  PERFORM 1 FROM public.institution_users
    WHERE user_id = p_user AND institution_id = p_institution LIMIT 1;
  RETURN FOUND;
END;
$$;

-- 6. Per-tenant verification. Walks ONLY the caller's institution chain.
CREATE OR REPLACE FUNCTION public.fn_verify_audit_chain()
RETURNS TABLE (
  is_valid boolean,
  total_checked integer,
  failed_log_id uuid,
  expected_hash text,
  actual_hash text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  rec record;
  v_expected_prev text := '0000000000000000000000000000000000000000000000000000000000000000';
  v_calculated_curr text;
  v_count integer := 0;
  v_inst uuid;
BEGIN
  -- Scope to the caller's institution. Platform admins may pass an explicit
  -- institution via a wrapper if needed; default is the caller's own.
  v_inst := public.fn_user_institution(auth.uid());

  IF v_inst IS NULL AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    -- Non-admin with no institution: can only verify the (empty) NULL chain.
    RETURN QUERY SELECT true, 0, NULL::uuid, NULL::text, NULL::text;
    RETURN;
  END IF;

  FOR rec IN
    SELECT id, payload, prev_hash, curr_hash
    FROM public.audit_logs
    WHERE institution_id IS NOT DISTINCT FROM v_inst
    ORDER BY created_at ASC, id ASC
  LOOP
    v_count := v_count + 1;
    IF rec.prev_hash <> v_expected_prev THEN
      RETURN QUERY SELECT false, v_count, rec.id, v_expected_prev, rec.prev_hash;
      RETURN;
    END IF;
    v_calculated_curr := encode(digest(v_expected_prev || rec.payload::text, 'sha256'), 'hex');
    IF rec.curr_hash <> v_calculated_curr THEN
      RETURN QUERY SELECT false, v_count, rec.id, v_calculated_curr, rec.curr_hash;
      RETURN;
    END IF;
    v_expected_prev := rec.curr_hash;
  END LOOP;

  RETURN QUERY SELECT true, v_count, NULL::uuid, NULL::text, NULL::text;
END;
$$;

-- 7. Grant execute (callers are already auth-gated at the edge function).
GRANT EXECUTE ON FUNCTION public.fn_verify_audit_chain() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_institution_access(uuid, uuid) TO authenticated;

-- 8. RLS: a user sees only their own institution's audit rows (admins all).
DROP POLICY IF EXISTS "Users view own audit logs" ON public.audit_logs;
CREATE POLICY "Users view own institution audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    institution_id IS NOT DISTINCT FROM public.fn_user_institution(auth.uid())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );
