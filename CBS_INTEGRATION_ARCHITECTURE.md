# CBS Integration Architecture — Easier, More Secure, Less Complex

Proposal to replace the current bank-side signed-push model with a **pull-by-default**
integration that removes the bank's hardest burden (writing crypto inside their CBS)
and centralises all secret custody in RegCo.

Date: 2026-07-20. Supersedes the "Option A / Option B" model in `TransactionMonitor.tsx`.

## Problem with the current model

The live path (`receive-transaction`) requires the bank's CBS to:

1. Implement **HMAC-SHA256 request signing** (custom crypto) inside core banking code —
   the most sensitive, change-controlled system in the bank.
2. **Custody the HMAC secret** inside their perimeter.
3. Handle timestamps, idempotency keys, and header construction per transaction.

This is complicated (custom crypto in CBS), risky (secret inside CBS), and slow to
get through bank security review. A legacy duplicate function
(`ingest-transaction-webhook`) also carried a hardcoded `"regco-sentinel-v1"` fallback
secret — a "looks secure but isn't" trap. That fallback is removed (fail-closed).

## Target model — three tiers, pull-by-default

| Tier | Mechanism | Bank effort | Bank holds secret? |
|---|---|---|---|
| **Pull (default)** | RegCo connects to a bank-provisioned **read-only feed** (DB replica / warehouse view / vendor read-API) using **RegCo-held** credentials and ingests on a schedule | None in CBS — grant read access only | No |
| **File drop (universal fallback)** | Bank exports CBS transactions to a RegCo-owned drop bucket (CSV/SFTP); RegCo ingests | One scheduled export | No |
| **Signed push (real-time, opt-in)** | Bank CBS POSTs per transaction with **standard** auth (mTLS or OIDC client-credentials), not bespoke HMAC | Reuse existing API gateway signing | No (RegCo issues & holds key) |

### Why pull is the right default
- **Zero CBS code changes.** Integration logic lives in RegCo's connector (our code,
  which we can certify), not in the bank's transaction-posting path.
- **Secret stays in RegCo.** The bank never custodies a RegCo secret; RegCo custodies
  the (read-only) feed credential in its Vault.
- **Fits bank security review** — granting read access to an existing feed is a
  standard, low-risk request, unlike modifying CBS posting logic.
- **One ingestion engine.** Both pull and file-drop feed the same
  `ingest_transaction_webhook` RPC, so the rules engine, alerts, case management, and
  GoAML reporting are unchanged.

### Auth standardisation (if push is used)
Replace the hand-rolled `x-signature` HMAC scheme with **mTLS or OIDC
client-credentials** — both are natively supported by bank API gateways, so the bank
reuses existing signing instead of implementing custom crypto. The HMAC path is
retained only as a compatibility shim, and its secret is **fail-closed from Vault**.

## Security invariants (non-negotiable)

1. **No hardcoded secrets.** All secrets (webhook HMAC, feed credentials, PII keys)
   live in Supabase Vault. Functions fail closed (raise) when a secret is absent —
   mirroring `20260720000000_fail_closed_crypto.sql`.
2. **Tenant isolation.** Every ingested row carries `institution_id`; the
   `ingest_transaction_webhook` RPC scopes by it; idempotency is per
   `(institution_id, idempotency_key)`.
3. **Least privilege.** Pull connectors use read-only feed credentials only.
4. **Auditability.** Every ingestion (push or pull) is recorded in
   `receive_transaction_requests` / a `cbs_feed_sync_log`; the immutable audit ledger
   (`AuditLog.tsx`) covers the rest.

## Implementation status

- [x] Fail-closed webhook HMAC secret (Vault-backed, no hardcoded fallback)
- [x] Orphaned legacy `ingest-transaction-webhook` function removed
- [x] `cbs_feed_connections` table + `cbs-pull-connector` edge function (pull scaffold)
- [x] `webhook_hmac_secret()` fail-closed SQL helper
- [ ] Bank-facing connector setup UI (roadmap: pair with dashboard)
- [ ] mTLS/OIDC push shim (roadmap: only if a bank requests real-time push)
