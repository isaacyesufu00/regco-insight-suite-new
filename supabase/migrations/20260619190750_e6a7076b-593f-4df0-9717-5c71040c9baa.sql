
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============ Extend existing tables ============
ALTER TABLE public.agent_messages ADD COLUMN IF NOT EXISTS parts jsonb;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS agent_notes jsonb DEFAULT '[]'::jsonb;

-- ============ cases ============
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  trigger_kind text,
  trigger_id text,
  title text NOT NULL,
  summary text,
  status text NOT NULL DEFAULT 'open',
  severity text NOT NULL DEFAULT 'medium',
  assignee_id uuid,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cases_status_chk CHECK (status IN ('open','investigating','escalated','closed')),
  CONSTRAINT cases_severity_chk CHECK (severity IN ('low','medium','high','critical'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officers manage own cases" ON public.cases FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all cases" ON public.cases FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_cases_updated BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_cases_user ON public.cases(user_id, status);

-- ============ case_events (hash chain) ============
CREATE TABLE IF NOT EXISTS public.case_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  actor_id uuid,
  actor_kind text NOT NULL DEFAULT 'user',
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash text,
  hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT case_events_actor_kind_chk CHECK (actor_kind IN ('user','agent','system'))
);
GRANT SELECT, INSERT ON public.case_events TO authenticated;
GRANT ALL ON public.case_events TO service_role;
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officers view own case events" ON public.case_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Officers insert own case events" ON public.case_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all case events" ON public.case_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX IF NOT EXISTS idx_case_events_case ON public.case_events(case_id, created_at);

CREATE OR REPLACE FUNCTION public.case_events_hash_chain()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE last_hash text;
BEGIN
  SELECT hash INTO last_hash FROM public.case_events
    WHERE case_id = NEW.case_id ORDER BY created_at DESC, id DESC LIMIT 1;
  NEW.prev_hash := last_hash;
  NEW.hash := encode(
    digest(coalesce(last_hash,'') || '|' || NEW.event_type || '|' || NEW.payload::text || '|' || NEW.created_at::text,
           'sha256'), 'hex');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_case_events_hash ON public.case_events;
CREATE TRIGGER trg_case_events_hash BEFORE INSERT ON public.case_events
  FOR EACH ROW EXECUTE FUNCTION public.case_events_hash_chain();

-- ============ case_artifacts ============
CREATE TABLE IF NOT EXISTS public.case_artifacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  storage_path text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_artifacts TO authenticated;
GRANT ALL ON public.case_artifacts TO service_role;
ALTER TABLE public.case_artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officers manage own artifacts" ON public.case_artifacts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ account_actions ============
CREATE TABLE IF NOT EXISTS public.account_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  account_number text NOT NULL,
  action text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  requested_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT account_actions_action_chk CHECK (action IN ('freeze','unfreeze','flag','restrict')),
  CONSTRAINT account_actions_status_chk CHECK (status IN ('pending','approved','rejected','executed'))
);
GRANT SELECT, INSERT, UPDATE ON public.account_actions TO authenticated;
GRANT ALL ON public.account_actions TO service_role;
ALTER TABLE public.account_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officers manage own account actions" ON public.account_actions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_account_actions_updated BEFORE UPDATE ON public.account_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ agent_tool_invocations ============
CREATE TABLE IF NOT EXISTS public.agent_tool_invocations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  conversation_id uuid,
  message_id uuid,
  tool_name text NOT NULL,
  args jsonb,
  result_summary text,
  status text NOT NULL DEFAULT 'success',
  latency_ms integer,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.agent_tool_invocations TO authenticated;
GRANT ALL ON public.agent_tool_invocations TO service_role;
ALTER TABLE public.agent_tool_invocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officers view own tool invocations" ON public.agent_tool_invocations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins view all tool invocations" ON public.agent_tool_invocations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX IF NOT EXISTS idx_tool_inv_user ON public.agent_tool_invocations(user_id, created_at DESC);

-- ============ regulatory_rules (shared reference) ============
CREATE TABLE IF NOT EXISTS public.regulatory_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_code text NOT NULL UNIQUE,
  regulator text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  threshold jsonb DEFAULT '{}'::jsonb,
  citation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.regulatory_rules TO authenticated;
