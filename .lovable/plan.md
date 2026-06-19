# RegCo Backend Architecture Plan

A pragmatic, phased build that turns the AI Agent into a real "tier-one compliance analyst" — wired into transactions, KYC, sanctions, cases, and returns. Built on the existing Supabase + Lovable AI Gateway stack, no new infra.

---

## 1. Architecture Overview

```text
[Officer]
   │  prompt
   ▼
[AgentRail UI] ──► supabase.functions.invoke("agent-orchestrator")
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Agent Orchestrator (Edge)  │
            │  - JWT verify (sub = user)  │
            │  - Loads conversation       │
            │  - Calls AI SDK streamText  │
            │  - Tool loop (stepCountIs)  │
            └──────────────┬──────────────┘
                           │ tool calls
        ┌──────────┬───────┼────────┬──────────────┐
        ▼          ▼       ▼        ▼              ▼
   monitoring   screening case-mgmt returns     dashboard-nav
   (tools)      (tools)   (tools)   (tools)     (UI control)
        │          │       │        │              │
        ▼          ▼       ▼        ▼              ▼
   unified_     sanctions  audit_   report_      (emits event
   transactions /pep/      events / requests /    to frontend)
   customers    customer_  cases    generate-
                kyc                  form-report
```

Single orchestrator function with a **tool registry**. Each tool is a thin, validated wrapper around an existing table or edge function. The agent decides which tools to call; the UI streams text + tool-activity parts.

---

## 2. Agent Orchestrator (replaces current `agent-chat`)

New edge function `agent-orchestrator`:
- AI SDK (`npm:ai`, `npm:@ai-sdk/openai-compatible`) → Lovable AI Gateway, model `google/gemini-3-flash-preview`.
- `streamText` with `tools: { ... }`, `stopWhen: stepCountIs(50)`, system prompt scoped to user's institution + license tier.
- Returns `toUIMessageStreamResponse()` so the rail can render tool activity ("Screening Halcyon Logistics…", "Compiling NFIU STR…") instead of the current static "Reading your request…" stages.
- Persists every turn (user msg, assistant text, tool call, tool result) into `agent_messages` for replay + audit.
- JWT-validated, identity from `sub` claim — never trusts `user_id` in body (per security memory).

Frontend `AgentRail.tsx` swaps the manual fetch for `useChat` with `DefaultChatTransport` pointed at the function URL, rendering `message.parts` (text + tool parts).

---

## 3. Tool Registry (the agent's hands)

Grouped by pillar. Each tool = Zod schema + handler that calls Supabase with the **user's** JWT (RLS enforced) or service role for read-only aggregates.

**Transaction Monitoring**
- `get_account_velocity({ account_id, window_days })` → aggregates from `unified_transactions`.
- `list_transactions({ entity_name?, account_id?, min_amount?, direction?, since? })`
- `explain_alert({ transaction_id })` → joins `transaction_reviews` + rule metadata.
- `compare_to_baseline({ account_id, period })` → today vs 6-month avg.

**Live Screening**
- `screen_entity({ name, bvn?, nin?, rc_number? })` → wraps existing `screen-customer` edge function.
- `get_customer_360({ customer_id })` → `customers` + `customer_kyc` + `customer_accounts` + recent screening_results.
- `adverse_media_scan({ name, years })` → new edge function using Lovable AI Gateway with web-grounded model (or stubbed source list initially).
- `get_risk_score({ entity_id })` → reads + explains drivers.

**Case Management**
- `open_case({ trigger_id, severity, assignee? })` → new `cases` table.
- `add_case_note({ case_id, note })`
- `freeze_account({ account_id, reason })` → writes intent to `account_actions` (needs `needsApproval: true`).
- `draft_edd_memo({ customer_id })` / `draft_investigation_summary({ case_id })` → AI-generated narrative, stored as case artifact.
- `get_audit_trail({ case_id })` → reads `audit_events`.

**Automated Returns**
- `generate_return({ type: "NFIU_STR"|"NFIU_CTR"|"CBN_*", case_id?, period? })` → wraps existing `generate-form-report` + `process-report`.
- `check_return_readiness({ type, period })` → lists missing fields.
- `get_filing_deadline({ type })` → static rules table.
- `generate_board_pack({ period })` → wraps existing `generate-board-pack`.

**UI Control (zero-cost UX wins)**
- `navigate_dashboard({ view: "screening"|"customer_360"|"cases"|"returns", entity_id? })` → emits a tool result the rail forwards as a route change. Implements the "switch to identity" promise already in the rail's empty state.

All mutating tools (`freeze_account`, `generate_return`, `open_case`) use AI SDK `needsApproval` — the rail renders an inline "Approve / Cancel" chip before execution. Matches the "immutable audit trail" pillar.

---

## 4. Data Model Additions

New tables (migrations, with grants + RLS scoped to `auth.uid()` and `has_role`):

- **`cases`** — id, user_id, institution_id, customer_id, status (open/investigating/escalated/closed), severity, assignee, opened_at, closed_at, summary.
- **`case_events`** — id, case_id, actor_id, actor_kind ('user'|'agent'), event_type, payload jsonb, prev_hash, hash (SHA-256 of prev_hash + payload) → **tamper-evident chain** for the "cryptographically sealed" claim. Hash computed in a `BEFORE INSERT` trigger.
- **`case_artifacts`** — generated memos, draft STRs, attachments (Supabase Storage refs).
- **`account_actions`** — pending/approved freeze/unfreeze intents with approver_id.
- **`agent_tool_invocations`** — full log of every tool call (name, args, result_summary, latency_ms, conversation_id, message_id) for audit + cost tracking.
- **`regulatory_rules`** — static catalogue (rule_code, regulator, description, threshold_json) so `explain_alert` and `get_filing_deadline` return real text.
- **`filing_schedules`** — return_type, frequency, due_offset_days, regulator.

