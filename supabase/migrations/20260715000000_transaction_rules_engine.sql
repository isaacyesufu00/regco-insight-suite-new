-- ============================================================================
-- Transaction Rules Engine (CBN Pillar 3 — Transaction Monitoring & Detection)
--
-- Replaces the previously hard-coded, client-side flagging thresholds with a
-- server-side, DB-driven rules engine that runs on every transaction insert.
--   * transaction_rules  : configurable catalogue of monitoring rules
--   * transaction_alerts : one row per rule hit, linked to a case when critical
--   * fn_evaluate_transaction() : evaluates one transaction against active rules
--   * trigger on unified_transactions : runs the engine on insert
--   * fn_rescan_transactions() : re-run the engine over historical transactions
-- ============================================================================

-- ============ transaction_rules (shared catalogue) ============
CREATE TABLE IF NOT EXISTS public.transaction_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_code text NOT NULL UNIQUE,
  category text NOT NULL,
  regulator text,
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  threshold jsonb NOT NULL DEFAULT '{}'::jsonb,
  citation text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT transaction_rules_category_chk CHECK (category IN ('AML','FRAUD','CTR')),
  CONSTRAINT transaction_rules_severity_chk CHECK (severity IN ('low','medium','high','critical'))
);
GRANT SELECT ON public.transaction_rules TO authenticated;
GRANT ALL ON public.transaction_rules TO service_role;
ALTER TABLE public.transaction_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read transaction rules" ON public.transaction_rules
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage transaction rules" ON public.transaction_rules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_transaction_rules_updated BEFORE UPDATE ON public.transaction_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ transaction_alerts (per-tenant) ============
CREATE TABLE IF NOT EXISTS public.transaction_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  transaction_id uuid REFERENCES public.unified_transactions(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  rule_code text NOT NULL,
  rule_title text NOT NULL,
  category text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  score integer NOT NULL DEFAULT 0,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT transaction_alerts_status_chk CHECK (status IN ('open','reviewing','escalated','dismissed','closed')),
  CONSTRAINT transaction_alerts_severity_chk CHECK (severity IN ('low','medium','high','critical'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_txn_alert_txn_rule
  ON public.transaction_alerts(transaction_id, rule_code);
CREATE INDEX IF NOT EXISTS idx_txn_alerts_user ON public.transaction_alerts(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_alerts_txn ON public.transaction_alerts(transaction_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transaction_alerts TO authenticated;
GRANT ALL ON public.transaction_alerts TO service_role;
ALTER TABLE public.transaction_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON public.transaction_alerts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all alerts" ON public.transaction_alerts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_txn_alerts_updated BEFORE UPDATE ON public.transaction_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Seed default rule catalogue ============
INSERT INTO public.transaction_rules (rule_code, category, regulator, title, description, severity, threshold, citation) VALUES
  ('CTR_INDIVIDUAL_5M','CTR','CBN','Individual cash transaction threshold',
   'Individual cash lodgment/withdrawal at or above ₦5,000,000 must be reported as a Currency Transaction Report.',
   'high', '{"amount_ngn":5000000}', 'CBN AML/CFT Regulations 2022, s.12'),
  ('CTR_CORPORATE_10M','CTR','CBN','Corporate cash transaction threshold',
   'Corporate cash lodgment/withdrawal at or above ₦10,000,000 must be reported as a Currency Transaction Report.',
   'high', '{"amount_ngn":10000000}', 'CBN AML/CFT Regulations 2022, s.12'),
  ('STRUCTURING_24H','AML','CBN','Structuring / smurfing',
   'Three or more sub-threshold transactions in a 24h window that aggregate at or above the reporting threshold.',
   'critical', '{"window_hours":24,"floor_ngn":4000000,"ceiling_ngn":5000000,"min_count":3,"aggregate_ngn":10000000}',
   'CBN AML/CFT Regulations 2022, s.18'),
  ('VELOCITY_24H','FRAUD','CBN','Transaction velocity',
   'Aggregate transaction value for a customer in a rolling 24h window at or above the velocity ceiling.',
   'high', '{"window_hours":24,"amount_ngn":20000000}', 'CBN AML/CFT Regulations 2022, s.18'),
  ('ROUND_FIGURE','AML','CBN','Round-figure transaction',
   'Large round-figure transaction (multiple of ₦500,000) at or above ₦1,000,000 — a common laundering signal.',
   'medium', '{"min_ngn":1000000,"modulo_ngn":500000}', 'NFIU AML Typologies'),
  ('LARGE_CASH','AML','CBN','Large cash movement',
   'Single cash-channel transaction at or above ₦1,000,000.',
   'medium', '{"amount_ngn":1000000}', 'CBN AML/CFT Regulations 2022, s.12'),
  ('DORMANT_REACTIVATION','FRAUD','CBN','Dormant account reactivation',
   'Significant transaction after a prolonged dormancy period — potential account takeover or mule activity.',
   'medium', '{"min_ngn":500000,"dormant_days":90}', 'NFIU AML Typologies')
ON CONFLICT (rule_code) DO NOTHING;

-- ============ Engine: evaluate a single transaction ============
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
BEGIN
  SELECT * INTO tx FROM public.unified_transactions WHERE id = p_txn_id;
  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Idempotent re-evaluation: clear any prior alerts for this transaction.
  DELETE FROM public.transaction_alerts WHERE transaction_id = p_txn_id;

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

  -- Auto-open a case for critical hits and link the critical alerts to it.
  IF max_rank >= 4 THEN
    INSERT INTO public.cases (user_id, customer_id, trigger_kind, trigger_id, title, summary, status, severity)
    VALUES (tx.user_id, tx.customer_id, 'transaction_alert', tx.id::text,
            'Critical AML alert: ' || top_reason,
            'Auto-created from transaction rules engine for transaction ' || tx.id::text,
            'open', 'critical')
    RETURNING id INTO new_case_id;

    UPDATE public.transaction_alerts
    SET case_id = new_case_id
    WHERE transaction_id = tx.id AND severity = 'critical';

    INSERT INTO public.case_events (case_id, user_id, actor_kind, event_type, payload)
    VALUES (new_case_id, tx.user_id, 'system', 'case_opened',
            jsonb_build_object('source', 'transaction_rules_engine', 'transaction_id', tx.id, 'rule_code', top_rule));
  END IF;

  RETURN hits;
END;
$$;

-- ============ Trigger: evaluate on transaction insert ============
CREATE OR REPLACE FUNCTION public.fn_trg_evaluate_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.fn_evaluate_transaction(NEW.id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_evaluate_transaction ON public.unified_transactions;
CREATE TRIGGER trg_evaluate_transaction
  AFTER INSERT ON public.unified_transactions
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_evaluate_transaction();

-- ============ Re-scan historical transactions (rule changes / backfill) ============
CREATE OR REPLACE FUNCTION public.fn_rescan_transactions(p_user_id uuid, p_limit integer DEFAULT 1000)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  rec record;
  total integer := 0;
BEGIN
  IF auth.uid() <> p_user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'not authorised to rescan transactions for this user';
  END IF;

  FOR rec IN
    SELECT id FROM public.unified_transactions
    WHERE user_id = p_user_id
    ORDER BY transaction_date DESC
    LIMIT greatest(p_limit, 0)
  LOOP
    PERFORM public.fn_evaluate_transaction(rec.id);
    total := total + 1;
  END LOOP;

  RETURN total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.fn_rescan_transactions(uuid, integer) TO authenticated;
