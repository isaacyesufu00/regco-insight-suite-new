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

### G1 — Fraud / AML segregation & governance (PRIORITY)
- **Standard:** Where the AML Solution is also deployed for fraud monitoring, its
  fraud-related functionalities must be *clearly segregated and appropriately
  governed* so AML/CFT/CPF detection effectiveness is not compromised.
- **Current state:** `TransactionMonitor.tsx` is titled "Transaction Fraud Prevention"
  and blends AML and fraud in one console. Capability exists; the governance
  separation is not explicit.
- **Action:** Introduce a distinct fraud/AML configuration boundary — separate rule
  sets, access scope, and audit scoping — and surface the segregation in the UI.

### G2 — Enterprise Case Management workbench (PRIORITY)
- **Standard:** ECM capability that automates creation, assignment, prioritisation,
  and tracking of cases from AML/CFT/CPF alerts, with full audit trails.
- **Current state:** Escalation queue exists inside `TransactionMonitor` (escalate →
  reported), but no standalone assign/prioritise/SLA workbench.
- **Action:** Build a dedicated Case Management page over the `cases` table with
  owner assignment, priority, SLA timers, and per-case audit trail.

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

## Out of scope (pre-existing, unrelated)
~20 repo-wide typecheck errors from a Supabase `profiles` schema drift (migrated to
hashed columns e.g. `company_name_hash`) in admin/dashboard pages — not introduced by
the marketing-page work and not part of this alignment effort.
