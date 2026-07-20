# CBN Baseline Standards — Alignment Roadmap

Tracking doc for closing the gaps between RegCo and the CBN **Baseline Standards for
Automated Anti-Money Laundering Solution** (Article 8 — definition of an AML Solution).

Reviewed 2026-07-20. Overall verdict: **ON TRACK** — feature architecture maps cleanly
onto the Standards' nine pillars. See `memory/cbn_standards_alignment.md` for the
full mapping.

## Coverage status (verified)

| Pillar | Code | Status |
|---|---|---|
| CDD / KYC / KYB + Risk | `Customer360.tsx` | present |
| Sanctions / PEP screening | `Screening.tsx` | strong |
| Transaction / Fraud monitoring | `TransactionMonitor.tsx` | strong |
| Case Management (ECM) | `cases` / STR queue | **partial** |
| Reporting (STR/CTR/FTR GoAML) | `NfiuReports.tsx` | strong |
| Audit & Governance (immutable) | `AuditLog.tsx` (hash chain) | excellent |
| Integration & Scalability | CBS webhook + tier caps | present |
| Security & Data Protection (NDPA) | legal routes + settings | baseline |

## Backlog gaps

### G1 — Fraud / AML segregation & governance (PRIORITY) — ✅ DONE (2026-07-20)
- **Standard:** Where the AML Solution is also deployed for fraud monitoring, its
  fraud-related functionalities must be *clearly segregated and appropriately
  governed* so AML/CFT/CPF detection effectiveness is not compromised.
- **Root model:** The DB already segregates via `transaction_rules.category`
  ∈ {AML, FRAUD, CTR} and `transaction_alerts.category` (seeded rules: CTR ₦5M/₦10M,
  AML structuring/round-figure/large-cash, FRAUD velocity/dormant-reactivation).
- **UI/governance layer added:** `TransactionMonitor.tsx` now carries a governance
  banner citing CBN Art. 8, an All/AML/Fraud/CTR domain switcher with per-domain
  counts, and a domain badge on every flagged row. Domain is derived from `flag_rule`
  using the same rule→category mapping as the server engine.
- **Files:** `src/pages/TransactionMonitor.tsx`.

### G2 — Enterprise Case Management workbench (PRIORITY) — ✅ DONE (2026-07-20)
- **Standard:** ECM capability that automates creation, assignment, prioritisation,
  and tracking of cases from AML/CFT/CPF alerts, with full audit trails.
- **Built:** New `src/pages/CaseManagement.tsx` over the existing `cases` table —
  create, assign (assignee_id), prioritise (severity), SLA (`sla_due_at` with overdue
  highlighting), status workflow (open→investigating→escalated→closed), and a
  `case_status_history` row written on every transition (full audit trail).
- **Routing:** `/dashboard/cases`, gated by `FeatureGate` `auditTracker`
  (State MFB+), mirroring `audit-tracker`.
- **Files:** `src/pages/CaseManagement.tsx`, `src/App.tsx`.

### G3 — Documented periodic ML/TF/PF risk assessment
- **Standard:** Periodic risk assessments at enterprise and business-line level,
  documented, with AML config reflecting them.
- **Action:** Add a risk-assessment artifact/page; reflect result in `featureTiers`
  / rule configuration.

### G4 — Independent / internal review workflow
- **Standard:** Periodic independent internal and external reviews of solution
  effectiveness.
- **Current state:** Immutable ledger supports it (`AuditLog.tsx` verify function),
  but no review workflow surfaces it.
- **Action:** Add a review/sign-off workflow on top of the ledger verification.

## CBS integration hardening (2026-07-20) — ✅ DONE
Design direction: **pull-by-default** so the bank writes no crypto in CBS and holds no
RegCo secret. See `CBS_INTEGRATION_ARCHITECTURE.md` for the full proposal.

- **Fail-closed webhook HMAC secret:** `receive-transaction` now reads its HMAC key
  from Supabase Vault via `webhook_hmac_secret()` (migrated in
  `20260720010000_cbs_integration_hardening.sql`). The hardcoded `"regco-sentinel-v1"`
  fallback is removed — the endpoint refuses to verify when the secret is absent.
- **Orphaned legacy function deleted:** `ingest-transaction-webhook` (not registered
  in `config.toml`, carried the hardcoded fallback) removed.
- **Pull connector scaffold:** `cbs-pull-connector` edge function + `cbs_feed_connections`
  / `cbs_feed_sync_log` tables. RegCo pulls from a bank-provisioned read-only feed using
  RegCo-held (Vault-encrypted) credentials; ingests via the same `ingest_transaction_webhook`
  RPC as push. Registered in `config.toml` (`verify_jwt = false`, cron-driven).

**Resolved (2026-07-20):** the `ingest_transaction_webhook` RPC is now committed as a
migration (`20260720020000_ingest_transaction_webhook.sql`) — idempotent on
`(institution_id, idempotency_key)`, resolves `user_id` via `institution_users`, inserts
`unified_transactions`, and records the receipt in `receive_transaction_requests`. The
bank-facing onboarding UI (`/dashboard/connectors`) documents **pull as the default** with
**file drop as the fallback**, matching the live `receive-transaction` / `cbs-pull-connector`
callers that read the returned `transaction_id`.

## Out of scope (pre-existing, unrelated)
~20 repo-wide typecheck errors from a Supabase `profiles` schema drift (migrated to
hashed columns e.g. `company_name_hash`) in admin/dashboard pages — not introduced by
the marketing-page work and not part of this alignment effort.
