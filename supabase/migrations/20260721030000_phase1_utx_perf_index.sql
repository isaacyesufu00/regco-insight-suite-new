-- ============================================================================
-- Phase 1 — Transaction-monitoring query performance.
--
-- fn_evaluate_transaction runs, per STRUCTURING_24H / VELOCITY_24H /
-- DORMANT_REACTIVATION hit, a windowed aggregate over unified_transactions:
--     WHERE user_id = :uid
--       AND coalesce(customer_id, id) = :cid
--       AND transaction_date BETWEEN :window_start AND :txn_date
--
-- The previous indexes (idx_utx_customer on bare customer_id, idx_utx_date
-- on transaction_date, idx_utx_user on user_id) could not serve the
-- coalesce(customer_id, id) predicate, so Postgres fell back to a wider
-- scan on every evaluation — O(n) per transaction, repeated on every
-- insert and on every rescan. fn_rescan_transactions re-evaluates the
-- whole tenant history, so this is the dominant cost of a rescan.
--
-- Add a functional composite index that matches the predicate exactly:
-- equal on coalesce(customer_id, id), range on transaction_date DESC.
-- Idempotent.
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_utx_cust_win
  ON public.unified_transactions ((coalesce(customer_id, id)), transaction_date DESC);
