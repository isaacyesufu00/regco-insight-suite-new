ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS content TEXT;

ALTER TABLE public.transaction_reviews
  ADD COLUMN IF NOT EXISTS flag_type TEXT,
  ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS str_reference TEXT,
  ADD COLUMN IF NOT EXISTS upload_batch_id TEXT,
  ADD COLUMN IF NOT EXISTS channel TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT;

UPDATE storage.buckets SET public = true WHERE id = 'reports';