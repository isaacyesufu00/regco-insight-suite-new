-- ============================================================================
-- CBS Integration hardening (2026-07-20)
--
-- 1. Fail-closed webhook HMAC secret reader (mirrors _vault_secret pattern from
--    20260720000000_fail_closed_crypto.sql). The receive-transaction edge fn now
--    reads its HMAC secret EXCLUSIVELY from Vault; no hardcoded fallback.
-- 2. cbs_feed_connections — registry of bank-provisioned READ-ONLY feeds that
--    RegCo pulls from (inverts direction: bank writes no crypto, holds no secret).
-- 3. cbs_feed_sync_log — audit trail of each pull run.
--
-- Idempotent. Secrets are created out-of-band in Vault, never in this file:
--   regco.webhook_hmac_secret  — 32-byte hex HMAC key for signed push (opt-in)
-- ============================================================================

-- Fail-closed reader for the webhook HMAC secret. RAISES if the Vault row is
-- missing/empty so the edge function refuses to verify rather than using a
-- known constant. Reuses the proven _vault_secret() contract shape.
CREATE OR REPLACE FUNCTION public.webhook_hmac_secret()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'vault'
AS $function$
DECLARE
  v text;
BEGIN
  SELECT decrypted_secret INTO v FROM vault.decrypted_secrets WHERE name = 'regco.webhook_hmac_secret';
  IF v IS NULL OR v = '' THEN
    RAISE EXCEPTION 'secret regco.webhook_hmac_secret not available in Vault';
  END IF;
  RETURN v;
END;
$function$;

-- Read-only feed connections (PULL model). Credentials are stored ENCRYPTED via
-- fn_encrypt_pii (Vault-backed key) — RegCo holds them, the bank does not.
CREATE TABLE IF NOT EXISTS public.cbs_feed_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  feed_type text NOT NULL,
  label text NOT NULL,
  -- Encrypted connection string / token (fn_encrypt_pii). Never plaintext.
  connection_secret_enc text,
  -- For DB-feed type: host/port/db are non-secret; only credential is encrypted.
  endpoint text,
  query text,
  schedule text NOT NULL DEFAULT '0 2 * * *',  -- daily 02:00, cron expr
  enabled boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  last_status text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cbs_feed_connections_type_chk CHECK (feed_type IN ('db_postgres','warehouse','sftp_csv','api_read'))
);

CREATE INDEX IF NOT EXISTS idx_cbs_feed_conn_inst ON public.cbs_feed_connections(institution_id, enabled);

-- Pull-run audit trail.
CREATE TABLE IF NOT EXISTS public.cbs_feed_sync_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id uuid NOT NULL REFERENCES public.cbs_feed_connections(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  rows_ingested integer NOT NULL DEFAULT 0,
  error_message text,
  CONSTRAINT cbs_feed_sync_log_status_chk CHECK (status IN ('running','success','error'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cbs_feed_connections TO authenticated;
GRANT SELECT, INSERT ON public.cbs_feed_sync_log TO authenticated;
ALTER TABLE public.cbs_feed_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbs_feed_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own feed connections" ON public.cbs_feed_connections
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own feed sync log" ON public.cbs_feed_sync_log
  FOR SELECT TO authenticated USING (auth.uid() = (SELECT user_id FROM public.cbs_feed_connections WHERE id = connection_id));

CREATE TRIGGER trg_cbs_feed_conn_updated BEFORE UPDATE ON public.cbs_feed_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
