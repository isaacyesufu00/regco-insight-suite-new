
-- Delete all data from user-related tables
DELETE FROM public.email_reminders;
DELETE FROM public.report_statuses;
DELETE FROM public.report_requests;
DELETE FROM public.reports;
DELETE FROM public.data_sources;
DELETE FROM public.support_tickets;
DELETE FROM public.compliance_scores;
DELETE FROM public.user_stats;
DELETE FROM public.institution_report_types;
DELETE FROM public.user_roles;
DELETE FROM public.login_attempts;
DELETE FROM public.profiles;
DELETE FROM public.demo_requests;

-- Delete all auth users
DELETE FROM auth.users;
