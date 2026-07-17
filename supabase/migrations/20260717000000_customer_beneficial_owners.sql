-- ============================================================================
-- KYB / Beneficial Owners (CBN Pillar 2 — Corporate Due Diligence)
--
-- Creates the customer_beneficial_owners table to track ultimate beneficial
-- owners (UBOs) for corporate customers. Includes:
--   * ownership_pct (tracks share percentage)
--   * is_25pct_controller (automatic generated field checking >= 25% threshold)
--   * screening fields to store automated PEP/Sanctions checks
--   * audit trigger linkage
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.customer_beneficial_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  owner_name text NOT NULL,
  ownership_pct numeric(5, 2) NOT NULL,
  bvn_hash text,
  is_25pct_controller boolean GENERATED ALWAYS AS (ownership_pct >= 25.00) STORED,
  screening_status text NOT NULL DEFAULT 'pending',
  screening_risk_level text NOT NULL DEFAULT 'none',
  screening_matches jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_beneficial_owners_pct_chk CHECK (ownership_pct >= 0 AND ownership_pct <= 100),
  CONSTRAINT customer_beneficial_owners_status_chk CHECK (screening_status IN ('pending', 'clean', 'flagged')),
  CONSTRAINT customer_beneficial_owners_risk_chk CHECK (screening_risk_level IN ('none', 'low', 'medium', 'critical'))
);

-- Indexing for lookups
CREATE INDEX IF NOT EXISTS idx_customer_beneficial_owners_cust ON public.customer_beneficial_owners(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_beneficial_owners_user ON public.customer_beneficial_owners(user_id);

-- Enable RLS
ALTER TABLE public.customer_beneficial_owners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users manage own beneficial owners" ON public.customer_beneficial_owners
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_beneficial_owners TO authenticated;
GRANT ALL ON public.customer_beneficial_owners TO service_role;

-- Register triggers
CREATE TRIGGER trg_customer_beneficial_owners_updated BEFORE UPDATE ON public.customer_beneficial_owners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_audit_customer_beneficial_owners
  AFTER INSERT OR UPDATE OR DELETE ON public.customer_beneficial_owners
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();
