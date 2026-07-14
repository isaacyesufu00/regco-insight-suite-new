-- Add all columns that process-report edge function writes to
-- IF NOT EXISTS makes this safe to re-run

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS generated_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS report_url           TEXT,
  ADD COLUMN IF NOT EXISTS report_filename      TEXT,
  ADD COLUMN IF NOT EXISTS file_url             TEXT,
  ADD COLUMN IF NOT EXISTS validation_passed    BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS car_percentage       NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS liquidity_percentage NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS npl_ratio            NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS error_message        TEXT,
  ADD COLUMN IF NOT EXISTS error_type           TEXT,
  ADD COLUMN IF NOT EXISTS regulator            TEXT;

-- Ensure RLS is enabled
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can read their own reports
DO $$ BEGIN
  CREATE POLICY "users_read_own_reports"
    ON reports FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own reports
DO $$ BEGIN
  CREATE POLICY "users_insert_own_reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Service role can update any report (edge function uses service role key)
DO $$ BEGIN
  CREATE POLICY "service_role_update_reports"
    ON reports FOR UPDATE
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Refresh PostgREST schema cache so new columns are visible immediately
NOTIFY pgrst, 'reload schema';
