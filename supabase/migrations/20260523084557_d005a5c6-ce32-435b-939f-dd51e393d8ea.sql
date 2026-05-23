-- Sanctions sync log table
CREATE TABLE IF NOT EXISTS public.sanctions_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_name TEXT NOT NULL,
  sync_date TIMESTAMPTZ DEFAULT NOW(),
  records_added INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  duration_ms INTEGER
);

ALTER TABLE public.sanctions_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read sync log"
  ON public.sanctions_sync_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure unique index for upserts on sanctions_entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_sanctions_unique
  ON public.sanctions_entries(full_name, list_name)
  WHERE full_name IS NOT NULL;

-- FTS index for fuzzy name matching
CREATE INDEX IF NOT EXISTS idx_sanctions_fts
  ON public.sanctions_entries USING GIN (to_tsvector('simple', full_name));

CREATE INDEX IF NOT EXISTS idx_sanctions_list_name
  ON public.sanctions_entries(list_name);

CREATE INDEX IF NOT EXISTS idx_pep_fts
  ON public.pep_entries USING GIN (to_tsvector('simple', full_name));
