
-- Add RC number and account status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rc_number text,
ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'Active';

-- Add a file_path column to reports for storage references
ALTER TABLE public.reports
ADD COLUMN IF NOT EXISTS file_path text;

-- Create storage bucket for report files
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can upload to their own folder
CREATE POLICY "Users can upload own reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage RLS: users can view their own files
CREATE POLICY "Users can view own reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage RLS: users can delete their own files
CREATE POLICY "Users can delete own reports"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
