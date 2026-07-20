-- ============================================================================
-- P0 — Enable Row Level Security + tenant-scoped policies on every table.
--
-- Before this migration, ~82/89 tables had NO RLS, so multi-tenant isolation
-- depended entirely on app-side filters (C1). This migration enforces
-- isolation at the database layer.
--
-- Strategy (defensive + idempotent):
--   * Helper functions (fn_user_institution / has_institution_access / etc.)
--     are defined in 20260720020000_rls_helpers_and_crypto.sql.
--   * For each PUBLIC table that currently has NO policies (intentional
--     policies on audit_logs / transaction_* / customer_beneficial_owners /
--     nfiu_reports / cbs_feed_* are preserved), enable RLS and add one ALL
--     policy scoped to the tenant column:
--        - institution_id present  -> institution_id = fn_user_institution(auth.uid())
--        - else user_id present    -> user_id = auth.uid()
--        - else (global/reference) -> SELECT for authenticated; writes only
--                                     via service_role (BYPASSRLS).
--   * The authz backbone (user_roles, institution_users) is SELECT-only for
--     authenticated so a user cannot self-insert into another institution or
--     grant themselves admin (C2). Writes happen via service_role (onboarding).
--
-- NOTE: service_role bypasses RLS (BYPASSRLS), so edge functions using the
-- service role key are unaffected. The publishable/anon key authenticates as
-- `authenticated` when a user JWT is presented, so these policies apply to all
-- browser traffic. Every row MUST carry a correct institution_id/user_id and
-- every client query MUST present the user's JWT.
-- ============================================================================

DO $$
DECLARE
  r RECORD;
  tenant_col text;
  admin_clause text := 'public.has_role(auth.uid(), ''admin''::app_role)';
BEGIN
  -- ── Generic tenant tables (skip ones with intentional policies) ──────────
  FOR r IN
    SELECT t.tablename
    FROM pg_tables t
    WHERE t.schemaname = 'public'
      AND t.tablename NOT IN ('user_roles', 'institution_users')
      AND NOT EXISTS (
        SELECT 1 FROM pg_policies p
        WHERE p.schemaname = 'public' AND p.tablename = t.tablename
      )
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = r.tablename AND column_name = 'institution_id'
    ) THEN
      tenant_col := 'institution_id';
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = r.tablename AND column_name = 'user_id'
    ) THEN
      tenant_col := 'user_id';
    ELSE
      tenant_col := NULL;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);

    IF tenant_col = 'institution_id' THEN
      EXECUTE format(
        'CREATE POLICY tenant_iso ON public.%I FOR ALL TO authenticated '
        'USING (institution_id IS NOT DISTINCT FROM public.fn_user_institution(auth.uid()) OR %s) '
        'WITH CHECK (institution_id IS NOT DISTINCT FROM public.fn_user_institution(auth.uid()) OR %s)',
        r.tablename, admin_clause, admin_clause);
    ELSIF tenant_col = 'user_id' THEN
      EXECUTE format(
        'CREATE POLICY tenant_user ON public.%I FOR ALL TO authenticated '
        'USING (user_id = auth.uid() OR %s) '
        'WITH CHECK (user_id = auth.uid() OR %s)',
        r.tablename, admin_clause, admin_clause);
    ELSE
      -- Global / reference data: readable by any authenticated user,
      -- writable only by service_role.
      EXECUTE format(
        'CREATE POLICY global_read ON public.%I FOR SELECT TO authenticated USING (true)',
        r.tablename);
    END IF;
  END LOOP;

  -- ── Authz backbone: SELECT-only (no self-write) ──────────────────────────
  FOR r IN
    SELECT unnest(ARRAY['user_roles', 'institution_users']) AS tablename
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS backbone_sel ON public.%I', r.tablename);
    EXECUTE format(
      'CREATE POLICY backbone_sel ON public.%I FOR SELECT TO authenticated '
      'USING (user_id = auth.uid() OR institution_id IS NOT DISTINCT FROM public.fn_user_institution(auth.uid()) OR %s)',
      r.tablename, admin_clause);
  END LOOP;

  RAISE NOTICE 'RLS bulk migration complete. Tables with intentional policies were preserved.';
END $$;
