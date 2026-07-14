
-- 0. Utility function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. App roles enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 2. Additional profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cbn_license_category text,
  ADD COLUMN IF NOT EXISTS compliance_lead_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS notification_email_report_ready boolean NOT NULL DEFAULT true;

-- 3. Institution report types
CREATE TABLE public.institution_report_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, report_type)
);

ALTER TABLE public.institution_report_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own report types" ON public.institution_report_types
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage report types" ON public.institution_report_types
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. Additional columns on reports
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS reporting_period_start date,
  ADD COLUMN IF NOT EXISTS reporting_period_end date,
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS docx_url text,
  ADD COLUMN IF NOT EXISTS xlsx_url text;

-- 5. Report requests table
CREATE TABLE public.report_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  institution_name text NOT NULL,
  rc_number text,
  report_type text NOT NULL,
  reporting_period_start date NOT NULL,
  reporting_period_end date NOT NULL,
  data_source_id uuid,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'Processing',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.report_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.report_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.report_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" ON public.report_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_report_requests_updated_at
  BEFORE UPDATE ON public.report_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Data sources table
CREATE TABLE public.data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Processing',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data sources" ON public.data_sources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data sources" ON public.data_sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own data sources" ON public.data_sources
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Data sources storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('data-sources', 'data-sources', false);

CREATE POLICY "Users can upload own data sources files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'data-sources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own data sources files" ON storage.objects
  FOR SELECT USING (bucket_id = 'data-sources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own data sources files" ON storage.objects
  FOR DELETE USING (bucket_id = 'data-sources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 8. Update handle_new_user to seed roles and report types
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
  RETURN NEW;
END;
$function$;
