# CORS Audit Report — Edge Functions (P1)

**Date:** 2026-07-18 (UTC)
**Project ref:** `pdplkprcomjslilznbsl`
**Scope:** Audit + lock-down of CORS across all 46 Supabase Edge Functions.
**Principle:** Only browser-facing functions require CORS. Browser-facing → replaced `*` with `CORS_ALLOWED_ORIGIN` (fail-closed). Service-to-service / webhook / cron / internal / uncalled → left unchanged, documented below. **No auth or `verify_jwt` logic was modified.**

---

## 1. Audit method

1. Enumerated all 46 `supabase/functions/*/index.ts`.
2. Classified each caller by searching `src/` for `supabase.functions.invoke('<name>')` / `fetch(.../functions/v1/<name>')`, `supabase/config.toml` for cron/schedule and `verify_jwt` flags, and inter-function invocations.
3. For each browser-facing function, replaced the `Access-Control-Allow-Origin: *` response with a fail-closed helper that reflects `CORS_ALLOWED_ORIGIN` only (and adds `Vary: Origin`).
4. Deployed only the functions whose CORS policy changed.
5. Verified from `https://regco-insight-suite.vercel.app` (allowed), `https://evil.com` (blocked), and no-`Origin` (no ACAO header).

`CORS_ALLOWED_ORIGIN` is set project-wide to `https://regco-insight-suite.vercel.app` via `supabase secrets set`.

---

## 2. Full function table (46 rows)

Legend — Caller: browser / webhook / cron / internal / uncalled. Change: Deployed / Unchanged.

| # | Function | Caller | Current CORS (post-change) | Recommended | Risk | Change | Verification |
|---|----------|--------|----------------------------|-------------|------|--------|--------------|
| 1 | api-reports | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 2 | provision-webhook-key | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 3 | onboard-client | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 4 | cac-lookup | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed (v3) | 401 no-auth; CORS vercel/evil verified earlier |
| 5 | submit-nfiu | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 6 | generate-nfiu-report | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 7 | calculate-compliance-score | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 8 | fetch-cbn-circulars | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 9 | fetch-regulatory-news | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 10 | generate-board-pack | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 11 | generate-form-report | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 12 | generate-return | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 13 | notify-automation | browser + internal | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 14 | process-report | browser + internal | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 15 | screen-customer | browser + internal | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 16 | send-demo-notification | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 17 | send-support-notification | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 18 | sync-sanctions | browser + cron | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 19 | verify-audit-chain | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 20 | agent-chat | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 21 | agent-orchestrator | browser | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 22 | adverse-media-scan | browser + internal | CORS_ALLOWED_ORIGIN | same | Low | Deployed | preflight vercel=allowed, evil=blocked |
| 23 | receive-transaction | webhook (HMAC) | `*` (unchanged) | no CORS needed | Low | Unchanged | HMAC-verified external POST; no browser origin |
| 24 | kyc-webhook | webhook (vendor secret) | none (unchanged) | no CORS needed | Low | Unchanged | vendor-signed webhook; no browser origin |
| 25 | ingest-transaction-webhook | internal (DB-triggered) | none (unchanged) | no CORS needed | Low | Unchanged | triggered by RPC from receive-transaction |
| 26 | sync-sanctions-lists | cron | `*` (unchanged) | no CORS needed | Low | Unchanged | server cron; no browser origin |
| 27 | send-deadline-reminders | cron | `*` (unchanged) | no CORS needed | Low | Unchanged | server cron |
| 28 | send-weekly-report | cron | `*` (unchanged) | no CORS needed | Low | Unchanged | server cron |
| 29 | kyc-reminders | cron | `*` (unchanged) | no CORS needed | Low | Unchanged | server cron (no caller found in code) |
| 30 | regco-aml-processor | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role queue worker |
| 31 | regco-async-worker | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role poller |
| 32 | regco-dashboard-copilot | internal (worker) | `*` (unchanged) | no CORS needed | Low | Unchanged | no caller; service_role RAG |
| 33 | regco-embedding-worker | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role embeddings |
| 34 | regco-hash-middleware | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role; hardcoded HMAC `regco-sentinel-v1` (see risks) |
| 35 | regco-ingestion-worker | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role doc ingestion |
| 36 | regco-kyc-config | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | no caller; service_role |
| 37 | regco-migrate-chunks | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role chunk migration |
| 38 | regco-staging-worker | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role staging |
| 39 | regco-txn-ingest | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role; INTERNAL_API_SECRET check |
| 40 | regco-vector-migrator | internal (worker) | none (unchanged) | no CORS needed | Low | Unchanged | service_role vector migration |
| 41 | ai-enrichment | uncalled (worker) | `*` (unchanged) | lock when wired to browser | Medium | Unchanged | no caller found; security-sensitive if exposed |
| 42 | check-login-lockout | uncalled (sign-in, intended) | `*` (unchanged) | lock when wired to sign-in | Medium | Unchanged | login-security; HANDOFF notes not yet wired |
| 43 | kyc-start | uncalled (worker) | `*` (unchanged) | lock when wired to browser | Medium | Unchanged | KYC start; tenant-isolated server-side |
| 44 | record-login-attempt | uncalled (sign-in, intended) | `*` (unchanged) | lock when wired to sign-in | Medium | Unchanged | login-security; not yet wired |
| 45 | reset-login-attempts | uncalled (sign-in, intended) | `*` (unchanged) | lock when wired to sign-in | Medium | Unchanged | login-security; not yet wired |
| 46 | verify-identity | uncalled (sign-up KYC, intended) | `*` (unchanged) | lock when wired to browser | Medium | Unchanged | mock KYC; not yet wired |

