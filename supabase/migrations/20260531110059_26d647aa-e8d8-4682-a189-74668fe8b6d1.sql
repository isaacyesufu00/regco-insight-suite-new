
-- 1. Make reports bucket private
UPDATE storage.buckets SET public = false WHERE id = 'reports';

-- 2. Drop overly-broad/duplicate storage policies on reports
DROP POLICY IF EXISTS "Authenticated users can upload reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own reports in storage" ON storage.objects;

-- 3. Add scoped UPDATE policy for reports bucket
DROP POLICY IF EXISTS "Users can update own reports" ON storage.objects;
CREATE POLICY "Users can update own reports"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'reports' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'reports' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- 4. Revoke EXECUTE on trigger-only SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 5. Scope realtime.messages topic subscriptions to caller's UID
DROP POLICY IF EXISTS "Authenticated users can receive realtime" ON realtime.messages;
CREATE POLICY "Users receive own realtime topics"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    realtime.topic() LIKE '%' || (auth.uid())::text || '%'
    OR realtime.topic() IN ('reports-my', 'dashboard-live')
  );

-- 6. Lock down login_attempts: ensure no client API access
REVOKE ALL ON TABLE public.login_attempts FROM anon, authenticated;
GRANT ALL ON TABLE public.login_attempts TO service_role;
