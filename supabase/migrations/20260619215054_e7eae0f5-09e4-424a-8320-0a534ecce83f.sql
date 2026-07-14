ALTER TABLE public.report_requests
  ADD COLUMN IF NOT EXISTS formats text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS params jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS readiness jsonb,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS report_id uuid REFERENCES public.reports(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS report_requests_user_status_idx
  ON public.report_requests (user_id, status);

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS return_type text,
  ADD COLUMN IF NOT EXISTS xml_url text,
  ADD COLUMN IF NOT EXISTS csv_url text;

CREATE INDEX IF NOT EXISTS reports_user_return_period_idx
  ON public.reports (user_id, return_type, period_start);