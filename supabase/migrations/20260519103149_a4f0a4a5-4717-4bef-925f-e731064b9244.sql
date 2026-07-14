-- Add any missing columns to reports table (safe / idempotent)
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS generated_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS report_url            TEXT,
  ADD COLUMN IF NOT EXISTS report_filename       TEXT,
  ADD COLUMN IF NOT EXISTS file_url              TEXT,
  ADD COLUMN IF NOT EXISTS validation_passed     BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS car_percentage        NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS liquidity_percentage  NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS npl_ratio             NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS error_message         TEXT,
  ADD COLUMN IF NOT EXISTS error_type            TEXT,
  ADD COLUMN IF NOT EXISTS regulator             TEXT,
  ADD COLUMN IF NOT EXISTS report_type           TEXT,
  ADD COLUMN IF NOT EXISTS period_start          DATE,
  ADD COLUMN IF NOT EXISTS period_end            DATE;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_reports" ON public.reports;
DROP POLICY IF EXISTS "users_insert_own_reports" ON public.reports;
DROP POLICY IF EXISTS "service_role_update_reports" ON public.reports;
DROP POLICY IF EXISTS "users_update_own_reports" ON public.reports;

CREATE POLICY "users_read_own_reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime (ignore if already added)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Ensure reports storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload reports" ON storage.objects;

CREATE POLICY "Public can read reports"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reports');

CREATE POLICY "Authenticated users can upload reports"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');

NOTIFY pgrst, 'reload schema';