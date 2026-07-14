
-- Add compliance_lead to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'compliance_lead';

-- Add is_active column to institution_report_types
ALTER TABLE public.institution_report_types ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Admin can SELECT all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can UPDATE all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can SELECT all reports
CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can SELECT all demo_requests
CREATE POLICY "Admins can view all demo requests"
ON public.demo_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can SELECT all compliance_scores
CREATE POLICY "Admins can view all scores"
ON public.compliance_scores FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can SELECT all user_stats
CREATE POLICY "Admins can view all stats"
ON public.user_stats FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can SELECT all report_statuses
CREATE POLICY "Admins can view all report statuses"
ON public.report_statuses FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
