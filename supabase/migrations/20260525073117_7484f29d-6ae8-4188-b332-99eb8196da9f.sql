CREATE TABLE IF NOT EXISTS public.compliance_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month TEXT NOT NULL,
  report_type TEXT DEFAULT 'monthly_board_pack',
  status TEXT DEFAULT 'generating',
  content TEXT,
  metrics JSONB,
  storage_path TEXT,
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_compliance_reports" ON public.compliance_reports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_user_month ON public.compliance_reports(user_id, month DESC);

CREATE TABLE IF NOT EXISTS public.audit_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  issue_ref TEXT,
  source TEXT NOT NULL,
  category TEXT,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  owner_name TEXT,
  owner_email TEXT,
  due_date DATE,
  closed_date DATE,
  remediation_plan TEXT,
  evidence_notes TEXT,
  examination_date DATE,
  regulator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_audit_issues" ON public.audit_issues
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_audit_issues_user_status ON public.audit_issues(user_id, status);

CREATE TRIGGER update_audit_issues_updated_at
  BEFORE UPDATE ON public.audit_issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();