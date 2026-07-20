-- ============================================================================
-- Phase 1 — Per-institution webhook key binding.
--
-- receive-transaction verified the request HMAC against a SINGLE global
-- Vault secret but never validated the per-user API key sent in the
-- x-api-key / x-api-key-prefix headers, and trusted payload.institution_id.
-- That let any party holding the shared HMAC secret push transactions
-- attributed to ANY institution_id — a cross-institution forgery hole.
--
-- Fix: stamp the owning institution on each webhook_api_keys row at
-- provision time, and have receive-transaction resolve the institution
-- from the verified API key and reject any payload whose
-- institution_id does not match. The HMAC secret contract is unchanged.
-- Idempotent.
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'webhook_api_keys'
      AND column_name = 'institution_id'
  ) THEN
    ALTER TABLE public.webhook_api_keys
      ADD COLUMN institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
