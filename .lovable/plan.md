# Show specific missing fields when CTR readiness fails

## Today's behavior

`check_return_readiness` in `supabase/functions/agent-orchestrator/index.ts` only checks "any transactions exist?" and returns `missing: ["No transactions for period"]`. Useless for an officer trying to file.

## Fix (edge function only)

Add a per-return-type readiness checker. For now, implement `NFIU_CTR` properly; keep the generic fallback for others.

### NFIU_CTR rules

CTR aggregates cash movements at/above the NGN 5,000,000 individual / 10,000,000 corporate threshold for a given day. For the resolved `period` (default = today, otherwise parse `YYYY-MM-DD` / `YYYY-MM` / "today" / "yesterday"):

1. Pull cash `unified_transactions` for the period — `channel ilike 'cash%'` OR `transaction_type ilike '%cash%'`, scoped by `user_id`.
2. If zero rows → `missing: ["No cash transactions found for <period>"]`.
3. Otherwise, for each reportable row (amount ≥ threshold), check required CTR fields and tally per-field gap counts:
   - `customer_id` / `customer_name`
   - `account_number`
   - `transaction_date`
   - `amount`, `currency`
   - `transaction_type` (deposit/withdrawal)
   - `branch_code`
   - `counterparty` (for 3rd-party lodgements)
   - `narration` or `description`
4. Also check the customer's KYC completeness via `customer_kyc` for each unique `customer_id` in the batch — flag rows whose customer is missing `bvn`, `id_number`, or `date_of_birth` (read the actual KYC columns; if a column doesn't exist, skip it gracefully).
5. Return:
   ```ts
   {
     ready: missing.length === 0,
     return_type: "NFIU_CTR",
     period,
     reportable_count,
     total_count,
     missing,              // human-readable strings, e.g. "3 transactions missing branch_code"
     missing_fields,       // structured: [{ field, count, sample_tx_ids: [...] }]
     schedule,
   }
   ```

### Other return types

Leave the existing generic check ("No transactions for period") as the fallback so STR/MPR/etc. still respond. A follow-up can add their specific rules.

### Frontend rendering

`AgentRail.tsx` already renders tool output JSON inside the `ToolChip`. The new `missing` array will show up automatically. No UI changes required for this turn. If you later want a styled "missing fields" card, that's a separate task — flag it as out of scope here.

## Files touched

- `supabase/functions/agent-orchestrator/index.ts` — new `checkCtrReadiness(admin, userClient, userId, period)` helper; `check_return_readiness` dispatches by `schedule.return_type`.

## Out of scope

- No DB changes; using existing `unified_transactions` + `customer_kyc` columns.
- No new UI component; relies on existing tool-output rendering.
- Per-return rules for STR/MPR/FX/etc. — follow-up.
- Threshold is hardcoded to NGN 5,000,000 individual / 10,000,000 corporate; making it configurable per institution is a follow-up.

## Verification

After deploy: in agent rail, type "Check CTR readiness for today". Expect either `ready: true` or a `missing` list like `["12 transactions missing branch_code", "3 customers missing BVN"]` plus `missing_fields` with sample tx IDs.