Extend `agent_messages` with `parts jsonb` (AI SDK UIMessage parts) so tool calls/results persist verbatim.

Realtime: enable on `cases`, `case_events`, `unified_transactions` (insert) so the dashboard auto-refreshes when the agent acts.

---

## 5. Conversation & Memory

- One **conversation per officer per workday** by default (matches the "command center" loop), with a "New conversation" button. Threads stored in existing `agent_conversations`.
- Orchestrator sends **full message history** (per chat-agent best practices) and a **scoped context block** built server-side each turn: institution profile, today's open alerts count, top 3 active cases, license tier. Keeps the agent grounded without bloating prompts.
- Long-term memory (per-customer notes the agent has written) lives in `customers.agent_notes jsonb` — fetched on demand by tools, not stuffed into every prompt.

---

## 6. Security & Compliance Posture

- Every tool handler calls `supabase.auth.getClaims()` and uses `claims.sub` as the actor — never trusts arguments.
- Mutating tools require `needsApproval` → human-in-the-loop, logged to `case_events`.
- `case_events` hash chain gives the "defensible step-by-step history" auditors need.
- Tool invocations and approvals written to `agent_tool_invocations` with the conversation_id, so a regulator can reconstruct exactly what the agent did and why.
- No third-party tool names ever leak into UI/network (per project memory) — orchestrator endpoint is `/functions/v1/agent-orchestrator`, tool names use RegCo vocabulary ("screen_entity", not "openai_*").
- RLS on every new table; service role only inside edge functions.

---

## 7. External Integrations (phased)

| Source | Phase | Approach |
|---|---|---|
| Core Banking System feed | 1 | Existing `receive-transaction` webhook + `webhook_api_keys`. Add normalization into `unified_transactions`. |
| Sanctions lists (UN/OFAC/EU/UK/CBN) | 1 | Existing `sync-sanctions-lists` cron — already in place. |
| BVN / NIN / CAC verification | 2 | New `verify-identity` edge function behind a connector secret (e.g. Dojah/Smile ID). Stubbed in phase 1 returning deterministic mock for known test BVNs. |
| Adverse media | 2 | Lovable AI Gateway with web-search-capable model; cache results 24h in `adverse_media_cache`. |
| NFIU / CBN portal filing | 3 | XML generator in `generate-form-report` (extend existing). Submission stays manual download in phase 1 — auto-submission is regulator-API-dependent. |

---

## 8. Build Phases

**Phase 1 — Agent loop + read tools (this build)**
- New `agent-orchestrator` edge function with AI SDK + tool registry.
- Tools: `list_transactions`, `get_account_velocity`, `get_customer_360`, `screen_entity` (wraps existing), `get_risk_score`, `navigate_dashboard`, `get_filing_deadline`.
- `agent_tool_invocations` table + `regulatory_rules` + `filing_schedules` seeded.
- Frontend: `AgentRail.tsx` migrated to `useChat`, renders text + tool activity parts.

**Phase 2 — Cases + mutating tools with approval**
- `cases`, `case_events` (hash chain), `case_artifacts`, `account_actions` tables.
- Tools: `open_case`, `add_case_note`, `freeze_account` (needsApproval), `draft_edd_memo`, `draft_investigation_summary`, `get_audit_trail`.
- Cases dashboard view + realtime updates.

**Phase 3 — Returns + identity**
- `generate_return`, `check_return_readiness`, `generate_board_pack` tools wired to extended `generate-form-report`.
- `verify-identity` edge function + connector for BVN/NIN/CAC.
- Adverse media tool with caching.

---

## Technical Details

- Edge runtime: Deno, imports via `npm:ai@^4`, `npm:@ai-sdk/openai-compatible`, `npm:zod`. CORS via `npm:@supabase/supabase-js@2/cors`. Reuses existing `LOVABLE_API_KEY`.
- Tool handlers share a `createToolContext({ authHeader })` helper that returns a user-scoped Supabase client + admin client + `userId` from `getClaims`.
- `stopWhen: stepCountIs(50)`; `temperature: 0.2`; `max_tokens: 1500` per turn.
- `agent_messages.parts jsonb` stores AI SDK `UIMessage.parts` so reloading a thread restores tool chips, not just text.
- Hash chain: `case_events.hash = encode(digest('sha256', coalesce(prev_hash,'') || payload::text || created_at::text), 'hex')` via `BEFORE INSERT` trigger; verification job runs nightly.
- Frontend chat uses `@ai-sdk/react` `useChat` + `DefaultChatTransport({ api: ${VITE_SUPABASE_URL}/functions/v1/agent-orchestrator, headers: { Authorization: Bearer <session.access_token> } })`.
- All new tables follow the project's grant order: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`, scoped via `auth.uid()` and `has_role`.

---

## Open Questions Before Build

1. **Approval UX**: inline chip in the rail (compact) vs modal (more deliberate) for `needsApproval` tools like `freeze_account` and `generate_return`?
2. **Identity provider**: do you have a preferred BVN/NIN vendor (Dojah, Smile ID, VerifyMe), or should phase 1 ship with a deterministic mock and we wire the real connector in phase 3?
3. **Phase 1 scope confirmation**: start with the orchestrator + read-only tools + `navigate_dashboard` this build, and defer cases/returns/identity to follow-ups — yes?
