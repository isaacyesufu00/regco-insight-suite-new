# HANDOFF — RegCo Insight Suite: Bank-Grade / CBN-Examination Hardening (Continuation)

> **Purpose:** A fresh Qwen Code instance in a NEW window should read this file top-to-bottom and be able to continue the security hardening WITHOUT re-deriving any context. Everything below is the exact current state as of the handoff date. Copy-paste the prompts/commands at the bottom of each section.

---

## 0. OVERVIEW / WHY THIS FILE EXISTS

The product (`regco-insight-suite-new`) has **100% of its MVP features shipped** (CBN Pillars 2/3/5/6). The current effort is to move it from "features work" to **genuinely bank-grade secure / CBN-examination-ready**. The user's stated goal: *"make sure everything is built in a secure bank-grade way and everything is done."*

This is **NOT** a feature build. It is a security/compliance hardening pass focused on:
- **Reproducibility (DR):** the git repo must be able to recreate the live DB.
- **Fail-closed crypto:** no silently-broken encryption.
- **Tenant isolation at the API layer** (DB layer is largely done; edge functions are not).
- **Intact audit integrity** (hash-chained, per-institution, user-bound).

**Project location (absolute):** `/Users/mac/regco-insight-suite-new`
**Live DB project ref:** `pdplkprcomjslilznbsl` (Supabase, linked locally)
**Frontend:** Vercel (Vite/React/shadcn/ui)

---

## 1. EXACT CURRENT STATE (verified, do not re-verify from scratch)

### 1.1 Active migrations (applied to live DB — `supabase/migrations/`)
| File | Status | Notes |
|---|---|---|
| `20260714010330_remote_schema.sql` | **EMPTY (0 bytes)** | The reproducibility gap. Tracked as "applied" in `schema_migrations` but contains nothing. DO NOT trust it. |
| `20260715000000_transaction_rules_engine.sql` | applied | Phase B — 7 CBN rules engine |
| `20260716000000_immutable_audit_trail.sql` | applied | Phase A — original audit ledger (superseded by below) |
| `20260717000000_customer_beneficial_owners.sql` | applied | Phase C — beneficial owners |
| `20260718000000_nfiu_reports.sql` | applied | Phase D — NFIU reports |
| `20260719000000_audit_trail_tenant_isolation.sql` | **applied THIS session** | Per-institution chain + `auth.uid()` bind |
| `20260719000001_cac_lookup_ownership_guard.sql` | **applied THIS session** | `fn_user_owns_customer` + helpers |

Confirmed live via `supabase db query --linked`: all 94+ tables have `rowsecurity=true` with real tenant-isolation policies; 6 functions present from the two new migrations (`fn_append_audit_log`, `fn_verify_audit_chain`, `fn_user_institution`, `has_institution_access`, `fn_user_owns_customer`, `fn_resolve_institution`).

### 1.2 Drafts (NOT applied — in `supabase/migrations/_drafts/`)
- `20260714010330_remote_schema.sql.partial` — partial baseline (app_role + 4 helpers). For reference only.
- `20260714010330_remote_schema.sql.full` — **FULL reconstructed baseline, 3571 lines, 99 tables + enums + helpers + constraints (DO-block wrapped) + indexes.** State: assembled + transform-fixed. **NOT yet validated in a rolled-back txn, NOT moved to `../`, NOT committed.**
- `transform_constraints.py` — helper that wraps bare `ALTER TABLE public.X ADD CONSTRAINT IF NOT EXISTS` into idempotent `DO $$` guard blocks. Safe to delete after baseline finalized.

**Baseline transform verification (just ran):**
- `ADD CONSTRAINT IF NOT EXISTS` remaining: **1** (a comment line — harmless)
- inner `ALTER TABLE ... ADD CONSTRAINT` inside DO blocks: **264**
- `DO $$` blocks: **266**
- total lines: **3571**

### 1.3 Local fixes (committed to working tree, NOT pushed)
- `.gitignore`: added `.env`, `.env.*`, `!.env.example`
- `src/integrations/supabase/client.ts`: removed hardcoded anon-key fallback; now **throws** if `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` missing
- `.env.example`: added (documents required vars, no secrets)
- `git rm --cached .env` done (file stays on disk, no longer tracked)

