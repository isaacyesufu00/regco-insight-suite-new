-- ============================================================================
-- BASELINE SCHEMA RECONSTRUCTION (DRAFT — for review, NOT yet applied).
--
-- Provenance: extracted directly from the LIVE database
-- (pdplkprcomjslilznbsl) via SQL Editor catalog queries on 2026-07-17,
-- because the original 20260714010330_remote_schema.sql shipped EMPTY (0
-- bytes). This file restores reproducibility: the project can now be rebuilt
-- from git.
--
-- Scope decision:
--   * This baseline creates the 89 tables NOT owned by later Phase migrations.
--   * The 5 tables owned by Phase B/C/D (customer_beneficial_owners,
--     transaction_alerts, transaction_rules, nfiu_reports, audit_logs) are
--     intentionally NOT created here — those migrations CREATE TABLE IF NOT
--     EXISTS and own their policies/indexes (incl. the applied audit
--     institution_id column). Recreating them here would conflict.
--   * All statements are idempotent: CREATE TABLE IF NOT EXISTS,
--     ADD CONSTRAINT IF NOT EXISTS, CREATE INDEX IF NOT EXISTS,
--     CREATE OR REPLACE FUNCTION, DO $$ guard on the enum type.
--
-- SECURITY NOTE: fn_decrypt_pii / fn_hash_bvn contain HARDCODED fallback
-- secrets ('change-me-32-char-enc-key-in-vault', 'prod-pepper-change-me-in-
-- vault'). Rotate to vault-stored values and make them fail-closed.
-- Tracked separately from this reconstruction.
-- ============================================================================

-- 1. Enum types (source of truth from live DB).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
                 WHERE t.typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'compliance_lead');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
                 WHERE t.typname = 'aml_job_status') THEN
    CREATE TYPE public.aml_job_status AS ENUM ('queued', 'processing', 'completed', 'failed');
  END IF;
END $$;

-- 2. Helper functions referenced by later migrations (verbatim from live DDL).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_hash_bvn(p_bvn text)
RETURNS text LANGUAGE sql IMMUTABLE SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $function$
  select case when p_bvn is null then null
  else encode(extensions.digest(p_bvn || 'prod-pepper-change-me-in-vault', 'sha256'), 'hex') end;
$function$;

CREATE OR REPLACE FUNCTION public.fn_decrypt_pii(p_cipher text)
RETURNS text LANGUAGE sql SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $function$
  select case when p_cipher is null then null else pgp_sym_decrypt(p_cipher::bytea, coalesce(current_setting('app.enc_key', true),'change-me-32-char-enc-key-in-vault')) end;
