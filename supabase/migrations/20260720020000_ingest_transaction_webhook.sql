-- ============================================================================
-- ingest_transaction_webhook — single ingestion entry point for BOTH the
-- pull (cbs-pull-connector) and push (receive-transaction) CBS integration paths.
--
-- Idempotent on (institution_id, idempotency_key) so a redelivered webhook or a
-- re-run pull produces exactly one unified_transactions row.
--
-- Callers (receive-transaction, cbs-pull-connector) read the returned `data`
-- value as the new transaction id. On an idempotency hit we return the id of
-- the transaction that was already created, never inserting a duplicate.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ingest_transaction_webhook(
  p_institution_id uuid,
  p_idempotency_key text,
  p_request_signature text,
  p_raw_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id       uuid;
  v_existing      uuid;
  v_txn_id        uuid;
  v_customer_id   uuid;
BEGIN
  -- Resolve the owning user for the institution. Tenant scoping throughout the
  -- app is keyed on user_id; unified_transactions requires it and so do the
  -- rules-engine triggers that fire on insert.
  SELECT user_id INTO v_user_id
  FROM public.institution_users
  WHERE institution_id = p_institution_id
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'no_owner_for_institution'
      USING HINT = 'institution has no linked user in institution_users';
  END IF;

  -- Idempotency: return the previously created transaction if this key was
  -- already ingested for this institution.
  SELECT transaction_id INTO v_existing
  FROM public.receive_transaction_requests
  WHERE institution_id = p_institution_id
    AND idempotency_key = p_idempotency_key
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Optional customer linkage when the payload carries an external customer id.
  IF p_raw_payload ? 'customer_id' AND (p_raw_payload->>'customer_id') IS NOT NULL THEN
    SELECT id INTO v_customer_id
    FROM public.customers
    WHERE institution_id = p_institution_id
      AND id::text = (p_raw_payload->>'customer_id');
  END IF;

  INSERT INTO public.unified_transactions (
    user_id,
    institution_id,
    customer_id,
    account_number,
    customer_name,
    amount,
    transaction_type,
    transaction_date,
    narration,
    channel,
    branch_code,
    currency
  )
  VALUES (
    v_user_id,
    p_institution_id,
    v_customer_id,
    p_raw_payload->>'account_number',
    p_raw_payload->>'customer_name',
    COALESCE((p_raw_payload->>'amount')::bigint, 0),
    p_raw_payload->>'transaction_type',
    COALESCE(
      (p_raw_payload->>'transaction_date')::timestamptz,
      now()
    ),
    p_raw_payload->>'narration',
    p_raw_payload->>'channel',
    p_raw_payload->>'branch_code',
    COALESCE(p_raw_payload->>'currency', 'NGN')
  )
  RETURNING id INTO v_txn_id;

  -- Record the receipt for idempotency enforcement on future deliveries.
  INSERT INTO public.receive_transaction_requests (
    institution_id,
    idempotency_key,
    request_signature,
    raw_payload,
    transaction_id
  )
  VALUES (
    p_institution_id,
    p_idempotency_key,
    p_request_signature,
    p_raw_payload,
    v_txn_id
  );

  RETURN v_txn_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ingest_transaction_webhook(
  uuid, text, text, jsonb
) TO authenticated, service_role;
