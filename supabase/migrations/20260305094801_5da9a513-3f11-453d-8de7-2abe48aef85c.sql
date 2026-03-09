
-- Add score_breakdown and calculated_at to compliance_scores
ALTER TABLE public.compliance_scores 
  ADD COLUMN IF NOT EXISTS score_breakdown jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS calculated_at timestamp with time zone DEFAULT now();

-- Create email_reminders table
CREATE TABLE public.email_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_type text NOT NULL,
  reporting_period text NOT NULL,
  reminder_type text NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all reminders" ON public.email_reminders
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own reminders" ON public.email_reminders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