$function$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_hash_bvn(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_decrypt_pii(text) TO authenticated;

-- 3. Tables (89 — excludes the 5 owned by Phase B/C/D migrations).
CREATE TABLE IF NOT EXISTS public.account_actions (
  requested_by uuid,
  reason text,
  action text NOT NULL,
  account_number_hash text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid,
  status text NOT NULL DEFAULT 'pending'::text,
  institution_id uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  approved_at timestamp with time zone,
  approved_by uuid
);

CREATE TABLE IF NOT EXISTS public.accounts (
  balance bigint NOT NULL DEFAULT 0.00,
  customer_id uuid NOT NULL,
  institution_id uuid NOT NULL DEFAULT get_institution_id(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  account_type text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.adverse_media_cache (
  result jsonb NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  institution_id uuid NOT NULL,
  query text NOT NULL,
  query_hash text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  years integer NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agent_conversations (
  user_id uuid NOT NULL,
  title_hash text NOT NULL DEFAULT 'New conversation'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.agent_messages (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  parts jsonb,
  institution_id uuid NOT NULL,
  conversation_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  content_hash text NOT NULL DEFAULT ''::text,
  action_type text,
  action_payload jsonb
);

CREATE TABLE IF NOT EXISTS public.agent_tool_invocations (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  institution_id uuid NOT NULL,
  error text,
  latency_ms integer,
  status text NOT NULL DEFAULT 'success'::text,
  result_summary_hash text,
  args_hash jsonb,
  tool_name text NOT NULL,
  message_id uuid,
  conversation_id uuid,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.alerts (
  assigned_to uuid,
  checker_comment text,
  maker_comment text,
  checker_id uuid,
  maker_id uuid,
  severity text,
  status text DEFAULT 'OPEN'::text,
  rule_id text,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  transaction_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.aml_alert_status_history (
  alert_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.aml_alerts (
  score smallint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open'::text,
  rule_id uuid NOT NULL,
  transaction_id uuid,
  customer_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  severity text NOT NULL,
  review_note text,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.aml_decisions (
  institution_id uuid NOT NULL,
  decision text NOT NULL,
  justification jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_document_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  transaction_id text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.aml_jobs (
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  payload_size_kb integer,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL DEFAULT get_institution_id(),
  status aml_job_status NOT NULL DEFAULT 'queued'::aml_job_status,
  processed_count integer DEFAULT 0,
  error_log jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.aml_review_events (
  institution_id uuid NOT NULL,
  changed_at timestamp with time zone DEFAULT now(),
  changed_by uuid,
  note text,
  new_status text NOT NULL,
  old_status text NOT NULL,
  alert_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.aml_rules (
  severity text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  rule_code text NOT NULL,
  name text NOT NULL,
  rule_type text NOT NULL,
  threshold jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.audit_issues (
  owner_email_hash text,
  due_date date,
  severity text DEFAULT 'medium'::text,
  status text DEFAULT 'open'::text,
  closed_date date,
  remediation_plan_hash text,
  owner_name_hash text,
  description_hash text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  evidence_notes_hash text,
  examination_date date,
  regulator text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  institution_id uuid NOT NULL,
  issue_ref text,
  source text NOT NULL,
  category text,
  title_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  table_name text,
  institution_id uuid NOT NULL,
  record_id uuid,
  args_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  result_summary_hash text
);

CREATE TABLE IF NOT EXISTS public.audit_trail (
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  actor_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL,
  action text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.case_alerts (
  alert_id uuid NOT NULL,
  case_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.case_artifacts (
  kind text NOT NULL,
  case_id uuid NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  storage_path text,
  body_hash text,
  title_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.case_events (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL,
  user_id uuid NOT NULL,
  actor_id uuid,
  actor_kind text NOT NULL DEFAULT 'user'::text,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash text,
  hash text NOT NULL,
  institution_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.case_status_history (
  note text,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  changed_by uuid,
  to_status text NOT NULL,
  from_status text,
  case_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.cases (
  trigger_id text,
  closed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  institution_id uuid NOT NULL,
  sla_due_at timestamp with time zone,
  assignee_id uuid,
  severity text NOT NULL DEFAULT 'medium'::text,
  status text NOT NULL DEFAULT 'open'::text,
  summary text,
  title text NOT NULL,
  closed_by uuid,
  close_reason text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_id uuid,
  trigger_kind text,
  opened_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compiled_returns (
  record_count integer DEFAULT 0,
  reporting_period_end date NOT NULL,
  error_log jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reporting_period_start date NOT NULL,
  submitted_at timestamp with time zone,
  status text NOT NULL DEFAULT 'draft'::text,
  template_id uuid NOT NULL,
  institution_id uuid NOT NULL DEFAULT get_institution_id(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  raw_xml text
);

CREATE TABLE IF NOT EXISTS public.compliance_messages (
  sender_name text NOT NULL DEFAULT 'RegCo'::text,
  is_pinned boolean NOT NULL DEFAULT false,
  category text NOT NULL DEFAULT 'CBN Notice'::text,
  is_read boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  subject text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compliance_reports (
  user_id uuid NOT NULL,
  status text DEFAULT 'generating'::text,
  institution_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  generated_at timestamp with time zone,
  storage_path text,
  report_type text DEFAULT 'monthly_board_pack'::text,
  metrics jsonb,
  month text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text
);

CREATE TABLE IF NOT EXISTS public.compliance_rules (
  corporate_ctr_threshold bigint DEFAULT 10000000,
  updated_by uuid,
  updated_at timestamp with time zone DEFAULT now(),
  institution_id uuid NOT NULL,
  individual_ctr_threshold bigint DEFAULT 5000000
);

CREATE TABLE IF NOT EXISTS public.compliance_score_history (
  user_id uuid NOT NULL,
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  breakdown jsonb DEFAULT '{}'::jsonb,
  month text NOT NULL,
  score integer NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.compliance_scores (
  score_breakdown jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status_label text NOT NULL DEFAULT 'No data yet'::text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  score integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL,
  calculated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ctr_flagged_transactions (
  customer_id uuid,
  customer_segment text,
  entity_type text NOT NULL DEFAULT 'individual'::text,
  phone_hash text,
  account_number_hash text,
  bvn_hash text,
  created_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'pending_review'::text,
  flag_reason text,
  amount bigint,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  transaction_id uuid
);

CREATE TABLE IF NOT EXISTS public.customer_accounts (
  open_date date DEFAULT CURRENT_DATE,
  account_type text DEFAULT 'Savings'::text,
  currency text DEFAULT 'NGN'::text,
  balance bigint DEFAULT 0,
  status text DEFAULT 'Active'::text,
  account_number text,
  customer_id uuid,
  account_number_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  branch text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.customer_kyc (
  last_reviewed_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  user_id uuid NOT NULL,
  kyc_status text DEFAULT 'incomplete'::text,
  kyc_tier integer DEFAULT 1,
  id_type text,
  id_number text,
  id_verified boolean DEFAULT false,
  address_verified boolean DEFAULT false,
  bvn_verified boolean DEFAULT false,
  photo_verified boolean DEFAULT false,
  missing_items jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
  pii_migration_reviewed boolean NOT NULL DEFAULT false,
  bvn_verified boolean NOT NULL DEFAULT false,
  bvn_verified_at timestamp with time zone,
  account_number_hash text NOT NULL,
  full_name_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  email_hash text,
  phone_hash text,
  bvn_hash text,
  customer_segment text NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  kyc_status text NOT NULL DEFAULT 'pending'::text,
  kyc_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamp with time zone,
  dob date
);

CREATE TABLE IF NOT EXISTS public.data_retention_jobs (
  created_at timestamp with time zone DEFAULT now(),
  last_run_at timestamp with time zone,
  status text DEFAULT 'PENDING'::text,
  retention_policy_days integer,
  target_table text NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS public.data_sources (
  status text NOT NULL DEFAULT 'Processing'::text,
  file_size bigint NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  file_path text NOT NULL,
  file_name text NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.demo_requests (
  full_name_hash text,
  phone_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  message text,
  report_type text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email_hash text,
  company_name_hash text
);

CREATE TABLE IF NOT EXISTS public.document_storage (
  encryption_key_id text,
  created_at timestamp with time zone DEFAULT now(),
  storage_path text NOT NULL,
  document_id uuid,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS public.documents (
  created_at timestamp with time zone DEFAULT now(),
  status text NOT NULL,
  document_type text NOT NULL,
  customer_id uuid,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS public.email_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reminder_type text NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  report_type text NOT NULL,
  reporting_period text NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.eod_reconciliation (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  str_due integer NOT NULL DEFAULT 0,
  exceptions_count integer NOT NULL DEFAULT 0,
  status text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ctr_generated integer NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL,
  total_transactions bigint NOT NULL,
  recon_date date NOT NULL,
  institution_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.filing_schedules (
  due_rule text NOT NULL,
  title text NOT NULL,
  regulator text NOT NULL,
  return_type text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  frequency text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  review_note text,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  severity text NOT NULL,
  rule_id uuid NOT NULL,
  transaction_id uuid,
  customer_id uuid NOT NULL,
  score smallint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open'::text,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  reviewed_by uuid,
  reviewed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.fraud_review_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  old_status text NOT NULL,
  new_status text NOT NULL,
  note text,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fraud_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  severity text NOT NULL DEFAULT 'high'::text,
  threshold jsonb NOT NULL DEFAULT '{}'::jsonb,
  rule_type text NOT NULL,
  name text NOT NULL,
  rule_code text NOT NULL,
  institution_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.fraud_signals (
  reasoning text,
  recommended_action text,
  ai_model_id text,
  ai_reviewed_at timestamp with time zone,
  ai_status text,
  risk_score integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  status text NOT NULL DEFAULT 'pending_review'::text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  severity text NOT NULL DEFAULT 'high'::text,
  signal_type text NOT NULL,
  transaction_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.goaml_exports (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  report_type text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  submitted_at timestamp with time zone,
  record_count integer NOT NULL DEFAULT 0,
  raw_xml text NOT NULL,
  xml_sha256 text NOT NULL,
  status text NOT NULL DEFAULT 'generated'::text,
  generated_by uuid
);

CREATE TABLE IF NOT EXISTS public.identity_review_events (
  screening_id uuid NOT NULL,
  new_status text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_reason text NOT NULL,
  changed_at timestamp with time zone NOT NULL DEFAULT statement_timestamp(),
  changed_by uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  old_status text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.identity_screening (
  review_notes text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  customer_id uuid,
  subject_hash text NOT NULL,
  subject_type text NOT NULL,
  screening_type text NOT NULL,
  screening_source text NOT NULL,
  result_status text NOT NULL DEFAULT 'pending'::text,
  rule_code text,
  score integer NOT NULL DEFAULT 0,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  provider text,
  provider_reference text,
  provider_status text,
  checks_requested text[] DEFAULT ARRAY['nin'::text, 'bvn'::text, 'selfie'::text, 'doc'::text, 'pep_sanctions'::text],
  provider_payload jsonb DEFAULT '{}'::jsonb,
  verification_url text,
  risk_score smallint,
  duplicate_of uuid
);

CREATE TABLE IF NOT EXISTS public.institution_kyc_configs (
  smile_partner_id_enc text,
  smile_api_key_enc text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  provider text NOT NULL,
  dojah_app_id_enc text,
  institution_id uuid NOT NULL,
  dojah_secret_enc text
);

CREATE TABLE IF NOT EXISTS public.institution_report_types (
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT true,
  report_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.institution_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL,
  user_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.institutions (
  ndpa_residency_verified boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  compliance_email text,
  status text DEFAULT 'active'::text,
  license_type text,
  rc_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  cbn_code text
);

CREATE TABLE IF NOT EXISTS public.integration_events (
  created_at timestamp with time zone DEFAULT now(),
  event_payload jsonb,
  integration_name text,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.knowledge_base (
  cleaned_content text,
  embedding vector(3072),
  needs_reembed boolean DEFAULT false,
  ingested_at timestamp with time zone DEFAULT now(),
  embedding_model text,
  content_hash text,
  chunk_index integer,
  document_type text,
  jurisdiction text,
  publication_date text,
  section_heading text,
  document_title text,
  regulator text,
  source_url text,
  source_name text,
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  content text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.kyc_attempts (
  created_at timestamp with time zone DEFAULT now(),
  request_payload jsonb,
  check_type text NOT NULL,
  response_payload jsonb,
  provider text NOT NULL,
  institution_id uuid NOT NULL,
  screening_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.kyc_provider_config (
  dojah_secret_key_encrypted text,
  smile_partner_id text,
  institution_id uuid NOT NULL,
  primary_provider text NOT NULL DEFAULT 'dojah'::text,
  fallback_provider text NOT NULL DEFAULT 'smile'::text,
  dojah_app_id text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  enabled_checks text[] DEFAULT ARRAY['nin'::text, 'bvn'::text, 'selfie'::text, 'doc'::text, 'pep_sanctions'::text],
  smile_api_key_encrypted text
);

CREATE TABLE IF NOT EXISTS public.kyc_records (
  created_at timestamp with time zone DEFAULT now(),
  customer_id uuid,
  id_verified boolean DEFAULT false,
  address_verified boolean DEFAULT false,
  bvn_verified boolean DEFAULT false,
  photo_verified boolean DEFAULT false,
  kyc_status text NOT NULL,
  missing_items text[],
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.kyc_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  customer_id uuid,
  status text NOT NULL,
  provider text,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.kyc_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  verification_type text NOT NULL,
  provider text NOT NULL,
  provider_ref text,
  match_score numeric,
  status text NOT NULL,
  request_hash text NOT NULL,
  response_encrypted text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.login_attempts (
  last_attempt_at timestamp with time zone DEFAULT now(),
  locked_until timestamp with time zone,
  attempt_count integer NOT NULL DEFAULT 0,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email_hash text
);

CREATE TABLE IF NOT EXISTS public.monitored_transactions (
  occurred_at timestamp with time zone NOT NULL DEFAULT now(),
  geo_city text,
  geo_country text,
  ip_address text,
  device_id text,
  counterparty_account text,
  counterparty_name text,
  created_at timestamp with time zone DEFAULT now(),
  risk_score_at_time smallint,
  direction text NOT NULL,
  channel text NOT NULL,
  amount numeric(20,2) NOT NULL,
  currency text NOT NULL DEFAULT 'NGN'::text,
  external_ref text NOT NULL,
  customer_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.monthly_compliance_tasks (
  description text,
  category text NOT NULL,
  month text NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  completed_at timestamp with time zone,
  recurring boolean DEFAULT true,
  status text DEFAULT 'pending'::text,
  priority_order integer DEFAULT 0,
  priority text DEFAULT 'medium'::text,
  title text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.news_read_status (
  news_id uuid NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  read_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pending_submissions (
  "institutionId" uuid NOT NULL,
  "caseId" text NOT NULL,
  "transactionDate" text NOT NULL,
  "amountNGN" bigint NOT NULL,
  "flagRule" text NOT NULL,
  "flagSeverity" text NOT NULL,
  "owlScore" numeric NOT NULL,
  narrative text,
  status text NOT NULL DEFAULT 'pending'::text,
  "createdAt" text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pep_entries (
  country text,
  full_name_hash text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  source text,
  date_of_birth date,
  status text DEFAULT 'active'::text,
  category text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "position" text
);

CREATE TABLE IF NOT EXISTS public.pep_screen_results (
  match_found boolean,
  customer_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  institution_id uuid NOT NULL,
  pep_level integer,
  id uuid NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  account_status text NOT NULL DEFAULT 'Active'::text,
  company_name_hash text,
  reporting_api_key text DEFAULT encode(gen_random_bytes(32), 'hex'::text),
  full_name_hash text,
  phone_hash text,
  tutorial_completed boolean NOT NULL DEFAULT false,
  notification_email_report_ready boolean NOT NULL DEFAULT true,
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  rc_number text,
  compliance_lead_name_hash text,
  cbn_license_category text
);

CREATE TABLE IF NOT EXISTS public.queue_jobs (
  status text DEFAULT 'QUEUED'::text,
  error text,
  result jsonb,
  path text,
  args_hash text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  attempts integer DEFAULT 0,
  payload jsonb,
  job_type text NOT NULL DEFAULT 'aml_async'::text,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS public.receive_transaction_requests (
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  raw_payload jsonb NOT NULL,
  request_signature character varying(64) NOT NULL,
  transaction_id uuid,
  idempotency_key character varying(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.regulatory_filings (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  filed_at timestamp with time zone,
  total_amount numeric NOT NULL,
  case_id uuid,
  customer_id uuid,
  filing_ref text,
  currency text NOT NULL DEFAULT 'NGN'::text,
  transaction_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  filing_type text NOT NULL,
  transactions_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'due'::text,
  due_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS public.regulatory_news (
  url text NOT NULL,
  published_at timestamp with time zone,
  source text,
  category text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  is_read boolean DEFAULT false,
  is_important boolean DEFAULT false,
  tags text[],
  fetched_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.regulatory_rules (
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  citation text,
  rule_code text NOT NULL,
  threshold jsonb DEFAULT '{}'::jsonb,
  regulator text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.report_requests (
  approved_at timestamp with time zone,
  report_id uuid,
  approved_by uuid,
  readiness jsonb,
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  formats text[] NOT NULL DEFAULT '{}'::text[],
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'Processing'::text,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  data_source_id uuid,
  reporting_period_end date NOT NULL,
  reporting_period_start date NOT NULL,
  report_type text NOT NULL,
  rc_number text,
  institution_name text NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.report_statuses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL,
  report_subtype text NOT NULL,
  report_name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.report_templates (
  title text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code text NOT NULL,
  created_by uuid,
  definition jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  frequency text,
  regulator text
);

CREATE TABLE IF NOT EXISTS public.reports (
  status text NOT NULL DEFAULT 'Draft'::text,
  xml_url text,
  csv_url text,
  template_id uuid,
  template_version integer,
  return_type text,
  content text,
  period_end date,
  period_start date,
  generated_at timestamp with time zone,
  regulator text DEFAULT
  CASE
      WHEN (report_type = ANY (ARRAY['MFB Regulatory Return'::text, 'Monetary Policy Return'::text, 'Prudential Return'::text, 'CBN Forex Return'::text, 'Board Governance Return'::text, 'Consumer Protection Return'::text, 'CBN Consumer Protection Return'::text, 'CBN Monetary Policy Return'::text])) THEN 'CBN'::text
      WHEN (report_type = ANY (ARRAY['AML/CFT Compliance Report'::text, 'AML/CFT Report'::text, 'NFIU Regulatory Return'::text, 'International Transfers Report'::text])) THEN 'NFIU'::text
      WHEN (report_type = ANY (ARRAY['SCUML Annual Compliance'::text, 'SCUML Compliance Report'::text])) THEN 'SCUML'::text
      WHEN (report_type = ANY (ARRAY['NDIC Premium Return'::text, 'Single Obligor Report'::text])) THEN 'NDIC'::text
      WHEN (report_type = ANY (ARRAY['Company Income Tax Return'::text, 'PAYE Remittance'::text, 'Withholding Tax Return'::text, 'VAT Return'::text])) THEN 'FIRS'::text
      ELSE 'OTHER'::text
  END,
  validation_passed boolean,
  error_type text,
  report_filename text,
  error_message text,
  report_url text,
  file_url text,
  npl_ratio numeric,
  liquidity_percentage numeric,
  car_percentage numeric,
  xlsx_url text,
  docx_url text,
  pdf_url text,
  reporting_period_end date,
  reporting_period_start date,
  file_path text,
  report_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  report_name text NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.return_templates (
  report_type text NOT NULL,
  regulatory_body text NOT NULL,
  institution_id uuid NOT NULL DEFAULT get_institution_id(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  schema_definition jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS public.risk_profiles (
  assessed_at timestamp with time zone NOT NULL DEFAULT now(),
  risk_tier text NOT NULL,
  risk_score smallint NOT NULL,
  customer_id uuid NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  factors jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.risk_scores (
  created_at timestamp with time zone DEFAULT now(),
  score double precision NOT NULL,
  feature_importance jsonb,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  model_version text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roles (
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  profile_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sanctions_config (
  institution_id uuid NOT NULL,
  watchlist_name text NOT NULL,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.sanctions_entries (
  created_at timestamp with time zone DEFAULT now(),
  match_score numeric,
  watchlist_name text NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  customer_id uuid,
  matched_name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sanctions_screen_results (
  entity_details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  match_score double precision,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  customer_id uuid,
  list_name text
);

CREATE TABLE IF NOT EXISTS public.screening_results (
  search_bvn_hash text,
  action_taken text,
  screened_by text,
  match_details jsonb DEFAULT '{}'::jsonb,
  highest_risk text NOT NULL DEFAULT 'none'::text,
  matches_found integer NOT NULL DEFAULT 0,
  search_date timestamp with time zone NOT NULL DEFAULT now(),
  customer_id uuid,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  institution_id uuid NOT NULL,
  search_name_hash text
);

CREATE TABLE IF NOT EXISTS public.staging_chunks (
  title text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'::text,
  content text NOT NULL,
  chunk_index integer NOT NULL,
  url text NOT NULL,
  source text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.str_candidates (
  reason text,
  customer_id uuid,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  filing_status text DEFAULT 'PENDING'::text,
  risk_score_at_filing double precision
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'Open'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  institution_name text NOT NULL DEFAULT ''::text,
  message text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transaction_events (
  institution_id uuid NOT NULL,
  bvn_hash text NOT NULL,
  account_number_hash text NOT NULL,
  customer_id uuid NOT NULL,
  path text NOT NULL DEFAULT 'async_queue'::text,
  channel text,
  entity_type text NOT NULL DEFAULT 'individual'::text,
  amount bigint NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  phone_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transaction_ingestion_events (
  payload jsonb NOT NULL,
  request_hash text NOT NULL,
  idempotency_key text NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'accepted'::text,
  error text,
  transaction_id uuid
);

CREATE TABLE IF NOT EXISTS public.transaction_review_events (
  changed_by uuid,
  new_review_status text NOT NULL,
  old_review_status text,
  transaction_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_reason text,
  changed_at timestamp with time zone NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS public.transaction_reviews (
  transaction_date timestamp with time zone NOT NULL DEFAULT now(),
  str_reference text,
  review_status text DEFAULT 'pending'::text,
  flag_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  case_number text,
  status text DEFAULT 'Open'::text,
  flag_reason text,
  flag_severity text DEFAULT 'low'::text,
  amount bigint,
  upload_batch_id text,
  customer_id uuid,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_name_hash text,
  account_number_hash text,
  channel text
);

CREATE TABLE IF NOT EXISTS public.transactions (
  customer_id uuid,
  channel text NOT NULL,
  transaction_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid NOT NULL,
  amount bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS public.unified_transactions (
  review_status text NOT NULL DEFAULT 'pending'::text,
  flag_rule text,
  flag_reason text,
  flag_severity text,
  is_flagged boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  balance_after bigint,
  reference text,
  counterparty text,
  description text,
  channel text,
  transaction_type text,
  currency text DEFAULT 'NGN'::text,
  amount bigint NOT NULL DEFAULT 0,
  transaction_date timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  customer_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_name_hash text,
  counterparty_hash text,
  description_hash text,
  narration_hash text,
  institution_id uuid,
  status text DEFAULT 'pending'::text,
  checker_group_id uuid,
  account_number_hash text,
  transaction_ref text,
  branch_code text,
  narration text,
  review_notes text,
  str_filed_at timestamp with time zone,
  str_reference text
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  role app_role NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  reports_filed integer NOT NULL DEFAULT 0,
  on_time_rate numeric NOT NULL DEFAULT 0,
  violations integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.users (
  full_name_hash text,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  role text NOT NULL DEFAULT 'analyst'::text,
  email_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.verification_sessions (
  bvn_hash text,
  status text NOT NULL DEFAULT 'pending'::text,
  provider text NOT NULL,
  customer_id uuid,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  phone_hash text
);

CREATE TABLE IF NOT EXISTS public.watchlist_entities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL DEFAULT get_institution_id(),
  is_global boolean DEFAULT false,
  entity_type text,
  risk_level text,
  source_provider text,
  metadata jsonb,
  search_vector tsvector,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  full_name_hash text
);

CREATE TABLE IF NOT EXISTS public.watchlist_matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  transaction_id uuid NOT NULL,
  watchlist_entity_id uuid NOT NULL,
  match_score double precision NOT NULL,
  status text NOT NULL DEFAULT 'pending_review'::text,
  created_at timestamp with time zone DEFAULT now(),
  reviewed_by uuid,
  reviewed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.webhook_api_keys (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_used_at timestamp with time zone,
  active boolean NOT NULL DEFAULT true,
  key_prefix text NOT NULL,
  key_hash text NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
  created_at timestamp with time zone DEFAULT now(),
  delivery_status text,
  payload jsonb,
  event_type text NOT NULL,
  target_url text NOT NULL,
  institution_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4()
);

-- 4. Constraints (PK / FK / UNIQUE / CHECK) for the 89 baseline-owned tables.
-- Excludes the 5 tables owned by Phase B/C/D migrations.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_actions_action_chk'
  ) THEN
    ALTER TABLE public.account_actions ADD CONSTRAINT account_actions_action_chk CHECK (action = ANY (ARRAY['freeze'::text, 'unfreeze'::text, 'flag'::text, 'restrict'::text, 'transaction'::text, 'update'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_actions_case_id_fkey'
  ) THEN
    ALTER TABLE public.account_actions ADD CONSTRAINT account_actions_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_actions_pkey'
  ) THEN
    ALTER TABLE public.account_actions ADD CONSTRAINT account_actions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_actions_status_chk'
  ) THEN
    ALTER TABLE public.account_actions ADD CONSTRAINT account_actions_status_chk CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'executed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'accounts_institution_id_fkey'
  ) THEN
    ALTER TABLE public.accounts ADD CONSTRAINT accounts_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'accounts_pkey'
  ) THEN
    ALTER TABLE public.accounts ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adverse_media_cache_pkey'
  ) THEN
    ALTER TABLE public.adverse_media_cache ADD CONSTRAINT adverse_media_cache_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adverse_media_cache_query_hash_key'
  ) THEN
    ALTER TABLE public.adverse_media_cache ADD CONSTRAINT adverse_media_cache_query_hash_key UNIQUE (query_hash);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_conversations_pkey'
  ) THEN
    ALTER TABLE public.agent_conversations ADD CONSTRAINT agent_conversations_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_conversations_user_id_fkey'
  ) THEN
    ALTER TABLE public.agent_conversations ADD CONSTRAINT agent_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_messages_conversation_id_fkey'
  ) THEN
    ALTER TABLE public.agent_messages ADD CONSTRAINT agent_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES agent_conversations(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_messages_pkey'
  ) THEN
    ALTER TABLE public.agent_messages ADD CONSTRAINT agent_messages_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_messages_role_check'
  ) THEN
    ALTER TABLE public.agent_messages ADD CONSTRAINT agent_messages_role_check CHECK (role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_messages_user_id_fkey'
  ) THEN
    ALTER TABLE public.agent_messages ADD CONSTRAINT agent_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_tool_invocations_pkey'
  ) THEN
    ALTER TABLE public.agent_tool_invocations ADD CONSTRAINT agent_tool_invocations_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alerts_assigned_to_fkey'
  ) THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES users(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alerts_institution_id_fkey'
  ) THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alerts_pkey'
  ) THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alerts_status_lifecycle_check'
  ) THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_status_lifecycle_check CHECK (status = ANY (ARRAY['OPEN'::text, 'PENDING_CHECKER_REVIEW'::text, 'APPROVED'::text, 'REJECTED'::text, 'ESCALATED'::text, 'CLOSED'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alerts_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alert_status_history_alert_id_fkey'
  ) THEN
    ALTER TABLE public.aml_alert_status_history ADD CONSTRAINT aml_alert_status_history_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES aml_alerts(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alert_status_history_pkey'
  ) THEN
    ALTER TABLE public.aml_alert_status_history ADD CONSTRAINT aml_alert_status_history_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alerts_institution_id_fkey'
  ) THEN
    ALTER TABLE public.aml_alerts ADD CONSTRAINT aml_alerts_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alerts_pkey'
  ) THEN
    ALTER TABLE public.aml_alerts ADD CONSTRAINT aml_alerts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alerts_rule_id_fkey'
  ) THEN
    ALTER TABLE public.aml_alerts ADD CONSTRAINT aml_alerts_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES aml_rules(id) ON DELETE RESTRICT;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alerts_severity_check'
  ) THEN
    ALTER TABLE public.aml_alerts ADD CONSTRAINT aml_alerts_severity_check CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alerts_status_check'
  ) THEN
    ALTER TABLE public.aml_alerts ADD CONSTRAINT aml_alerts_status_check CHECK (status = ANY (ARRAY['open'::text, 'under_review'::text, 'escalated'::text, 'closed'::text, 'reported'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_alerts_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.aml_alerts ADD CONSTRAINT aml_alerts_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES monitored_transactions(id) ON DELETE SET NULL;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_decisions_decision_check'
  ) THEN
    ALTER TABLE public.aml_decisions ADD CONSTRAINT aml_decisions_decision_check CHECK (decision = ANY (ARRAY['APPROVE'::text, 'FLAG'::text, 'REJECT'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_decisions_pkey'
  ) THEN
    ALTER TABLE public.aml_decisions ADD CONSTRAINT aml_decisions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_jobs_pkey'
  ) THEN
    ALTER TABLE public.aml_jobs ADD CONSTRAINT aml_jobs_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_review_events_alert_id_fkey'
  ) THEN
    ALTER TABLE public.aml_review_events ADD CONSTRAINT aml_review_events_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES aml_alerts(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_review_events_pkey'
  ) THEN
    ALTER TABLE public.aml_review_events ADD CONSTRAINT aml_review_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_rules_institution_id_fkey'
  ) THEN
    ALTER TABLE public.aml_rules ADD CONSTRAINT aml_rules_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_rules_institution_id_rule_code_key'
  ) THEN
    ALTER TABLE public.aml_rules ADD CONSTRAINT aml_rules_institution_id_rule_code_key UNIQUE (institution_id, rule_code);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'aml_rules_pkey'
  ) THEN
    ALTER TABLE public.aml_rules ADD CONSTRAINT aml_rules_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_issues_pkey'
  ) THEN
    ALTER TABLE public.audit_issues ADD CONSTRAINT audit_issues_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_log_pkey'
  ) THEN
    ALTER TABLE public.audit_log ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_trail_alert_id_fkey'
  ) THEN
    ALTER TABLE public.audit_trail ADD CONSTRAINT audit_trail_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_trail_pkey'
  ) THEN
    ALTER TABLE public.audit_trail ADD CONSTRAINT audit_trail_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_alerts_alert_id_fkey'
  ) THEN
    ALTER TABLE public.case_alerts ADD CONSTRAINT case_alerts_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES aml_alerts(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_alerts_case_id_fkey'
  ) THEN
    ALTER TABLE public.case_alerts ADD CONSTRAINT case_alerts_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_alerts_pkey'
  ) THEN
    ALTER TABLE public.case_alerts ADD CONSTRAINT case_alerts_pkey PRIMARY KEY (case_id, alert_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_artifacts_case_id_fkey'
  ) THEN
    ALTER TABLE public.case_artifacts ADD CONSTRAINT case_artifacts_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_artifacts_pkey'
  ) THEN
    ALTER TABLE public.case_artifacts ADD CONSTRAINT case_artifacts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_events_actor_kind_chk'
  ) THEN
    ALTER TABLE public.case_events ADD CONSTRAINT case_events_actor_kind_chk CHECK (actor_kind = ANY (ARRAY['user'::text, 'agent'::text, 'system'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_events_case_id_fkey'
  ) THEN
    ALTER TABLE public.case_events ADD CONSTRAINT case_events_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_events_pkey'
  ) THEN
    ALTER TABLE public.case_events ADD CONSTRAINT case_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_status_history_case_id_fkey'
  ) THEN
    ALTER TABLE public.case_status_history ADD CONSTRAINT case_status_history_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'case_status_history_pkey'
  ) THEN
    ALTER TABLE public.case_status_history ADD CONSTRAINT case_status_history_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cases_pkey'
  ) THEN
    ALTER TABLE public.cases ADD CONSTRAINT cases_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cases_severity_chk'
  ) THEN
    ALTER TABLE public.cases ADD CONSTRAINT cases_severity_chk CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cases_status_chk'
  ) THEN
    ALTER TABLE public.cases ADD CONSTRAINT cases_status_chk CHECK (status = ANY (ARRAY['open'::text, 'investigating'::text, 'escalated'::text, 'closed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compiled_returns_pkey'
  ) THEN
    ALTER TABLE public.compiled_returns ADD CONSTRAINT compiled_returns_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compiled_returns_status_check'
  ) THEN
    ALTER TABLE public.compiled_returns ADD CONSTRAINT compiled_returns_status_check CHECK (status = ANY (ARRAY['draft'::text, 'compiled'::text, 'submitted'::text, 'failed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_institution_return'
  ) THEN
    ALTER TABLE public.compiled_returns ADD CONSTRAINT fk_institution_return FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_template'
  ) THEN
    ALTER TABLE public.compiled_returns ADD CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES return_templates(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_messages_pkey'
  ) THEN
    ALTER TABLE public.compliance_messages ADD CONSTRAINT compliance_messages_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_reports_institution_id_fkey'
  ) THEN
    ALTER TABLE public.compliance_reports ADD CONSTRAINT compliance_reports_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_reports_pkey'
  ) THEN
    ALTER TABLE public.compliance_reports ADD CONSTRAINT compliance_reports_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_rules_pkey'
  ) THEN
    ALTER TABLE public.compliance_rules ADD CONSTRAINT compliance_rules_pkey PRIMARY KEY (institution_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_rules_thresholds_positive_check'
  ) THEN
    ALTER TABLE public.compliance_rules ADD CONSTRAINT compliance_rules_thresholds_positive_check CHECK ((individual_ctr_threshold IS NULL OR individual_ctr_threshold > 0) AND (corporate_ctr_threshold IS NULL OR corporate_ctr_threshold > 0));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_score_history_pkey'
  ) THEN
    ALTER TABLE public.compliance_score_history ADD CONSTRAINT compliance_score_history_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_score_history_user_id_month_key'
  ) THEN
    ALTER TABLE public.compliance_score_history ADD CONSTRAINT compliance_score_history_user_id_month_key UNIQUE (user_id, month);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_scores_pkey'
  ) THEN
    ALTER TABLE public.compliance_scores ADD CONSTRAINT compliance_scores_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'compliance_scores_user_id_fkey'
  ) THEN
    ALTER TABLE public.compliance_scores ADD CONSTRAINT compliance_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ctr_flagged_transactions_amount_positive_check'
  ) THEN
    ALTER TABLE public.ctr_flagged_transactions ADD CONSTRAINT ctr_flagged_transactions_amount_positive_check CHECK (amount IS NULL OR amount > 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ctr_flagged_transactions_customer_id_fkey'
  ) THEN
    ALTER TABLE public.ctr_flagged_transactions ADD CONSTRAINT ctr_flagged_transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ctr_flagged_transactions_pkey'
  ) THEN
    ALTER TABLE public.ctr_flagged_transactions ADD CONSTRAINT ctr_flagged_transactions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ctr_flagged_transactions_status_check'
  ) THEN
    ALTER TABLE public.ctr_flagged_transactions ADD CONSTRAINT ctr_flagged_transactions_status_check CHECK (status = ANY (ARRAY['pending_review'::text, 'reviewed'::text, 'false_positive'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ctr_flagged_transactions_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.ctr_flagged_transactions ADD CONSTRAINT ctr_flagged_transactions_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_accounts_hash_only_check'
  ) THEN
    ALTER TABLE public.customer_accounts ADD CONSTRAINT customer_accounts_hash_only_check CHECK (account_number IS NULL AND account_number_hash ~ '^[0-9a-f]{64}$'::text);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_accounts_pkey'
  ) THEN
    ALTER TABLE public.customer_accounts ADD CONSTRAINT customer_accounts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_kyc_customer_id_key'
  ) THEN
    ALTER TABLE public.customer_kyc ADD CONSTRAINT customer_kyc_customer_id_key UNIQUE (customer_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_kyc_pkey'
  ) THEN
    ALTER TABLE public.customer_kyc ADD CONSTRAINT customer_kyc_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customers_customer_segment_check'
  ) THEN
    ALTER TABLE public.customers ADD CONSTRAINT customers_customer_segment_check CHECK (customer_segment = ANY (ARRAY['individual'::text, 'corporate'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customers_pkey'
  ) THEN
    ALTER TABLE public.customers ADD CONSTRAINT customers_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'data_retention_jobs_institution_id_fkey'
  ) THEN
    ALTER TABLE public.data_retention_jobs ADD CONSTRAINT data_retention_jobs_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'data_retention_jobs_pkey'
  ) THEN
    ALTER TABLE public.data_retention_jobs ADD CONSTRAINT data_retention_jobs_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'data_sources_pkey'
  ) THEN
    ALTER TABLE public.data_sources ADD CONSTRAINT data_sources_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'demo_requests_pkey'
  ) THEN
    ALTER TABLE public.demo_requests ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'document_storage_document_id_fkey'
  ) THEN
    ALTER TABLE public.document_storage ADD CONSTRAINT document_storage_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'document_storage_institution_id_fkey'
  ) THEN
    ALTER TABLE public.document_storage ADD CONSTRAINT document_storage_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'document_storage_pkey'
  ) THEN
    ALTER TABLE public.document_storage ADD CONSTRAINT document_storage_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'documents_customer_id_fkey'
  ) THEN
    ALTER TABLE public.documents ADD CONSTRAINT documents_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'documents_institution_id_fkey'
  ) THEN
    ALTER TABLE public.documents ADD CONSTRAINT documents_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'documents_pkey'
  ) THEN
    ALTER TABLE public.documents ADD CONSTRAINT documents_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'email_reminders_pkey'
  ) THEN
    ALTER TABLE public.email_reminders ADD CONSTRAINT email_reminders_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'eod_reconciliation_institution_id_fkey'
  ) THEN
    ALTER TABLE public.eod_reconciliation ADD CONSTRAINT eod_reconciliation_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'eod_reconciliation_institution_id_recon_date_key'
  ) THEN
    ALTER TABLE public.eod_reconciliation ADD CONSTRAINT eod_reconciliation_institution_id_recon_date_key UNIQUE (institution_id, recon_date);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'eod_reconciliation_pkey'
  ) THEN
    ALTER TABLE public.eod_reconciliation ADD CONSTRAINT eod_reconciliation_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'eod_reconciliation_status_check'
  ) THEN
    ALTER TABLE public.eod_reconciliation ADD CONSTRAINT eod_reconciliation_status_check CHECK (status = ANY (ARRAY['balanced'::text, 'exception'::text, 'failed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'filing_schedules_pkey'
  ) THEN
    ALTER TABLE public.filing_schedules ADD CONSTRAINT filing_schedules_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'filing_schedules_return_type_key'
  ) THEN
    ALTER TABLE public.filing_schedules ADD CONSTRAINT filing_schedules_return_type_key UNIQUE (return_type);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_alerts_institution_id_fkey'
  ) THEN
    ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_alerts_pkey'
  ) THEN
    ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_alerts_rule_id_fkey'
  ) THEN
    ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES fraud_rules(id) ON DELETE RESTRICT;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_alerts_severity_check'
  ) THEN
    ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_severity_check CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_alerts_status_check'
  ) THEN
    ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_status_check CHECK (status = ANY (ARRAY['open'::text, 'under_review'::text, 'confirmed_fraud'::text, 'dismissed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_alerts_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES monitored_transactions(id) ON DELETE SET NULL;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_review_events_alert_id_fkey'
  ) THEN
    ALTER TABLE public.fraud_review_events ADD CONSTRAINT fraud_review_events_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES fraud_alerts(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_review_events_pkey'
  ) THEN
    ALTER TABLE public.fraud_review_events ADD CONSTRAINT fraud_review_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_rules_institution_id_fkey'
  ) THEN
    ALTER TABLE public.fraud_rules ADD CONSTRAINT fraud_rules_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_rules_institution_id_rule_code_key'
  ) THEN
    ALTER TABLE public.fraud_rules ADD CONSTRAINT fraud_rules_institution_id_rule_code_key UNIQUE (institution_id, rule_code);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_rules_pkey'
  ) THEN
    ALTER TABLE public.fraud_rules ADD CONSTRAINT fraud_rules_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_signals_institution_id_fkey'
  ) THEN
    ALTER TABLE public.fraud_signals ADD CONSTRAINT fraud_signals_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_signals_pkey'
  ) THEN
    ALTER TABLE public.fraud_signals ADD CONSTRAINT fraud_signals_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fraud_signals_reviewed_by_fkey'
  ) THEN
    ALTER TABLE public.fraud_signals ADD CONSTRAINT fraud_signals_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_fraud_signal_txn_type'
  ) THEN
    ALTER TABLE public.fraud_signals ADD CONSTRAINT uq_fraud_signal_txn_type UNIQUE (transaction_id, signal_type);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'goaml_exports_institution_id_fkey'
  ) THEN
    ALTER TABLE public.goaml_exports ADD CONSTRAINT goaml_exports_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'goaml_exports_period_check'
  ) THEN
    ALTER TABLE public.goaml_exports ADD CONSTRAINT goaml_exports_period_check CHECK (period_start <= period_end);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'goaml_exports_pkey'
  ) THEN
    ALTER TABLE public.goaml_exports ADD CONSTRAINT goaml_exports_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'goaml_exports_report_type_check'
  ) THEN
    ALTER TABLE public.goaml_exports ADD CONSTRAINT goaml_exports_report_type_check CHECK (report_type = ANY (ARRAY['CTR'::text, 'STR'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'goaml_exports_status_check'
  ) THEN
    ALTER TABLE public.goaml_exports ADD CONSTRAINT goaml_exports_status_check CHECK (status = ANY (ARRAY['generated'::text, 'submitted'::text, 'failed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_review_events_change_reason_check'
  ) THEN
    ALTER TABLE public.identity_review_events ADD CONSTRAINT identity_review_events_change_reason_check CHECK (char_length(change_reason) <= 500);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_review_events_metadata_check'
  ) THEN
    ALTER TABLE public.identity_review_events ADD CONSTRAINT identity_review_events_metadata_check CHECK (octet_length(metadata::text) <= 8192);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_review_events_pkey'
  ) THEN
    ALTER TABLE public.identity_review_events ADD CONSTRAINT identity_review_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_review_events_screening_id_fkey'
  ) THEN
    ALTER TABLE public.identity_review_events ADD CONSTRAINT identity_review_events_screening_id_fkey FOREIGN KEY (screening_id) REFERENCES identity_screening(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_identity_screening_hash_fmt'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT chk_identity_screening_hash_fmt CHECK (subject_hash ~ '^[0-9a-f]{64}$'::text);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_customer_id_fkey'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_duplicate_of_fkey'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_duplicate_of_fkey FOREIGN KEY (duplicate_of) REFERENCES identity_screening(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_institution_id_fkey'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_pkey'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_provider_check'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_provider_check CHECK (provider = ANY (ARRAY['smile'::text, 'dojah'::text, 'manual'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_result_status_check'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_result_status_check CHECK (result_status = ANY (ARRAY['pending'::text, 'clear'::text, 'flagged'::text, 'review_required'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_score_check'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_score_check CHECK (score >= 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_screening_source_check'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_screening_source_check CHECK (screening_source = ANY (ARRAY['internal'::text, 'dojah'::text, 'smile'::text, 'prembly'::text, 'manual'::text, 'system'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_screening_type_check'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_screening_type_check CHECK (screening_type = ANY (ARRAY['PEP'::text, 'KYC'::text, 'SANCTIONS'::text, 'ADVERSE_MEDIA'::text, 'WATCHLIST'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'identity_screening_subject_type_check'
  ) THEN
    ALTER TABLE public.identity_screening ADD CONSTRAINT identity_screening_subject_type_check CHECK (subject_type = ANY (ARRAY['individual'::text, 'corporate'::text, 'account'::text, 'counterparty'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_kyc_configs_institution_id_fkey'
  ) THEN
    ALTER TABLE public.institution_kyc_configs ADD CONSTRAINT institution_kyc_configs_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_kyc_configs_pkey'
  ) THEN
    ALTER TABLE public.institution_kyc_configs ADD CONSTRAINT institution_kyc_configs_pkey PRIMARY KEY (institution_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_kyc_configs_provider_check'
  ) THEN
    ALTER TABLE public.institution_kyc_configs ADD CONSTRAINT institution_kyc_configs_provider_check CHECK (provider = ANY (ARRAY['dojah'::text, 'smile'::text, 'mock'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_report_types_pkey'
  ) THEN
    ALTER TABLE public.institution_report_types ADD CONSTRAINT institution_report_types_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_report_types_user_id_report_type_key'
  ) THEN
    ALTER TABLE public.institution_report_types ADD CONSTRAINT institution_report_types_user_id_report_type_key UNIQUE (user_id, report_type);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_users_institution_id_fkey'
  ) THEN
    ALTER TABLE public.institution_users ADD CONSTRAINT institution_users_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_users_institution_id_user_id_key'
  ) THEN
    ALTER TABLE public.institution_users ADD CONSTRAINT institution_users_institution_id_user_id_key UNIQUE (institution_id, user_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_users_pkey'
  ) THEN
    ALTER TABLE public.institution_users ADD CONSTRAINT institution_users_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institution_users_role_check'
  ) THEN
    ALTER TABLE public.institution_users ADD CONSTRAINT institution_users_role_check CHECK (role = ANY (ARRAY['admin'::text, 'analyst'::text, 'viewer'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institutions_pkey'
  ) THEN
    ALTER TABLE public.institutions ADD CONSTRAINT institutions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'institutions_rc_number_key'
  ) THEN
    ALTER TABLE public.institutions ADD CONSTRAINT institutions_rc_number_key UNIQUE (rc_number);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'integration_events_institution_id_fkey'
  ) THEN
    ALTER TABLE public.integration_events ADD CONSTRAINT integration_events_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'integration_events_pkey'
  ) THEN
    ALTER TABLE public.integration_events ADD CONSTRAINT integration_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'knowledge_base_pkey'
  ) THEN
    ALTER TABLE public.knowledge_base ADD CONSTRAINT knowledge_base_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_attempts_pkey'
  ) THEN
    ALTER TABLE public.kyc_attempts ADD CONSTRAINT kyc_attempts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_attempts_screening_id_fkey'
  ) THEN
    ALTER TABLE public.kyc_attempts ADD CONSTRAINT kyc_attempts_screening_id_fkey FOREIGN KEY (screening_id) REFERENCES identity_screening(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_provider_config_institution_id_fkey'
  ) THEN
    ALTER TABLE public.kyc_provider_config ADD CONSTRAINT kyc_provider_config_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_provider_config_pkey'
  ) THEN
    ALTER TABLE public.kyc_provider_config ADD CONSTRAINT kyc_provider_config_pkey PRIMARY KEY (institution_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_records_customer_id_fkey'
  ) THEN
    ALTER TABLE public.kyc_records ADD CONSTRAINT kyc_records_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_records_kyc_status_check'
  ) THEN
    ALTER TABLE public.kyc_records ADD CONSTRAINT kyc_records_kyc_status_check CHECK (kyc_status = ANY (ARRAY['complete'::text, 'incomplete'::text, 'pending_verification'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_records_pkey'
  ) THEN
    ALTER TABLE public.kyc_records ADD CONSTRAINT kyc_records_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_sessions_customer_id_fkey'
  ) THEN
    ALTER TABLE public.kyc_sessions ADD CONSTRAINT kyc_sessions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_sessions_institution_id_fkey'
  ) THEN
    ALTER TABLE public.kyc_sessions ADD CONSTRAINT kyc_sessions_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_sessions_pkey'
  ) THEN
    ALTER TABLE public.kyc_sessions ADD CONSTRAINT kyc_sessions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_kyc_cust'
  ) THEN
    ALTER TABLE public.kyc_verifications ADD CONSTRAINT fk_kyc_cust FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_kyc_inst'
  ) THEN
    ALTER TABLE public.kyc_verifications ADD CONSTRAINT fk_kyc_inst FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'kyc_verifications_pkey'
  ) THEN
    ALTER TABLE public.kyc_verifications ADD CONSTRAINT kyc_verifications_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'login_attempts_pkey'
  ) THEN
    ALTER TABLE public.login_attempts ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monitored_transactions_channel_check'
  ) THEN
    ALTER TABLE public.monitored_transactions ADD CONSTRAINT monitored_transactions_channel_check CHECK (channel = ANY (ARRAY['transfer'::text, 'card'::text, 'ussd'::text, 'pos'::text, 'web'::text, 'mobile'::text, 'cash'::text, 'other'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monitored_transactions_direction_check'
  ) THEN
    ALTER TABLE public.monitored_transactions ADD CONSTRAINT monitored_transactions_direction_check CHECK (direction = ANY (ARRAY['in'::text, 'out'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monitored_transactions_institution_id_external_ref_key'
  ) THEN
    ALTER TABLE public.monitored_transactions ADD CONSTRAINT monitored_transactions_institution_id_external_ref_key UNIQUE (institution_id, external_ref);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monitored_transactions_pkey'
  ) THEN
    ALTER TABLE public.monitored_transactions ADD CONSTRAINT monitored_transactions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_external_ref_per_institution'
  ) THEN
    ALTER TABLE public.monitored_transactions ADD CONSTRAINT unique_external_ref_per_institution UNIQUE (institution_id, external_ref);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monthly_compliance_tasks_pkey'
  ) THEN
    ALTER TABLE public.monthly_compliance_tasks ADD CONSTRAINT monthly_compliance_tasks_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'news_read_status_news_id_fkey'
  ) THEN
    ALTER TABLE public.news_read_status ADD CONSTRAINT news_read_status_news_id_fkey FOREIGN KEY (news_id) REFERENCES regulatory_news(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'news_read_status_pkey'
  ) THEN
    ALTER TABLE public.news_read_status ADD CONSTRAINT news_read_status_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'news_read_status_user_id_news_id_key'
  ) THEN
    ALTER TABLE public.news_read_status ADD CONSTRAINT news_read_status_user_id_news_id_key UNIQUE (user_id, news_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pep_entries_pkey'
  ) THEN
    ALTER TABLE public.pep_entries ADD CONSTRAINT pep_entries_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pep_screen_results_customer_id_fkey'
  ) THEN
    ALTER TABLE public.pep_screen_results ADD CONSTRAINT pep_screen_results_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pep_screen_results_institution_id_fkey'
  ) THEN
    ALTER TABLE public.pep_screen_results ADD CONSTRAINT pep_screen_results_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pep_screen_results_pkey'
  ) THEN
    ALTER TABLE public.pep_screen_results ADD CONSTRAINT pep_screen_results_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_pkey'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'queue_jobs_institution_id_fkey'
  ) THEN
    ALTER TABLE public.queue_jobs ADD CONSTRAINT queue_jobs_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'queue_jobs_pkey'
  ) THEN
    ALTER TABLE public.queue_jobs ADD CONSTRAINT queue_jobs_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'receive_transaction_requests_pkey'
  ) THEN
    ALTER TABLE public.receive_transaction_requests ADD CONSTRAINT receive_transaction_requests_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'receive_transaction_requests_uniq_idx'
  ) THEN
    ALTER TABLE public.receive_transaction_requests ADD CONSTRAINT receive_transaction_requests_uniq_idx UNIQUE (institution_id, idempotency_key);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_case_id_fkey'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_customer_id_fkey'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_filing_ref_key'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_filing_ref_key UNIQUE (filing_ref);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_filing_type_check'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_filing_type_check CHECK (filing_type = ANY (ARRAY['CTR'::text, 'STR'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_institution_id_fkey'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_pkey'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_filings_status_check'
  ) THEN
    ALTER TABLE public.regulatory_filings ADD CONSTRAINT regulatory_filings_status_check CHECK (status = ANY (ARRAY['due'::text, 'filed'::text, 'overdue'::text, 'submitted'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_news_pkey'
  ) THEN
    ALTER TABLE public.regulatory_news ADD CONSTRAINT regulatory_news_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_news_url_key'
  ) THEN
    ALTER TABLE public.regulatory_news ADD CONSTRAINT regulatory_news_url_key UNIQUE (url);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_rules_pkey'
  ) THEN
    ALTER TABLE public.regulatory_rules ADD CONSTRAINT regulatory_rules_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'regulatory_rules_rule_code_key'
  ) THEN
    ALTER TABLE public.regulatory_rules ADD CONSTRAINT regulatory_rules_rule_code_key UNIQUE (rule_code);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_requests_pkey'
  ) THEN
    ALTER TABLE public.report_requests ADD CONSTRAINT report_requests_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_requests_report_id_fkey'
  ) THEN
    ALTER TABLE public.report_requests ADD CONSTRAINT report_requests_report_id_fkey FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE SET NULL;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_statuses_pkey'
  ) THEN
    ALTER TABLE public.report_statuses ADD CONSTRAINT report_statuses_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_statuses_status_check'
  ) THEN
    ALTER TABLE public.report_statuses ADD CONSTRAINT report_statuses_status_check CHECK (status = ANY (ARRAY['Ready'::text, 'Pending'::text, 'Urgent'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_statuses_user_id_fkey'
  ) THEN
    ALTER TABLE public.report_statuses ADD CONSTRAINT report_statuses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_templates_code_version_key'
  ) THEN
    ALTER TABLE public.report_templates ADD CONSTRAINT report_templates_code_version_key UNIQUE (code, version);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_templates_pkey'
  ) THEN
    ALTER TABLE public.report_templates ADD CONSTRAINT report_templates_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_templates_status_check'
  ) THEN
    ALTER TABLE public.report_templates ADD CONSTRAINT report_templates_status_check CHECK (status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reports_pkey'
  ) THEN
    ALTER TABLE public.reports ADD CONSTRAINT reports_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reports_template_id_fkey'
  ) THEN
    ALTER TABLE public.reports ADD CONSTRAINT reports_template_id_fkey FOREIGN KEY (template_id) REFERENCES report_templates(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reports_user_id_fkey'
  ) THEN
    ALTER TABLE public.reports ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_institution'
  ) THEN
    ALTER TABLE public.return_templates ADD CONSTRAINT fk_institution FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'return_templates_pkey'
  ) THEN
    ALTER TABLE public.return_templates ADD CONSTRAINT return_templates_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'return_templates_regulatory_body_check'
  ) THEN
    ALTER TABLE public.return_templates ADD CONSTRAINT return_templates_regulatory_body_check CHECK (regulatory_body = ANY (ARRAY['CBN'::text, 'NFIU'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'return_templates_report_type_check'
  ) THEN
    ALTER TABLE public.return_templates ADD CONSTRAINT return_templates_report_type_check CHECK (report_type = ANY (ARRAY['STR'::text, 'CTR'::text, 'SAR'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_profiles_institution_id_customer_id_key'
  ) THEN
    ALTER TABLE public.risk_profiles ADD CONSTRAINT risk_profiles_institution_id_customer_id_key UNIQUE (institution_id, customer_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_profiles_institution_id_fkey'
  ) THEN
    ALTER TABLE public.risk_profiles ADD CONSTRAINT risk_profiles_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_profiles_pkey'
  ) THEN
    ALTER TABLE public.risk_profiles ADD CONSTRAINT risk_profiles_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_profiles_risk_score_check'
  ) THEN
    ALTER TABLE public.risk_profiles ADD CONSTRAINT risk_profiles_risk_score_check CHECK (risk_score >= 0 AND risk_score <= 100);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_profiles_risk_tier_check'
  ) THEN
    ALTER TABLE public.risk_profiles ADD CONSTRAINT risk_profiles_risk_tier_check CHECK (risk_tier = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'prohibited'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_scores_institution_id_fkey'
  ) THEN
    ALTER TABLE public.risk_scores ADD CONSTRAINT risk_scores_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_scores_pkey'
  ) THEN
    ALTER TABLE public.risk_scores ADD CONSTRAINT risk_scores_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roles_institution_id_profile_id_role_key'
  ) THEN
    ALTER TABLE public.roles ADD CONSTRAINT roles_institution_id_profile_id_role_key UNIQUE (institution_id, profile_id, role);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roles_pkey'
  ) THEN
    ALTER TABLE public.roles ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roles_profile_id_fkey'
  ) THEN
    ALTER TABLE public.roles ADD CONSTRAINT roles_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roles_role_check'
  ) THEN
    ALTER TABLE public.roles ADD CONSTRAINT roles_role_check CHECK (role = ANY (ARRAY['maker'::text, 'checker'::text, 'cco'::text, 'admin'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_config_pkey'
  ) THEN
    ALTER TABLE public.sanctions_config ADD CONSTRAINT sanctions_config_pkey PRIMARY KEY (institution_id, watchlist_name);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_entries_customer_id_fkey'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD CONSTRAINT sanctions_entries_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_entries_pkey'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD CONSTRAINT sanctions_entries_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_entries_watchlist_name_check'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD CONSTRAINT sanctions_entries_watchlist_name_check CHECK (watchlist_name = ANY (ARRAY['UN'::text, 'OFAC'::text, 'EU'::text, 'UK'::text, 'CBN'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_screen_results_customer_id_fkey'
  ) THEN
    ALTER TABLE public.sanctions_screen_results ADD CONSTRAINT sanctions_screen_results_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_screen_results_institution_id_fkey'
  ) THEN
    ALTER TABLE public.sanctions_screen_results ADD CONSTRAINT sanctions_screen_results_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sanctions_screen_results_pkey'
  ) THEN
    ALTER TABLE public.sanctions_screen_results ADD CONSTRAINT sanctions_screen_results_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'screening_results_pkey'
  ) THEN
    ALTER TABLE public.screening_results ADD CONSTRAINT screening_results_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'staging_chunks_pkey'
  ) THEN
    ALTER TABLE public.staging_chunks ADD CONSTRAINT staging_chunks_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'str_candidates_customer_id_fkey'
  ) THEN
    ALTER TABLE public.str_candidates ADD CONSTRAINT str_candidates_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'str_candidates_institution_id_fkey'
  ) THEN
    ALTER TABLE public.str_candidates ADD CONSTRAINT str_candidates_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'str_candidates_pkey'
  ) THEN
    ALTER TABLE public.str_candidates ADD CONSTRAINT str_candidates_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_pkey'
  ) THEN
    ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_events_amount_positive_check'
  ) THEN
    ALTER TABLE public.transaction_events ADD CONSTRAINT transaction_events_amount_positive_check CHECK (amount > 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_events_pkey'
  ) THEN
    ALTER TABLE public.transaction_events ADD CONSTRAINT transaction_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_ingestion_events_institution_id_fkey'
  ) THEN
    ALTER TABLE public.transaction_ingestion_events ADD CONSTRAINT transaction_ingestion_events_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_ingestion_events_institution_id_idempotency_key_key'
  ) THEN
    ALTER TABLE public.transaction_ingestion_events ADD CONSTRAINT transaction_ingestion_events_institution_id_idempotency_key_key UNIQUE (institution_id, idempotency_key);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_ingestion_events_pkey'
  ) THEN
    ALTER TABLE public.transaction_ingestion_events ADD CONSTRAINT transaction_ingestion_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_ingestion_events_status_check'
  ) THEN
    ALTER TABLE public.transaction_ingestion_events ADD CONSTRAINT transaction_ingestion_events_status_check CHECK (status = ANY (ARRAY['accepted'::text, 'duplicate'::text, 'queued'::text, 'failed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_ingestion_events_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.transaction_ingestion_events ADD CONSTRAINT transaction_ingestion_events_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_review_events_pkey'
  ) THEN
    ALTER TABLE public.transaction_review_events ADD CONSTRAINT transaction_review_events_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_review_events_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.transaction_review_events ADD CONSTRAINT transaction_review_events_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES unified_transactions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_reviews_amount_positive_check'
  ) THEN
    ALTER TABLE public.transaction_reviews ADD CONSTRAINT transaction_reviews_amount_positive_check CHECK (amount IS NULL OR amount > 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transaction_reviews_pkey'
  ) THEN
    ALTER TABLE public.transaction_reviews ADD CONSTRAINT transaction_reviews_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_amount_positive_check'
  ) THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_amount_positive_check CHECK (amount > 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_channel_check'
  ) THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_channel_check CHECK (channel = ANY (ARRAY['POS'::text, 'ATM'::text, 'Web'::text, 'Mobile'::text, 'Branch'::text, 'USSD'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_customer_id_fkey'
  ) THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_pkey'
  ) THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_transaction_type_check'
  ) THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_transaction_type_check CHECK (transaction_type = ANY (ARRAY['credit'::text, 'debit'::text, 'transfer'::text, 'reversal'::text, 'cash_deposit'::text, 'cash_withdrawal'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unified_transactions_amount_nonnegative_check'
  ) THEN
    ALTER TABLE public.unified_transactions ADD CONSTRAINT unified_transactions_amount_nonnegative_check CHECK (amount >= 0);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unified_transactions_institution_id_fkey'
  ) THEN
    ALTER TABLE public.unified_transactions ADD CONSTRAINT unified_transactions_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unified_transactions_pkey'
  ) THEN
    ALTER TABLE public.unified_transactions ADD CONSTRAINT unified_transactions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_pkey'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_stats_pkey'
  ) THEN
    ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_stats_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_stats_user_id_key'
  ) THEN
    ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_user_id_key UNIQUE (user_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_institution_id_fkey'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'verification_sessions_pkey'
  ) THEN
    ALTER TABLE public.verification_sessions ADD CONSTRAINT verification_sessions_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'watchlist_entities_pkey'
  ) THEN
    ALTER TABLE public.watchlist_entities ADD CONSTRAINT watchlist_entities_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'watchlist_entities_risk_level_check'
  ) THEN
    ALTER TABLE public.watchlist_entities ADD CONSTRAINT watchlist_entities_risk_level_check CHECK (risk_level = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text, 'none'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_institution'
  ) THEN
    ALTER TABLE public.watchlist_matches ADD CONSTRAINT fk_institution FOREIGN KEY (institution_id) REFERENCES institutions(id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_watchlist_match_txn_entity'
  ) THEN
    ALTER TABLE public.watchlist_matches ADD CONSTRAINT uq_watchlist_match_txn_entity UNIQUE (transaction_id, watchlist_entity_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'watchlist_matches_pkey'
  ) THEN
    ALTER TABLE public.watchlist_matches ADD CONSTRAINT watchlist_matches_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'watchlist_matches_status_check'
  ) THEN
    ALTER TABLE public.watchlist_matches ADD CONSTRAINT watchlist_matches_status_check CHECK (status = ANY (ARRAY['pending_review'::text, 'dismissed'::text, 'confirmed'::text]));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webhook_api_keys_pkey'
  ) THEN
    ALTER TABLE public.webhook_api_keys ADD CONSTRAINT webhook_api_keys_pkey PRIMARY KEY (id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webhook_api_keys_user_id_key'
  ) THEN
    ALTER TABLE public.webhook_api_keys ADD CONSTRAINT webhook_api_keys_user_id_key UNIQUE (user_id);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webhook_events_institution_id_fkey'
  ) THEN
    ALTER TABLE public.webhook_events ADD CONSTRAINT webhook_events_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE;
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webhook_events_pkey'
  ) THEN
    ALTER TABLE public.webhook_events ADD CONSTRAINT webhook_events_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- 5. Indexes (non-PK, non-UNIQUE) for the 89 baseline-owned tables.
