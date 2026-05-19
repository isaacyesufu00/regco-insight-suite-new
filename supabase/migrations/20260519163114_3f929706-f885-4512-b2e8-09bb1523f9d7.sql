
-- Make reports bucket private
UPDATE storage.buckets SET public = false WHERE id = 'reports';

-- Drop overly permissive public read policy
DROP POLICY IF EXISTS "Public can read reports" ON storage.objects;
DROP POLICY IF EXISTS "Public read reports" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read reports" ON storage.objects;

-- Ensure owner-scoped read policy exists (idempotent)
DROP POLICY IF EXISTS "Users can view own reports in storage" ON storage.objects;
CREATE POLICY "Users can view own reports in storage"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Realtime authorization: restrict realtime.messages to authenticated users only;
-- our app uses postgres_changes with user-scoped filters (filter: user_id=eq.<uid>) and reports rows
-- are themselves RLS-protected, so row payloads are already scoped. Lock the broadcast/presence layer.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can receive realtime" ON realtime.messages;
CREATE POLICY "Authenticated users can receive realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);
