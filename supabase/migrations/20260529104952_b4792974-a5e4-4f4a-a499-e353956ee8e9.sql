CREATE TABLE IF NOT EXISTS public.institution_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  invited_email TEXT NOT NULL,
  invited_name TEXT,
  role TEXT NOT NULL DEFAULT 'compliance_officer',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(admin_user_id, invited_email)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.institution_users TO authenticated;
GRANT ALL ON public.institution_users TO service_role;

ALTER TABLE public.institution_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_own_invites" ON public.institution_users
  FOR ALL USING (auth.uid() = admin_user_id) WITH CHECK (auth.uid() = admin_user_id);

CREATE TRIGGER set_institution_users_updated_at
  BEFORE UPDATE ON public.institution_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();