CREATE INDEX IF NOT EXISTS idx_accounts_institution ON public.accounts USING btree (institution_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user ON public.agent_conversations USING btree (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_messages_conv ON public.agent_messages USING btree (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_tool_inv_user ON public.agent_tool_invocations USING btree (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aml_alerts_status ON public.aml_alerts USING btree (institution_id, status, severity);
CREATE INDEX IF NOT EXISTS aml_decisions_institution_id_created_at_idx ON public.aml_decisions USING btree (institution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS aml_decisions_transaction_id_idx ON public.aml_decisions USING btree (transaction_id);
CREATE INDEX IF NOT EXISTS idx_aml_jobs_active ON public.aml_jobs USING btree (institution_id, status) WHERE (status = ANY (ARRAY['queued'::aml_job_status, 'processing'::aml_job_status]));
CREATE INDEX IF NOT EXISTS idx_audit_issues_user_status ON public.audit_issues USING btree (user_id, status);
CREATE INDEX IF NOT EXISTS idx_case_events_case ON public.case_events USING btree (case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_case_status_history_case_id ON public.case_status_history USING btree (case_id);
CREATE INDEX IF NOT EXISTS idx_cases_institution_id ON public.cases USING btree (institution_id);
CREATE INDEX IF NOT EXISTS idx_cases_institution_status ON public.cases USING btree (institution_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_user ON public.cases USING btree (user_id, status);
CREATE INDEX IF NOT EXISTS idx_compiled_returns_lookup ON public.compiled_returns USING btree (institution_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_messages_user ON public.compliance_messages USING btree (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_user_month ON public.compliance_reports USING btree (user_id, month DESC);
CREATE INDEX IF NOT EXISTS idx_caccts_acct ON public.customer_accounts USING btree (account_number);
CREATE INDEX IF NOT EXISTS idx_caccts_customer ON public.customer_accounts USING btree (customer_id);
CREATE INDEX IF NOT EXISTS idx_caccts_user ON public.customer_accounts USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_customer_accounts_account_number_hash ON public.customer_accounts USING btree (account_number_hash);
CREATE INDEX IF NOT EXISTS idx_customer_beneficial_owners_cust ON public.customer_beneficial_owners USING btree (customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_beneficial_owners_user ON public.customer_beneficial_owners USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_customers_account_number_hash ON public.customers USING btree (institution_id, account_number_hash);
CREATE INDEX IF NOT EXISTS idx_customers_bvn_hash ON public.customers USING btree (bvn_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_bvn_hash_unique ON public.customers USING btree (bvn_hash) WHERE (bvn_hash IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_customer ON public.fraud_alerts USING btree (institution_id, customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON public.fraud_alerts USING btree (institution_id, status, severity);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_created_at ON public.fraud_signals USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_institution_id ON public.fraud_signals USING btree (institution_id);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_status_created ON public.fraud_signals USING btree (institution_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_transaction_id ON public.fraud_signals USING btree (transaction_id);
CREATE INDEX IF NOT EXISTS idx_goaml_exports_institution_period ON public.goaml_exports USING btree (institution_id, report_type, period_start, period_end, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_identity_review_events_institution_screening ON public.identity_review_events USING btree (institution_id, screening_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_screening_provider_ref ON public.identity_screening USING btree (provider, provider_reference);
CREATE INDEX IF NOT EXISTS idx_screening_ref ON public.identity_screening USING btree (provider_reference);
CREATE UNIQUE INDEX IF NOT EXISTS uq_identity_active_screening ON public.identity_screening USING btree (institution_id, subject_hash, screening_type) WHERE (result_status = ANY (ARRAY['pending'::text, 'potential_match'::text, 'requires_review'::text]));
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_hash ON public.knowledge_base USING btree (content_hash);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_document_type ON public.knowledge_base USING btree (document_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_jurisdiction ON public.knowledge_base USING btree (jurisdiction);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_regulator ON public.knowledge_base USING btree (regulator);
CREATE INDEX IF NOT EXISTS idx_attempts_screening ON public.kyc_attempts USING btree (screening_id);
CREATE INDEX IF NOT EXISTS idx_mt_customer_time ON public.monitored_transactions USING btree (institution_id, customer_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_mt_device ON public.monitored_transactions USING btree (institution_id, device_id);
CREATE INDEX IF NOT EXISTS idx_monthly_tasks_user_month ON public.monthly_compliance_tasks USING btree (user_id, month);
CREATE INDEX IF NOT EXISTS idx_nfiu_reports_case ON public.nfiu_reports USING btree (case_id);
CREATE INDEX IF NOT EXISTS idx_nfiu_reports_status ON public.nfiu_reports USING btree (status);
CREATE INDEX IF NOT EXISTS idx_nfiu_reports_user ON public.nfiu_reports USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_submissions_caseid ON public.pending_submissions USING btree ("caseId");
CREATE INDEX IF NOT EXISTS idx_profiles_reporting_api_key ON public.profiles USING btree (reporting_api_key);
CREATE UNIQUE INDEX IF NOT EXISTS uq_queue_jobs_transaction_ingestion_idempotency ON public.queue_jobs USING btree (institution_id, job_type, args_hash) WHERE (args_hash IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_reg_filings_inst_type_status ON public.regulatory_filings USING btree (institution_id, filing_type, status, due_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.regulatory_news USING btree (category);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.regulatory_news USING btree (published_at DESC);
CREATE INDEX IF NOT EXISTS report_requests_user_status_idx ON public.report_requests USING btree (user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS report_templates_one_active_per_code ON public.report_templates USING btree (code) WHERE (status = 'active'::text);
CREATE INDEX IF NOT EXISTS idx_reports_regulator ON public.reports USING btree (regulator);
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON public.reports USING btree (report_type);
CREATE INDEX IF NOT EXISTS idx_reports_user_id_status ON public.reports USING btree (user_id, status);
CREATE INDEX IF NOT EXISTS reports_user_return_period_idx ON public.reports USING btree (user_id, return_type, period_start);
CREATE INDEX IF NOT EXISTS idx_risk_customer ON public.risk_profiles USING btree (institution_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_risk_tier ON public.risk_profiles USING btree (institution_id, risk_tier);
CREATE INDEX IF NOT EXISTS roles_institution_id_idx ON public.roles USING btree (institution_id);
CREATE INDEX IF NOT EXISTS roles_profile_id_idx ON public.roles USING btree (profile_id);
CREATE INDEX IF NOT EXISTS roles_role_idx ON public.roles USING btree (role);
CREATE INDEX IF NOT EXISTS idx_screening_results_institution_id ON public.screening_results USING btree (institution_id);
CREATE INDEX IF NOT EXISTS idx_screening_user ON public.screening_results USING btree (user_id, search_date DESC);
CREATE INDEX IF NOT EXISTS idx_txn_alerts_txn ON public.transaction_alerts USING btree (transaction_id);
CREATE INDEX IF NOT EXISTS idx_txn_alerts_user ON public.transaction_alerts USING btree (user_id, status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_txn_alert_txn_rule ON public.transaction_alerts USING btree (transaction_id, rule_code);
CREATE INDEX IF NOT EXISTS idx_transaction_ingestion_events_institution_created ON public.transaction_ingestion_events USING btree (institution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_review_events_transaction_id ON public.transaction_review_events USING btree (transaction_id);
CREATE INDEX IF NOT EXISTS idx_trev_user ON public.transaction_reviews USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_inst_created ON public.transactions USING btree (institution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_rule8_window ON public.transactions USING btree (institution_id, customer_id, created_at) WHERE (customer_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_unified_transactions_institution_id ON public.unified_transactions USING btree (institution_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unified_transactions_ref ON public.unified_transactions USING btree (transaction_ref) WHERE (transaction_ref IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_utx_customer ON public.unified_transactions USING btree (customer_id);
CREATE INDEX IF NOT EXISTS idx_utx_date ON public.unified_transactions USING btree (transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_utx_flagged ON public.unified_transactions USING btree (user_id, is_flagged) WHERE (is_flagged = true);
CREATE INDEX IF NOT EXISTS idx_utx_review_status ON public.unified_transactions USING btree (user_id, review_status);
CREATE INDEX IF NOT EXISTS idx_utx_user ON public.unified_transactions USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_search ON public.watchlist_entities USING gin (search_vector);
CREATE INDEX IF NOT EXISTS idx_watchlist_matches_institution ON public.watchlist_matches USING btree (institution_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_matches_transaction ON public.watchlist_matches USING btree (transaction_id);
CREATE INDEX IF NOT EXISTS idx_webhook_keys_hash ON public.webhook_api_keys USING btree (key_hash);
