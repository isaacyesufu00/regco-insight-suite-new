
CREATE TABLE public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  attempt_count integer NOT NULL DEFAULT 0,
  locked_until timestamp with time zone,
  last_attempt_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select/insert/update login attempts (pre-auth table)
CREATE POLICY "Anyone can read login attempts" ON public.login_attempts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert login attempts" ON public.login_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update login attempts" ON public.login_attempts FOR UPDATE TO anon, authenticated USING (true);
