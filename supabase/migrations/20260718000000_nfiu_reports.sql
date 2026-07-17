-- ============================================================================
-- NFIU / CBN Reporting (CBN Pillar 5 — Regulatory Returns & Reporting)
--
-- Creates the nfiu_reports table to track STR / CTR / FTR regulatory reports
-- generated from investigation cases. Each report stores the GoAML 4.0 XML
-- payload and its filing lifecycle (draft -> reviewed -> filed).
--
-- Reports are tenant-isolated via user_id and appended to the immutable
-- audit ledger on every write.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.nfiu_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  report_type text NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  xml_content text,
  status text NOT NULL DEFAULT 'draft',
  filed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT nfiu_reports_type_chk CHECK (report_type IN ('STR', 'CTR', 'FTR')),
  CONSTRAINT nfiu_reports_status_chk CHECK (status IN ('draft', 'reviewed', 'filed'))
);

-- Indexing for tenant + case lookups
CREATE INDEX IF NOT EXISTS idx_nfiu_reports_user ON public.nfiu_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_nfiu_reports_case ON public.nfiu_reports(case_id);
CREATE INDEX IF NOT EXISTS idx_nfiu_reports_status ON public.nfiu_reports(status);

-- Enable RLS
ALTER TABLE public.nfiu_reports ENABLE ROW LEVEL SECURITY;

-- Policies: tenant isolation at the row level
CREATE POLICY "Users manage own nfiu reports" ON public.nfiu_reports
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nfiu_reports TO authenticated;
GRANT ALL ON public.nfiu_reports TO service_role;

-- Maintain updated_at
CREATE TRIGGER trg_nfiu_reports_updated BEFORE UPDATE ON public.nfiu_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Append every write to the immutable audit ledger
CREATE TRIGGER trg_audit_nfiu_reports
  AFTER INSERT OR UPDATE OR DELETE ON public.nfiu_reports
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();
