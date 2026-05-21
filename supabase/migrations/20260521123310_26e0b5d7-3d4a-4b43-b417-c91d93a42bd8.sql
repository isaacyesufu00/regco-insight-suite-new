-- Extend sanctions_entries with extra columns
ALTER TABLE public.sanctions_entries
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS entity_type TEXT,
  ADD COLUMN IF NOT EXISTS reason TEXT,
  ADD COLUMN IF NOT EXISTS date_listed DATE,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS raw_data JSONB,
  ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ DEFAULT now();

-- aliases column is TEXT in existing schema; keep as TEXT
CREATE UNIQUE INDEX IF NOT EXISTS uniq_sanctions_name_list ON public.sanctions_entries(full_name, list_name);
CREATE INDEX IF NOT EXISTS idx_sanctions_name_gin ON public.sanctions_entries USING GIN (to_tsvector('english', full_name));
CREATE INDEX IF NOT EXISTS idx_sanctions_list ON public.sanctions_entries(list_name);
CREATE INDEX IF NOT EXISTS idx_sanctions_type ON public.sanctions_entries(list_type);

-- PEP entries
CREATE TABLE IF NOT EXISTS public.pep_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  position TEXT,
  country TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  date_of_birth DATE,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pep_name_gin ON public.pep_entries USING GIN (to_tsvector('english', full_name));
CREATE UNIQUE INDEX IF NOT EXISTS uniq_pep_name_position ON public.pep_entries(full_name, COALESCE(position, ''));

ALTER TABLE public.pep_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read peps" ON public.pep_entries
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage peps" ON public.pep_entries
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Screening results
CREATE TABLE IF NOT EXISTS public.screening_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_id UUID,
  search_name TEXT NOT NULL,
  search_bvn TEXT,
  search_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  matches_found INTEGER NOT NULL DEFAULT 0,
  highest_risk TEXT NOT NULL DEFAULT 'none',
  match_details JSONB DEFAULT '{}'::jsonb,
  screened_by TEXT,
  action_taken TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_screening_user ON public.screening_results(user_id, search_date DESC);

ALTER TABLE public.screening_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own screening" ON public.screening_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own screening" ON public.screening_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own screening" ON public.screening_results
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own screening" ON public.screening_results
  FOR DELETE USING (auth.uid() = user_id);

-- Seed Nigerian PEPs
INSERT INTO public.pep_entries (full_name, position, country, category, status) VALUES
  ('Bola Ahmed Tinubu', 'President of Nigeria', 'Nigeria', 'head_of_state', 'active'),
  ('Kashim Shettima', 'Vice President of Nigeria', 'Nigeria', 'head_of_state', 'active'),
  ('Wale Edun', 'Minister of Finance', 'Nigeria', 'minister', 'active'),
  ('Godwin Emefiele', 'Former CBN Governor', 'Nigeria', 'minister', 'former'),
  ('Yemi Cardoso', 'CBN Governor', 'Nigeria', 'minister', 'active')
ON CONFLICT DO NOTHING;