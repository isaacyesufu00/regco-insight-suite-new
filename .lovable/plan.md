# Fix: agent can't resolve "CTR" / friendly return names

## Root cause

`filing_schedules` uses codes like `NFIU_CTR`, `NFIU_STR`, `CBN_MPR`, etc. The two tools that read it do strict equality:

```ts
.eq("return_type", args.return_type)
```

When you type "CTR" the model passes `return_type: "CTR"` → no match → tool returns `{ found: false }` → agent gives up. Same for "STR", "MPR", "Currency Transaction Report", etc. That's the whole reason the flow you described breaks at step 1.

## Fix (edge function only)

Edit `supabase/functions/agent-orchestrator/index.ts`:

1. **Fuzzy resolver.** Add a small helper `resolveSchedule(input)` that:
   - Tries exact match on `return_type`.
   - Falls back to `ilike` on `return_type` and `title` (e.g. "CTR" matches `NFIU_CTR` / "Currency Transaction Report"; "STR" matches `NFIU_STR`; "MPR" matches `CBN_MPR`; "Currency Transaction Report" matches the title directly).
   - If multiple match, returns the list so the agent can ask the user to disambiguate.
2. **Use it in both tools** that hit `filing_schedules`:
   - `get_filing_deadline` — returns `{ found, schedule }` or `{ found: false, candidates: [...] }`.
   - `check_return_readiness` — same resolver; the rest of the readiness logic is unchanged.
3. **Teach the model the catalog.** Append a short block to `SYSTEM_PROMPT` listing the canonical codes and their friendly names so it prefers passing `NFIU_CTR` directly:
   - `NFIU_STR` Suspicious Transaction Report
   - `NFIU_CTR` Currency Transaction Report
   - `CBN_MPR` Monetary Policy Return
   - `CBN_FX` Foreign Exchange Return
   - `NDIC_PREM` Premium Contribution Return
   - `NDIC_SO` Single Obligor Return
   - `SCUML_ANN` Annual SCUML Compliance Report
   - `FIRS_VAT` / `FIRS_PAYE` / `FIRS_WHT` / `FIRS_CIT`
   - Also instruct: when the user asks to "generate a report", first call `navigate_dashboard({ view: "returns" })`, then ask which return + period, then call `check_return_readiness` before `request_generate_return`.

## Out of scope

- No frontend changes — the approval chip for `request_generate_return` already exists in `AgentRail.tsx` (`MutationApproval` component) and renders when the tool output has `requires_approval: true`.
- No DB / schema / RLS changes — the catalog is already seeded.
- No new "draft narrative" tool. The existing `draft_investigation_summary` covers case-narrative drafting; richer per-return narrative drafting is a follow-up if you want it.
- No XML compilation step yet — `request_generate_return` currently creates a `report_requests` row in `pending_approval`. Wiring real XML generation to the existing `generate-form-report` / `process-report` edge functions is a separate, larger change.

## File touched

- `supabase/functions/agent-orchestrator/index.ts` (resolver + 2 tool executes + system prompt addendum)

## Verification

After deploy: in the agent rail, type "I want to generate a report" → dashboard should switch to Returns and agent asks which return. Type "CTR for today" → readiness check runs, returns either `ready: true` or `missing: [...]`, then offers the approval chip.