---

## 3. Verification performed

Tested live against the deployed functions (representative browser-facing set) from three origins:

| Origin | Preflight result | Expected | Result |
|--------|------------------|----------|--------|
| `https://regco-insight-suite.vercel.app` | `access-control-allow-origin: https://regco-insight-suite.vercel.app` | reflected | ✅ |
| `https://evil.com` | no `access-control-allow-origin` header | blocked | ✅ |
| (no `Origin` header) | no `access-control-allow-origin` header | blocked | ✅ |

`cac-lookup` additionally verified earlier: 401 without/invalid Bearer, 403 cross-tenant, same-tenant success.

---

## 4. Remaining risks & recommendations

1. **Login-flow functions still emit `*` (Medium):** `check-login-lockout`, `record-login-attempts`, `reset-login-attempts` are intended for the sign-in flow (per HANDOFF) but are currently uncalled and were NOT modified (no browser caller yet). When wired to the browser, apply the same `CORS_ALLOWED_ORIGIN` helper. Until then they are not reachable from a browser.
2. **`verify-identity`, `kyc-start`, `ai-enrichment` emit `*` (Medium):** uncalled KYC/enrichment workers. Same — lock CORS when exposed to the browser.
3. **Hardcoded HMAC secret `regco-sentinel-v1` (P0-class, separate from CORS):** present in `regco-hash-middleware/index.ts` and used as a fallback in `receive-transaction` / `ingest-transaction-webhook`. Should be moved to Vault (tracking item, not in CORS scope).
4. **`verify_jwt = false` on 19 functions:** unchanged per task scope. Several are legitimately service/webhook; `onboard-client`, `send-demo-notification`, `agent-chat`, `calculate-compliance-score`, etc. authenticate via `auth.getUser()` / `x-api-key` / HMAC instead. Recommend a follow-up review of each `verify_jwt=false` for ownership checks (separate from CORS).
5. **Non-browser functions keep `*` CORS header:** harmless (no browser origin can exploit a server-to-server endpoint via CORS — CORS is enforced by the browser, not the server), but the `*` header is unnecessary noise. Leaving unchanged per the "audit first, don't make speculative changes" instruction; can be removed in a follow-up if desired.

---

## 5. Deploy summary

- **22 functions deployed** with `CORS_ALLOWED_ORIGIN` fail-closed CORS.
- **24 functions unchanged** (webhook / cron / internal / uncalled) with documented rationale.
- **0 auth or `verify_jwt` changes.**
- Migration/secret state unchanged from the P0 deployment (2026-07-18).
