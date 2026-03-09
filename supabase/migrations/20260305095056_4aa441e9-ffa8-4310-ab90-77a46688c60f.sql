
SELECT cron.schedule(
  'send-deadline-reminders-daily',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url:='https://pdplkprcomjslilznbsl.supabase.co/functions/v1/send-deadline-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcGxrcHJjb21qc2xpbHpuYnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjcwODMsImV4cCI6MjA4NzU0MzA4M30.GnQp2-SaExoOz5XT_iW3Gs7JXO7HYXuarSoTrY3c9ZM"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);
