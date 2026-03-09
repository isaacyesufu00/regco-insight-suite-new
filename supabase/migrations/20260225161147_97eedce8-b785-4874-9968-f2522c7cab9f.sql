
-- Add demo_requests table (public insert, no auth required)
CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  report_type TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert demo requests" ON public.demo_requests FOR INSERT WITH CHECK (true);

-- Add missing columns to existing tables
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS reports_filed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS report_type TEXT;

ALTER TABLE public.compliance_scores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Update the signup trigger to also seed default compliance_scores and user_stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
  -- Seed default report statuses
  INSERT INTO public.report_statuses (user_id, report_name, report_subtype, status) VALUES
    (NEW.id, 'CBN Report – Ready for Submission', 'Q4 2025 Regulatory Return', 'Ready'),
    (NEW.id, 'NDIC Return – Pending Review', 'Annual Compliance Filing', 'Pending'),
    (NEW.id, 'Risk Alert: Filing Deadline in 3 Days', 'SEC Quarterly Report', 'Urgent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
