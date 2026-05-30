ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reporting_api_key TEXT;

UPDATE public.profiles
  SET reporting_api_key = encode(gen_random_bytes(32), 'hex')
  WHERE reporting_api_key IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN reporting_api_key SET DEFAULT encode(gen_random_bytes(32), 'hex');

CREATE INDEX IF NOT EXISTS idx_profiles_reporting_api_key ON public.profiles(reporting_api_key);

CREATE TABLE IF NOT EXISTS public.compliance_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  month TEXT NOT NULL,
  breakdown JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month)
);

GRANT SELECT, INSERT, UPDATE ON public.compliance_score_history TO authenticated;
GRANT ALL ON public.compliance_score_history TO service_role;

ALTER TABLE public.compliance_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_score_history" ON public.compliance_score_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);