
## 1. Switch AI Gateway: Lovable → OpenRouter

Replaces the "Payment Required" (402) issue, since OpenRouter is billed on your own OpenRouter account, not Lovable credits.

**Secrets already present:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` ✅ — no new secrets needed.

**Changes**
- Update every edge function that currently calls `ai.gateway.lovable.dev` (primarily `agent-orchestrator`, plus any helper that uses `LOVABLE_API_KEY` for chat) to call OpenRouter instead:
  - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
  - Headers: `Authorization: Bearer ${OPENROUTER_API_KEY}`, `HTTP-Referer: <site url>`, `X-Title: RegCo`
  - Model: read `Deno.env.get("OPENROUTER_MODEL")`, fallback to a sensible default (e.g. `google/gemini-2.5-flash`).
- Keep request/response shape (OpenAI-compatible) so tool-calling, streaming, and message format don't need rewrites.
- Map errors in the chat UI:
  - 401 → "AI gateway not configured" (key issue).
  - 402 / "insufficient credits" → "OpenRouter credits exhausted — top up at openrouter.ai/credits".
  - 429 → "Rate limited, retry in a moment".
- Leave `LOVABLE_API_KEY` in place but unused by chat (it's still needed for non-AI Lovable services if any).
- Note: Lovable's image-generation / embedding helpers, if used anywhere, can stay on Lovable AI or also move to OpenRouter — confirm before touching those. Default: only migrate the chatbot.

## 2. Admin: Report Template Builder (no SQL)

New admin section to author/edit `report_templates` end-to-end via UI.

**Routes:** `/admin/templates` (list) and `/admin/templates/:id` (editor), linked from the admin sidebar.

**List page** — table grouped by `code` (latest version first): title, regulator, frequency, status badge (draft/active/archived), version, updated. Actions: New, Edit, Duplicate as new version, Activate, Archive, Delete (drafts only).

**Editor (tabbed form)**

```text
┌─ Header: code | version | title | regulator | frequency | status ─┐
├─ Tab 1  Fields & Parameters   (definition.parameters[])           │
├─ Tab 2  Data Sources/Mappings (definition.sources[])              │
├─ Tab 3  Validators            (definition.readiness[])            │
├─ Tab 4  Layout & Formats      (definition.layout, formats[])      │
├─ Tab 5  Defaults & Period     (definition.period, defaults)       │
└─ Tab 6  JSON Preview / Test readiness ────────────────────────────┘
```

- **Fields/Parameters** — repeater rows: key, label, type (text/number/date/select/boolean), required, default, options, help.
- **Mappings (sources)** — repeater rows: source key, table (dropdown of known tables), columns (multi-select), filters (column / op / value or `${param.x}`), order_by, limit.
- **Validators (readiness)** — rules: type (min_rows / required_column / non_null / regex), source key, column, threshold/value, error message.
- **Layout** — type (table/form/sectioned), column order, header labels.
- **Formats** — checkbox group (xlsx / csv / xml / pdf).
- **JSON Preview tab** — live read-only view; "Test readiness" button calls new edge function `template-test-readiness` to run rules against current data.

**Persistence**
- Save Draft → upsert with `status='draft'`.
- Activate → new edge function `template-activate` (service-role) flips target to `active` and demotes other versions of the same `code` to `archived`.
- All writes guarded by admin-only RLS already in place.

## 3. Reactive Dashboard with Real Data

Today `DashboardHome` reads from `compliance_scores`, `user_stats`, `report_statuses` seeded once by `handle_new_user`. Make it reflect live activity.

- **Recompute on event**: triggers on `reports`, `report_requests`, `case_events` that update `compliance_scores` and `user_stats` for the owning user.
- **Live status feed**: replace static `report_statuses` rows with a query over `reports` + `filing_schedules` (due / overdue / ready / submitted). Stop seeding fake rows in `handle_new_user`.
- **Realtime UI**: subscribe via Supabase Realtime on `reports`, `compliance_scores`, `user_stats` inside `DashboardHome` (proper `useEffect` + `removeChannel`).
- **Empty states**: when a user has no activity, show "No reports filed yet" instead of fake "24 filed / 98% on-time".
- **Score formula** (in code): `100 − (overdue × 10) − (failed × 5)`, floored at 0; on-time rate = on-time submissions / total submissions.

## 4. Dedicated Pages per Product Dropdown Item

Current navbar dropdown links to `#anchors` on `/product`. Replace with four real routes that match the existing site theme (`SiteNavbar` + site tokens, ink/line palette, no purple gradients):

| Dropdown item | New route |
|---|---|
| Automated Returns | `/product/automated-returns` |
| Live Client Screening | `/product/live-screening` |
| Transaction Monitoring | `/product/transaction-monitoring` |
| Audit Trail & Case Mgmt | `/product/audit-trail` |

Each page reuses existing site primitives and contains:
1. Hero — headline, sub, primary "Book a demo" + secondary "See pricing".
2. The problem (regulator-specific pain, 1–2 sentences).
3. Capabilities grid (4–6 cards, lucide icons, hairline borders).
4. Workflow (3 steps, reused pattern).
5. Benefits with metric chips (e.g. "−85% prep time").
6. Compliance/regulator badges row.
7. FAQ (3–4 Q&A).
8. CTA footer band.

SEO per page: unique `<title>` <60 chars, meta description <160, single H1, JSON-LD `SoftwareApplication`. Update `SiteNavbar.products` to point to the new routes; keep `/product` as the overview that links to all four.

## Technical notes

- **Edge function changes:** `agent-orchestrator` (and any AI helper) switched to OpenRouter; new `template-activate` and `template-test-readiness`.
- **Migrations:** triggers + functions to recompute `compliance_scores` / `user_stats`; enable Realtime publication for `reports`, `compliance_scores`, `user_stats`; remove fake seeds from `handle_new_user`.
- **New admin pages:** `AdminTemplates.tsx`, `AdminTemplateEditor.tsx` (subcomponents per tab).
- **New marketing pages:** `ProductAutomatedReturns.tsx`, `ProductLiveScreening.tsx`, `ProductTransactionMonitoring.tsx`, `ProductAuditTrail.tsx`; routed in `App.tsx`.
- **Chat error mapping** in chat client/`AgentRail`: 401 / 402 / 429 messages.

## Out of scope (ask before doing)

- Migrating image generation / embeddings to OpenRouter (only the chatbot is moved).
- Drag-and-drop visual schema editor (form repeaters are enough for v1).
- Custom JS expression validators (rule-based only).
- Redesigning the existing `/product` overview page.
