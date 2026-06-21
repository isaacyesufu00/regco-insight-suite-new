## What's done vs. not (vs. your client checklist)

**Already built (Phases A–G partial)**
- A: profiles, user_roles, customers, customer_accounts/kyc, unified_transactions, transaction_reviews (alerts), cases, case_events (hash-chained), case_artifacts, sanctions_entries, pep_entries, screening_results, audit_issues, filing_schedules, report_templates, reports, agent_conversations/messages/tool_invocations — all with RLS by user_id. ✅
- B partial: `receive-transaction` edge function (HMAC + API key), `provision-webhook-key`. No `/ingest/customers`, `/ingest/batch`, `/health`, SFTP poller. ❌
- C partial: AML hooks exist in `receive-transaction`; `screen-customer`, `adverse-media-scan`, `sync-sanctions(-lists)`, `kyc-reminders` exist. Dedicated rules engine (Rules 1–8) not split out. No BVN/NIN (Dojah) verifier. ❌
- D: Dashboard already reads live data via Supabase Realtime (compliance scores, report counts). Smart Risk Ledger / vs-anomaly chart not wired to live AML alerts yet. ⚠️ partial
- E: Cases table exists, no `/dashboard/cases` UI or Customer 360 page. (And you've now asked these to live inside the Agent surface, not new pages.) ❌
- F: No STR filing flow. ❌
- G partial: Agent has a tool registry (orchestrator). Intent router → real data exists for tools but the dashboard rail still shows "Thinking…" and never resolves.

---

## Plan

### 1. Fix the "thinking forever" bug (root cause)
The dashboard rail uses `agent-orchestrator` (streaming via AI SDK `useChat`); the full Agent page uses `agent-chat` (non-stream). The rail hang is in the orchestrator's stream — OpenRouter responses sometimes return a tool-call loop with no `stopWhen` resolution, or the stream never finalizes because `toUIMessageStreamResponse` isn't wrapping errors. Fix:
- Return `result.toUIMessageStreamResponse({ headers: corsHeaders, onError: e => msg })` so client gets a final part on any backend failure.
- Set `stopWhen: stepCountIs(8)` and a `maxOutputTokens` cap so it can't infinite-loop on tool calls.
- Add 60s timeout + explicit error surface for 402/429.
- Mirror these into `agent-chat` so the standalone page handles errors identically.

### 2. Agent surface upgrade (this is where every new feature lives)
Per your direction, **no new pages**. All new functionality is inside the existing dashboard Agent rail (`AgentRail.tsx`):

**(a) Bubble redesign — match the reference**
- User messages: right-aligned, soft grey bubble (rounded with one squared corner), Helvetica.
- Assistant messages: left-aligned plain text (no bubble, no avatar background), markdown rendered.
- Thinking indicator: small italic label + animated dots, replaced by streamed text the moment the first token arrives.

**(b) "+" quick-actions popover above the composer**
Floating menu (anchored to the input, 8px above the + button) with:
- Import a file
- Generate a return
- Check a customer (Customer 360)
- File an STR
- Review an alert
- Find missing data
- Explain a rule
Selecting an item either: opens the file picker, or injects a pre-filled prompt + auto-submits so the agent runs the right tool (`request_generate_return`, `get_customer_360`, `explain_alert`, etc.).

**(c) Real consequences for actions**
Wire each quick-action to an existing/new orchestrator tool so the user sees a result, not just chat:
- *File an STR* → new `file_str` tool: creates a `case_events` entry with `event_type='str_filed'`, generates STR text via the model, stores it in `case_artifacts`, replies with a download link.
- *Check a customer* → existing `get_customer_360` returns a compact inline card (customer name, BVN/NIN status, risk, open cases) rendered in the assistant bubble.
- *Review an alert* → `list_transactions` filtered by review_status='pending' + `explain_alert`, renders an inline alert card with Approve / Escalate buttons that call `add_case_note` + status update.
- *Generate a return* → existing `request_generate_return` (already opens dialog).
- *Find missing data* → new `check_return_readiness` reuses the validator output to list missing fields.
- *Import file* → already supported by the rail; after upload, agent receives parsed text in context.

### 3. Product / marketing pages redesign
Restructure the 4 feature pages (`ProductAutomatedReturns`, `ProductLiveScreening`, `ProductTransactionMonitoring`, `ProductAuditTrail`) to match the Medusa reference:
- **No cards anywhere.** White background end-to-end (matches homepage).
- Layout = repeated split-row sections: left = `<h2>` headline + supporting paragraph; right = a clean product visual (mock UI screenshot or labelled table, no card chrome, divider line only).
- Same RegCo navbar/footer, same typography scale; just swap the card grid for these split rows.
- Keep current SEO (title/meta/JSON-LD) per page.
- Delete `FeaturePageTemplate.tsx` card-based primitives or replace its primitives with the split-row primitive.

### 4. Typography → Helvetica
- Update `tailwind.config.ts` `fontFamily.sans` to `['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']`.
- Update `index.css` `body` font + remove the Lora serif h1 inside `AgentCenter` (keep Helvetica everywhere, including dashboard).
- This affects marketing site + dashboard uniformly per your request.

### 5. Light-touch DB additions only where needed
Single migration:
- `str_filings` table (case_id, customer_id, narrative text, status, submitted_by, created_at) + RLS by user_id + GRANTs.
- Add `priority` enum check + `assigned_to` already exist on cases; nothing else needed for now.
No PII migrations for ingestion endpoints in this pass — that's Phase B/C scope and you said be careful; I'll flag it as the next chunk.

### 6. Explicitly deferred (next plan, not this one)
- `/ingest/customers`, `/ingest/batch`, `/health`, SFTP poller
- Standalone AML rules engine split-out + Dojah BVN/NIN
- Daily sanctions re-screening cron
- Smart Risk Ledger + Volume-vs-Anomaly chart rebind to live AML alerts (current dashboard is reactive but on different tables)

---

### Technical notes
- Files touched: `supabase/functions/agent-orchestrator/index.ts`, `supabase/functions/agent-chat/index.ts`, `src/components/dashboard/AgentRail.tsx`, `src/components/agent/AgentCenter.tsx` (font only), `src/pages/marketing/FeaturePageTemplate.tsx` + 4 product pages, `tailwind.config.ts`, `src/index.css`, new `supabase/functions/file-str/` (or inline tool), one migration for `str_filings`.
- New orchestrator tools: `file_str`, `check_return_readiness` (if not already present), `approve_alert`, `escalate_alert`.
- Quick-action popover = small uncontrolled component inside `AgentRail`, no new route.
- Helvetica is a system font; no Google Fonts fetch needed.

### One thing I want to confirm before building
For the **assistant bubbles**, your reference shows tiny action icons (download / regen / copy) under each assistant message. Want those wired now (copy + regenerate), or skip and just match the bubble shapes?
