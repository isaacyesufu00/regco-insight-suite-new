-- ============================================================================
-- Phase 1 — Rescan correctness: preserve review dispositions and
-- never create duplicate cases.
--
-- Two defects in fn_evaluate_transaction when re-run by fn_rescan_transactions:
--   1. It did `DELETE FROM transaction_alerts WHERE transaction_id = ...`
--      unconditionally, wiping any human review state (open/reviewing/
--      escalated/dismissed/closed) so a rescan silently lost analyst work.
--   2. On a critical hit it always INSERTed a brand-new cases row, so
--      re-running rescan spawned a fresh case every time and orphaned the
--      prior case→alert links.
--
-- Fix:
--   * Only drop alerts that are still 'open' (un-reviewed); reviewed
--     alerts are left intact and the ON CONFLICT DO NOTHING keeps them.
--   * Reuse an already-open case for the same customer instead of
--     creating a new one, and only link alerts that are not yet linked.
-- Idempotent (CREATE OR REPLACE).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_evaluate_transaction(p_txn_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  tx           public.unified_transactions%ROWTYPE;
  seg          text;
  is_corporate boolean;
  r            record;
  th           jsonb;
  window_start timestamptz;
  agg_count    integer;
  agg_sum      numeric;
  last_txn_at  timestamptz;
  hit          boolean;
  hit_score    integer;
  hit_evidence jsonb;
  hits         integer := 0;
  max_sev      text := 'low';
  top_reason   text := NULL;
  top_rule     text := NULL;
  sev_rank     integer;
  max_rank     integer := 0;
  new_case_id  uuid;
  existing_case_id uuid;
BEGIN
  SELECT * INTO tx FROM public.unified_transactions WHERE id = p_txn_id;
  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Idempotent re-evaluation: drop ONLY un-reviewed alerts for this
  -- transaction. Alerts that an analyst has already dispositioned
  -- (reviewing/escalated/dismissed/closed) are preserved so rescan
  -- never destroys prior review work.
  DELETE FROM public.transaction_alerts
  WHERE transaction_id = p_txn_id AND status = 'open';

  seg := lower(coalesce((SELECT customer_segment FROM public.customers WHERE id = tx.customer_id), ''));
  is_corporate := seg IN ('corporate','business','sme','commercial');

  FOR r IN
    SELECT rule_code, category, title, severity, threshold
    FROM public.transaction_rules WHERE enabled = true
  LOOP
    th := r.threshold;
    hit := false;
    hit_score := 0;
    hit_evidence := '{}'::jsonb;

    IF r.rule_code = 'CTR_INDIVIDUAL_5M' THEN
      IF NOT is_corporate AND tx.amount >= (th->>'amount_ngn')::numeric THEN
        hit := true; hit_score := 80;
        hit_evidence := jsonb_build_object('amount', tx.amount, 'threshold', (th->>'amount_ngn')::numeric);
      END IF;

    ELSIF r.rule_code = 'CTR_CORPORATE_10M' THEN
      IF is_corporate AND tx.amount >= (th->>'amount_ngn')::numeric THEN
        hit := true; hit_score := 80;
        hit_evidence := jsonb_build_object('amount', tx.amount, 'threshold', (th->>'amount_ngn')::numeric, 'segment', seg);
      END IF;

    ELSIF r.rule_code = 'STRUCTURING_24H' THEN
      window_start := tx.transaction_date - make_interval(hours => (th->>'window_hours')::int);
      SELECT count(*), coalesce(sum(amount), 0) INTO agg_count, agg_sum
      FROM public.unified_transactions
      WHERE user_id = tx.user_id
        AND coalesce(customer_id, id) = coalesce(tx.customer_id, tx.id)
        AND transaction_date >= window_start
        AND transaction_date <= tx.transaction_date
        AND amount >= (th->>'floor_ngn')::numeric
        AND amount < (th->>'ceiling_ngn')::numeric;
      IF agg_count >= (th->>'min_count')::int AND agg_sum >= (th->>'aggregate_ngn')::numeric THEN
        hit := true; hit_score := 93;
        hit_evidence := jsonb_build_object('count', agg_count, 'aggregate', agg_sum, 'window_hours', (th->>'window_hours')::int);
      END IF;

    ELSIF r.rule_code = 'VELOCITY_24H' THEN
      window_start := tx.transaction_date - make_interval(hours => (th->>'window_hours')::int);
      SELECT coalesce(sum(amount), 0) INTO agg_sum
      FROM public.unified_transactions
      WHERE user_id = tx.user_id
        AND coalesce(customer_id, id) = coalesce(tx.customer_id, tx.id)
        AND transaction_date >= window_start
        AND transaction_date <= tx.transaction_date;
      IF agg_sum >= (th->>'amount_ngn')::numeric THEN
        hit := true; hit_score := 75;
        hit_evidence := jsonb_build_object('window_total', agg_sum, 'threshold', (th->>'amount_ngn')::numeric);
      END IF;

    ELSIF r.rule_code = 'ROUND_FIGURE' THEN
      IF tx.amount >= (th->>'min_ngn')::numeric
         AND (tx.amount % (th->>'modulo_ngn')::numeric) = 0 THEN
        hit := true; hit_score := 55;
        hit_evidence := jsonb_build_object('amount', tx.amount, 'modulo', (th->>'modulo_ngn')::numeric);
      END IF;

    ELSIF r.rule_code = 'LARGE_CASH' THEN
      IF lower(coalesce(tx.channel, '')) IN ('cash','deposit','withdrawal')
         AND tx.amount >= (th->>'amount_ngn')::numeric THEN
        hit := true; hit_score := 60;
        hit_evidence := jsonb_build_object('amount', tx.amount, 'channel', tx.channel);
      END IF;

    ELSIF r.rule_code = 'DORMANT_REACTIVATION' THEN
      IF tx.amount >= (th->>'min_ngn')::numeric THEN
        SELECT max(transaction_date) INTO last_txn_at
        FROM public.unified_transactions
        WHERE user_id = tx.user_id
          AND coalesce(customer_id, id) = coalesce(tx.customer_id, tx.id)
          AND id <> tx.id
          AND transaction_date < tx.transaction_date;
        IF last_txn_at IS NOT NULL
           AND tx.transaction_date - last_txn_at >= make_interval(days => (th->>'dormant_days')::int) THEN
          hit := true; hit_score := 65;
          hit_evidence := jsonb_build_object(
            'dormant_days', floor(extract(epoch FROM (tx.transaction_date - last_txn_at)) / 86400),
            'amount', tx.amount);
        END IF;
      END IF;
    END IF;

    IF hit THEN
      hits := hits + 1;
      INSERT INTO public.transaction_alerts
        (user_id, transaction_id, customer_id, rule_code, rule_title, category, severity, score, evidence)
      VALUES
        (tx.user_id, tx.id, tx.customer_id, r.rule_code, r.title, r.category, r.severity, hit_score, hit_evidence)
      ON CONFLICT (transaction_id, rule_code) DO NOTHING;

      sev_rank := CASE r.severity WHEN 'critical' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END;
      IF sev_rank > max_rank THEN
        max_rank := sev_rank;
        max_sev := r.severity;
        top_reason := r.title;
        top_rule := r.rule_code;
      END IF;
    END IF;
  END LOOP;

  -- Reflect the outcome on the transaction row so existing views stay in sync.
  UPDATE public.unified_transactions
  SET is_flagged = (hits > 0),
      flag_severity = CASE WHEN hits > 0 THEN max_sev ELSE NULL END,
      flag_reason = top_reason,
      flag_rule = top_rule
  WHERE id = tx.id;

  -- Auto-open a case for critical hits, but REUSE an existing open case
  -- for the same customer instead of spawning duplicates on every rescan.
  IF max_rank >= 4 THEN
    SELECT id INTO existing_case_id
    FROM public.cases
    WHERE user_id = tx.user_id
      AND customer_id IS NOT DISTINCT FROM tx.customer_id
      AND status = 'open'
      AND trigger_kind = 'transaction_alert'
    LIMIT 1;

    IF existing_case_id IS NULL THEN
      INSERT INTO public.cases (user_id, customer_id, trigger_kind, trigger_id, title, summary, status, severity)
      VALUES (tx.user_id, tx.customer_id, 'transaction_alert', tx.id::text,
              'Critical AML alert: ' || top_reason,
              'Auto-created from transaction rules engine for transaction ' || tx.id::text,
              'open', 'critical')
      RETURNING id INTO new_case_id;

      INSERT INTO public.case_events (case_id, user_id, actor_kind, event_type, payload)
      VALUES (new_case_id, tx.user_id, 'system', 'case_opened',
              jsonb_build_object('source', 'transaction_rules_engine', 'transaction_id', tx.id, 'rule_code', top_rule));
    ELSE
      new_case_id := existing_case_id;
    END IF;

    -- Link only the critical alerts that are not already linked.
    UPDATE public.transaction_alerts
    SET case_id = new_case_id
    WHERE transaction_id = tx.id AND severity = 'critical' AND case_id IS NULL;
  END IF;

  RETURN hits;
END;
$$;