GRANT ALL ON public.regulatory_rules TO service_role;
ALTER TABLE public.regulatory_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read rules" ON public.regulatory_rules FOR SELECT TO authenticated USING (true);

-- ============ filing_schedules (shared reference) ============
CREATE TABLE IF NOT EXISTS public.filing_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_type text NOT NULL UNIQUE,
  regulator text NOT NULL,
  title text NOT NULL,
  frequency text NOT NULL,
  due_rule text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.filing_schedules TO authenticated;
GRANT ALL ON public.filing_schedules TO service_role;
ALTER TABLE public.filing_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read schedules" ON public.filing_schedules FOR SELECT TO authenticated USING (true);

-- ============ adverse_media_cache ============
CREATE TABLE IF NOT EXISTS public.adverse_media_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_hash text NOT NULL UNIQUE,
  query text NOT NULL,
  years integer NOT NULL,
  result jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.adverse_media_cache TO authenticated;
GRANT ALL ON public.adverse_media_cache TO service_role;
ALTER TABLE public.adverse_media_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read media cache" ON public.adverse_media_cache FOR SELECT TO authenticated USING (true);

-- ============ Seed regulatory_rules ============
INSERT INTO public.regulatory_rules (rule_code, regulator, title, description, threshold, citation) VALUES
  ('CBN-AML-001','CBN','Individual cash transaction threshold','Cash lodgments or withdrawals by individuals at or above ₦5,000,000 must be reported as a Currency Transaction Report (CTR).', '{"amount_ngn":5000000,"party":"individual"}', 'CBN AML/CFT Regulations 2022, s.12'),
  ('CBN-AML-002','CBN','Corporate cash transaction threshold','Cash lodgments or withdrawals by corporates at or above ₦10,000,000 must be reported as a CTR.', '{"amount_ngn":10000000,"party":"corporate"}', 'CBN AML/CFT Regulations 2022, s.12'),
  ('NFIU-STR-001','NFIU','Suspicious Transaction Reporting window','Suspicious transactions must be reported to NFIU within 24 hours of detection.', '{"window_hours":24}', 'NFIU Act 2018, s.6'),
  ('CBN-STRUCT-001','CBN','Structuring / smurfing detection','Multiple sub-threshold transfers within 24h that aggregate to or above the reporting threshold should be treated as structuring.', '{"window_hours":24,"aggregate_ngn":5000000}', 'CBN AML/CFT Regulations 2022, s.18'),
  ('CBN-FX-001','CBN','Foreign currency transfer ceiling','Outbound personal FX transfers above USD 10,000 require enhanced documentation.', '{"amount_usd":10000}', 'CBN FX Manual 2018, ch.4')
ON CONFLICT (rule_code) DO NOTHING;

-- ============ Seed filing_schedules ============
INSERT INTO public.filing_schedules (return_type, regulator, title, frequency, due_rule, notes) VALUES
  ('NFIU_STR','NFIU','Suspicious Transaction Report','event','Within 24 hours of detection','Filed per case'),
  ('NFIU_CTR','NFIU','Currency Transaction Report','daily','By 17:00 next business day','Aggregate cash movements at/above threshold'),
  ('CBN_MPR','CBN','Monetary Policy Return','monthly','By 10th of following month','Includes CAR, liquidity, NPL ratios'),
  ('CBN_FX','CBN','Foreign Exchange Return','weekly','By Wednesday of following week',''),
  ('NDIC_PREM','NDIC','Premium Contribution Return','quarterly','By 30th day after quarter-end',''),
  ('NDIC_SO','NDIC','Single Obligor Return','quarterly','By 30th day after quarter-end',''),
  ('SCUML_ANN','SCUML','Annual SCUML Compliance Report','annual','By 31 January',''),
  ('FIRS_VAT','FIRS','Value Added Tax Return','monthly','By 21st of following month',''),
  ('FIRS_PAYE','FIRS','Pay-As-You-Earn Return','monthly','By 10th of following month',''),
  ('FIRS_WHT','FIRS','Withholding Tax Return','monthly','By 21st of following month',''),
  ('FIRS_CIT','FIRS','Companies Income Tax Return','annual','Within 6 months of year-end','')
ON CONFLICT (return_type) DO NOTHING;
