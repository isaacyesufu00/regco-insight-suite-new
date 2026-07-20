-- ============================================================================
-- Phase 1 — NFIU report acknowledgement storage.
-- submit-nfiu now performs a REAL POST to the NFIU gateway and
-- records the regulator's acknowledgement reference. The table had no
-- column for it, so the reference could not be persisted. Idempotent.
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'nfiu_reports'
      AND column_name = 'ack_reference'
  ) THEN
    ALTER TABLE public.nfiu_reports ADD COLUMN ack_reference text;
  END IF;
END $$;