### 1.4 Edge functions (`supabase/functions/`)
- `cac-lookup/index.ts`: STILL does unauthenticated `service_role` customer fetch + brittle `profiles.institution_id` lookup (that column does NOT exist). Must call `fn_user_owns_customer` + drop broken lookup + redeploy.
- `receive-transaction`, `screen-customer`, `regco-txn-ingest`, `onboard-client`, `send-demo-notification`: marked `verify_jwt = false` in `supabase/config.toml` (no JWT check) or use `service_role` without ownership checks.
- `generate-nfiu-report`, `submit-nfiu`, `verify-audit-chain`: already properly auth-scoped (verified).

### 1.5 Key constants (do not get these wrong)
- `app_role` enum = `('admin','user','compliance_lead')`  ← **NOT** admin/compliance_officer/analyst (the partial draft's enum is WRONG — ignore it)
- `aml_job_status` enum = `('queued','processing','completed','failed')`
- Multi-tenant isolation key = **`institution_id`** (NOT uniformly `user_id` — `customers` has only `institution_id`)

---

## 2. ENVIRONMENT BLOCKERS (read before running anything)

1. **`supabase db dump` fails** — Docker daemon tries to pull the Postgres image from Docker Hub and times out (TLS handshake timeout). The user explicitly chose to avoid Docker and use the **Supabase SQL Editor** catalog-query method instead. Do not retry `db dump` expecting it to work; the `.full` file is already the reconstruction result.
2. **`supabase db query` safety classifier** — intermittently blocked by "Auto mode classifier unavailable." Cannot be bypassed. If blocked, fall back to pasting SQL into the Supabase SQL Editor web UI. NEVER bypass via shell indirection/encoding.
3. **`pg_get_typedef` does not exist** in this PG version — use enum reconstruction (`format_type` + `pg_enum`) instead.
4. **Postgres idempotency gotcha (load-bearing):** `ALTER TABLE IF EXISTS` and `ADD CONSTRAINT IF NOT EXISTS` are **INVALID** in this PG version → syntax error `42601`. Must wrap each `ADD CONSTRAINT` in a `DO $$` guard checking `pg_constraint.conname`. The `.full` file already does this.

---

## 3. PENDING TASKS (prioritized P0 → P2)

### P0 — blockers before real bank data / CBN exam
1. **Finalize baseline:** validate `.full` in a rolled-back txn → move to `supabase/migrations/` → commit → confirm `migration list` shows 7 applied.
2. **Rotate hardcoded crypto secrets** (`fn_decrypt_pii`/`fn_hash_bvn` fall back to known keys) → store in Vault, make functions **fail-closed** (raise if `app.enc_key` unset). Draft new migration in `_drafts/`.
3. **Wire `fn_user_owns_customer` into `cac-lookup` edge code** + fix broken `profiles.institution_id` lookup; redeploy.
4. **Close auth gaps** in `verify_jwt=false` functions (receive-transaction, screen-customer, regco-txn-ingest, onboard-client, send-demo-notification) — add JWT verification + tenant ownership checks.

### P1 — bank-grade expectation
5. Real NFIU gateway + GoAML 4.0 XSD validation (replace mock `NFIU-ACK`).
6. PII decryption UI + key custody.
7. Wire login lockout (`check-login-lockout` / `record-login-attempt`) into sign-in flow.
8. Lock CORS `Access-Control-Allow-Origin` to Vercel domain in all functions (currently `*`).

### P2
9. Test suite for rules engine / screening / audit chain; roles admin UI; realtime alerts.

---

## 4. NEXT STEP (in-flight) — FINALIZE THE BASELINE

The `.full` file is structurally complete and idempotent. It must be **validated in a rolled-back transaction** against the linked DB (confirms it parses + runs with zero changes), then promoted.

**Step 4.1 — Validate (rolled back, harmless):**
```bash
cd /Users/mac/regco-insight-suite-new
supabase db query --linked "BEGIN; $(cat supabase/migrations/_drafts/20260714010330_remote_schema.sql.full) ROLLBACK;"
```
If the classifier blocks `db query`, fall back to the **Supabase SQL Editor**: paste the entire `.full` file content wrapped in `BEGIN; ... ROLLBACK;` and run. Look for: no errors, and (since it's already applied) zero object changes.

**Step 4.2 — Promote + commit (only after 4.1 passes):**
```bash
cd /Users/mac/regco-insight-suite-new
mv supabase/migrations/_drafts/20260714010330_remote_schema.sql.full \
   supabase/migrations/20260714010330_remote_schema.sql
# (overwrites the empty 0-byte file)
git add supabase/migrations/20260714010330_remote_schema.sql
git rm supabase/migrations/_drafts/transform_constraints.py   # optional cleanup
git commit -m "fix: restore baseline schema migration for reproducibility (full reconstruction)"
supabase migration list --linked   # expect 7 applied, unchanged
```
**Important:** Do NOT run `supabase db push` to re-apply. The empty baseline is already tracked as applied; this file change is a git-only reproducibility fix (IF NOT EXISTS / DO guards make re-apply harmless anyway).

---

## 5. READY-TO-PASTE PROMPTS FOR THE NEXT AGENT

Paste these one at a time into the new Qwen Code window (after it has read this file).

### Prompt A — finalize baseline (P0 #1)
> Read `/Users/mac/regco-insight-suite-new/HANDOFF_SECURITY_CONTINUATION.md` section 4. Validate the draft baseline `supabase/migrations/_drafts/20260714010330_remote_schema.sql.full` in a rolled-back transaction against the linked Supabase DB (use `supabase db query --linked` or the Supabase SQL Editor if the classifier blocks). If it parses with zero changes, move it to `supabase/migrations/20260714010330_remote_schema.sql` (overwriting the empty one), commit, and confirm `supabase migration list --linked` shows 7 applied. Do NOT re-apply via `db push`.

### Prompt B — rotate crypto secrets (P0 #2)
> In `/Users/mac/regco-insight-suite-new`, draft a new migration in `supabase/migrations/_drafts/` that rewrites `public.fn_decrypt_pii` and `public.fn_hash_bvn` to be **fail-closed**: raise an exception when `app.enc_key` / the pepper is unset instead of coalescing to a hardcoded known key (`'change-me-32-char-enc-key-in-vault'`, `'prod-pepper-change-me-in-vault'`). The pepper/key must come from Vault (`current_setting('app.enc_key')` with no fallback). Validate in a rolled-back txn, then move to `supabase/migrations/` and commit. Note the `app_role` enum is `('admin','user','compliance_lead')`.

### Prompt C — wire CAC guard into edge function (P0 #3)
> Edit `/Users/mac/regco-insight-suite-new/supabase/functions/cac-lookup/index.ts`. After fetching the customer with `service_role`, call `fn_user_owns_customer(auth.uid(), customer_id)` and return 403 if false. Remove the broken `profiles.institution_id` lookup (that column does not exist). Then `supabase functions deploy cac-lookup`. Verify the deployed function enforces ownership.

### Prompt D — close verify_jwt=false gaps (P0 #4)
> For each of these edge functions in `/Users/mac/regco-insight-suite-new/supabase/functions/`: `receive-transaction`, `screen-customer`, `regco-txn-ingest`, `onboard-client`, `send-demo-notification` — add JWT verification (or set `verify_jwt = true` in `supabase/config.toml` where appropriate) and tenant ownership checks using the existing `has_institution_access` / `fn_user_owns_customer` helpers. Also lock `Access-Control-Allow-Origin` to the Vercel domain (currently `*`). Redeploy each.

### Prompt E — remaining P1/P2
> Continue the P1 list from section 3: real NFIU gateway + GoAML 4.0 XSD validation, PII decryption UI + key custody, login lockout wiring, CORS lockdown, then P2 test suite. Refer to `/Users/mac/regco-insight-suite-new/HANDOFF_SECURITY_CONTINUATION.md` for full context and constants.

---

## 6. VERIFICATION COMMANDS (reuse throughout)
```bash
# Confirm applied migrations count (expect 7)
supabase migration list --linked

# Confirm a function exists on live DB
supabase db query --linked "SELECT proname FROM pg_proc WHERE proname = 'fn_user_owns_customer';"

# Confirm all tables have RLS on
supabase db query --linked "SELECT count(*) FROM pg_tables t JOIN pg_class c ON c.relname=t.tablename WHERE t.schemaname='public' AND c.relrowsecurity=false;"

# Redeploy an edge function
supabase functions deploy <function-name>
```

---

## 7. HONEST STATUS / WHAT IS NOT DONE
- The `.full` baseline is **not yet validated or committed**.
- Crypto secrets are **still hardcoded fallbacks** (fail-open risk).
- `cac-lookup` edge code is **not yet wired** to the ownership guard.
- 5 edge functions are **still `verify_jwt=false`** / unauthenticated.
- NFIU reporting is **still mocked** (`NFIU-ACK-xxx`, no real gateway/XSD).
- No PII decryption UI; no login lockout wired; CORS is `*`.
- No automated test suite for security-critical paths.

Do not claim "completely secure" until P0 items 1–4 are closed and verified.
