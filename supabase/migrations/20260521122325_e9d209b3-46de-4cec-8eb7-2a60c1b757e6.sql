
-- Flagging columns
ALTER TABLE public.unified_transactions
  ADD COLUMN IF NOT EXISTS is_flagged boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS flag_severity text,
  ADD COLUMN IF NOT EXISTS flag_reason text,
  ADD COLUMN IF NOT EXISTS flag_rule text,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS str_reference text,
  ADD COLUMN IF NOT EXISTS str_filed_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS narration text,
  ADD COLUMN IF NOT EXISTS branch_code text,
  ADD COLUMN IF NOT EXISTS customer_name text;

CREATE INDEX IF NOT EXISTS idx_utx_flagged ON public.unified_transactions(user_id, is_flagged) WHERE is_flagged = true;
CREATE INDEX IF NOT EXISTS idx_utx_review_status ON public.unified_transactions(user_id, review_status);

-- Webhook API keys per user
CREATE TABLE IF NOT EXISTS public.webhook_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_webhook_keys_hash ON public.webhook_api_keys(key_hash);

ALTER TABLE public.webhook_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own webhook key" ON public.webhook_api_keys FOR SELECT USING (auth.uid() = user_id);
-- Inserts/updates only via service role (edge function)

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.unified_transactions;
ALTER TABLE public.unified_transactions REPLICA IDENTITY FULL;
