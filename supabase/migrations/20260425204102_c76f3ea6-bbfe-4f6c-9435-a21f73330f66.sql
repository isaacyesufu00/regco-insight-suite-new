-- Compliance Mail inbox
CREATE TABLE IF NOT EXISTS public.compliance_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'CBN Notice',
  sender_name TEXT NOT NULL DEFAULT 'RegCo',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own messages"
  ON public.compliance_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all messages"
  ON public.compliance_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users update own messages"
  ON public.compliance_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own messages"
  ON public.compliance_messages FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_compliance_messages_updated
  BEFORE UPDATE ON public.compliance_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_compliance_messages_user ON public.compliance_messages (user_id, created_at DESC);

-- Update handle_new_user to seed sample messages
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', '')
  );
  INSERT INTO public.compliance_scores (user_id, score, status_label)
  VALUES (NEW.id, 94, 'Excellent standing');
  INSERT INTO public.user_stats (user_id, on_time_rate, violations, reports_filed)
  VALUES (NEW.id, 98, 0, 24);
  INSERT INTO public.report_statuses (user_id, report_name, report_subtype, status) VALUES
    (NEW.id, 'CBN Report – Ready for Submission', 'Q4 2025 Regulatory Return', 'Ready'),
    (NEW.id, 'NDIC Return – Pending Review', 'Annual Compliance Filing', 'Pending'),
    (NEW.id, 'Risk Alert: Filing Deadline in 3 Days', 'SEC Quarterly Report', 'Urgent');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.institution_report_types (user_id, report_type) VALUES
    (NEW.id, 'CBN Monetary Policy Return'),
    (NEW.id, 'CBN Forex Return'),
    (NEW.id, 'AML/CFT Report');
  INSERT INTO public.compliance_messages (user_id, category, sender_name, subject, body) VALUES
    (NEW.id, 'CBN Notice', 'Central Bank of Nigeria', 'Q1 2026 Regulatory Return Deadline', 'This is a reminder that your Q1 2026 CBN regulatory return is due on 15 April 2026. Please ensure all required schedules are reconciled and submitted via the official portal before the cut-off.'),
    (NEW.id, 'Reports Ready', 'RegCo', 'Your CBN Monetary Policy Return is ready', 'Your monthly CBN Monetary Policy Return has been generated, validated, and is ready for download from the My Reports section. CAR, liquidity ratio, and NPL ratio all passed reconciliation checks.'),
    (NEW.id, 'NFIU', 'NFIU Compliance Desk', 'Suspicious Transaction Report acknowledged', 'Your STR submission has been received and assigned reference number NFIU-2026-00482. No further action is required at this time.'),
    (NEW.id, 'SCUML', 'SCUML Secretariat', 'Annual SCUML Compliance Report due', 'Your annual SCUML compliance report covering FY2025 is due on 31 January 2026. Upload your raw CBS export to RegCo to auto-generate the submission package.');
  RETURN NEW;
END;
$function$;