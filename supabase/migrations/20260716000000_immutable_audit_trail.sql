-- ============================================================================
-- Immutable Audit Trail (CBN Pillar 6 — Security, Audit & Tamper Proofing)
--
-- Implements a cryptographically chained audit log for sensitive tables.
-- Every insert, update, or delete in these tables generates a log entry
-- whose signature (curr_hash) is sha256(prev_hash || payload).
-- ============================================================================

-- Ensure pgcrypto is enabled for cryptographic hashing (sha256 / digest)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============ audit_logs Table ============
DROP TABLE IF EXISTS public.audit_logs CASCADE;
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid, -- Reference to the tenant/user triggering the action
  action text NOT NULL, -- INSERT, UPDATE, DELETE
  entity text NOT NULL, -- Table name (e.g. 'customers', 'unified_transactions')
  entity_id uuid, -- Primary key value of the targeted row
  payload jsonb NOT NULL, -- Contains 'new' and/or 'old' row values
  prev_hash text NOT NULL,
  curr_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexing for tenant queries and traversal performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_chain ON public.audit_logs(created_at ASC, id ASC);

-- Revoke UPDATE and DELETE to enforce immutability
REVOKE UPDATE, DELETE ON public.audit_logs FROM public, authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see audit logs of their own tenant, admins can see all
CREATE POLICY "Users view own audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- ============ Prevent Direct Audit Log Modifications ============
CREATE OR REPLACE FUNCTION public.fn_prevent_audit_log_modification()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be updated or deleted.';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_modification ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_log_modification
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.fn_prevent_audit_log_modification();

-- ============ Append Audit Log (Cryptographic Chaining) ============
CREATE OR REPLACE FUNCTION public.fn_append_audit_log(
  p_user_id uuid,
  p_action text,
  p_entity text,
  p_entity_id uuid,
  p_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_prev_hash text;
  v_curr_hash text;
  v_log_id uuid;
BEGIN
  -- Retrieve the last log entry's curr_hash to build the chain
  SELECT curr_hash INTO v_prev_hash
  FROM public.audit_logs
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  -- If it's the genesis entry, use a standard 64-zero hash seed
  IF v_prev_hash IS NULL THEN
    v_prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
  END IF;

  -- Compute the current signature: sha256(prev_hash || payload)
  v_curr_hash := encode(digest(v_prev_hash || p_payload::text, 'sha256'), 'hex');

  -- Write the new block to the ledger
  INSERT INTO public.audit_logs (user_id, action, entity, entity_id, payload, prev_hash, curr_hash)
  VALUES (p_user_id, p_action, p_entity, p_entity_id, p_payload, v_prev_hash, v_curr_hash)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- ============ Generic Trigger Handler ============
CREATE OR REPLACE FUNCTION public.fn_audit_trigger_handler()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid;
  v_payload jsonb;
  v_entity_id uuid;
  v_row_json jsonb;
BEGIN
  -- Determine context user_id. Default to active auth session.
  v_user_id := auth.uid();
  
  -- Extract record json based on trigger operation
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    v_row_json := to_jsonb(NEW);
  ELSE
    v_row_json := to_jsonb(OLD);
  END IF;

  -- Fallback: If auth session is empty, extract user_id from the record itself if present
  IF v_user_id IS NULL AND v_row_json ? 'user_id' THEN
    v_user_id := (v_row_json ->> 'user_id')::uuid;
  END IF;
  
  -- Extract primary key uuid if 'id' exists
  IF v_row_json ? 'id' THEN
    v_entity_id := (v_row_json ->> 'id')::uuid;
  END IF;

  -- Build audit payload containing target state
  IF TG_OP = 'INSERT' THEN
    v_payload := jsonb_build_object('new', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    v_payload := jsonb_build_object('new', to_jsonb(NEW), 'old', to_jsonb(OLD));
  ELSIF TG_OP = 'DELETE' THEN
    v_payload := jsonb_build_object('old', to_jsonb(OLD));
  END IF;

  -- Append to immutable log
  PERFORM public.fn_append_audit_log(
    v_user_id,
    TG_OP,
    TG_TABLE_NAME::text,
    v_entity_id,
    v_payload
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- ============ Register Triggers on Core Tables ============

-- 1. customers
DROP TRIGGER IF EXISTS trg_audit_customers ON public.customers;
CREATE TRIGGER trg_audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();

-- 2. customer_kyc
DROP TRIGGER IF EXISTS trg_audit_customer_kyc ON public.customer_kyc;
CREATE TRIGGER trg_audit_customer_kyc
  AFTER INSERT OR UPDATE OR DELETE ON public.customer_kyc
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();

-- 3. unified_transactions
DROP TRIGGER IF EXISTS trg_audit_unified_transactions ON public.unified_transactions;
CREATE TRIGGER trg_audit_unified_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.unified_transactions
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();

-- 4. cases
DROP TRIGGER IF EXISTS trg_audit_cases ON public.cases;
CREATE TRIGGER trg_audit_cases
  AFTER INSERT OR UPDATE OR DELETE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();

-- 5. transaction_alerts
DROP TRIGGER IF EXISTS trg_audit_transaction_alerts ON public.transaction_alerts;
CREATE TRIGGER trg_audit_transaction_alerts
  AFTER INSERT OR UPDATE OR DELETE ON public.transaction_alerts
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();

-- 6. transaction_rules
DROP TRIGGER IF EXISTS trg_audit_transaction_rules ON public.transaction_rules;
CREATE TRIGGER trg_audit_transaction_rules
  AFTER INSERT OR UPDATE OR DELETE ON public.transaction_rules
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_trigger_handler();


-- ============ Verification Engine ============
-- Re-verifies the entire audit chain, detecting any external modification or mismatch
CREATE OR REPLACE FUNCTION public.fn_verify_audit_chain()
RETURNS TABLE (
  is_valid boolean,
  total_checked integer,
  failed_log_id uuid,
  expected_hash text,
  actual_hash text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  rec record;
  v_expected_prev text := '0000000000000000000000000000000000000000000000000000000000000000';
  v_calculated_curr text;
  v_count integer := 0;
BEGIN
  FOR rec IN
    SELECT id, payload, prev_hash, curr_hash
    FROM public.audit_logs
    ORDER BY created_at ASC, id ASC
  LOOP
    v_count := v_count + 1;

    -- 1. Check if prev_hash matches the preceding block signature
    IF rec.prev_hash <> v_expected_prev THEN
      RETURN QUERY SELECT false, v_count, rec.id, v_expected_prev, rec.prev_hash;
      RETURN;
    END IF;

    -- 2. Recalculate block signature: sha256(prev_hash || payload)
    v_calculated_curr := encode(digest(v_expected_prev || rec.payload::text, 'sha256'), 'hex');

    -- 3. Verify matching signature
    IF rec.curr_hash <> v_calculated_curr THEN
      RETURN QUERY SELECT false, v_count, rec.id, v_calculated_curr, rec.curr_hash;
      RETURN;
    END IF;

    -- Roll the cursor forward
    v_expected_prev := rec.curr_hash;
  END LOOP;

  -- Success state: chain is fully intact
  RETURN QUERY SELECT true, v_count, NULL::uuid, NULL::text, NULL::text;
END;
$$;

GRANT EXECUTE ON FUNCTION public.fn_verify_audit_chain() TO authenticated;
