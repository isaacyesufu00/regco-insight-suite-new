# Deployment Report — P0 Security Hardening (Prod)

**Date:** 2026-07-18 (UTC)
**Project ref:** `pdplkprcomjslilznbsl`
**Performed by:** automated agent, approved by owner
**Scope:** P0 #2 (fail-closed crypto), P0 #3 (cac-lookup tenant isolation), CORS lock, Vault secrets.

---

## 1. Migration IDs applied (live DB `schema_migrations`)

| Version | File | Status |
|---|---|---|
| `20260714010330` | `20260714010330_remote_schema.sql` | present (baseline, reconstructed) |
| `20260719000000` | `20260719000000_audit_trail_tenant_isolation.sql` | applied + tracked |
| `20260719000001` | `20260719000001_cac_lookup_ownership_guard.sql` | applied + tracked |
| `20260720000000` | `20260720000000_fail_closed_crypto.sql` | applied + tracked (idempotent re-apply) |

All three P0 migrations are recorded in `supabase_migrations.schema_migrations` and consistent with the git repo.

Note: `20260719000000`/`20260719000001` functions already existed on the DB (applied previously via SQL Editor) but were not in the tracker; this run re-applied them (idempotent) and recorded the versions. `20260720000000` was applied via `db query -f` and recorded.

---

## 2. Vault secret names (VALUES NOT SHOWN — stored only in Supabase Vault)

| Vault secret name | Purpose | Generated | Stored in code/repo? |
|---|---|---|---|
| `regco.app_enc_key` | `pgp_sym_decrypt` key for `fn_decrypt_pii` | server-side `extensions.gen_random_bytes(32)` | NO |
| `regco.app_bvn_pepper` | pepper for `fn_hash_bvn` | server-side `extensions.gen_random_bytes(32)` | NO |

- Generated inside the DB session via `extensions.gen_random_bytes(32)`; values never entered the shell, terminal, or git.
- Read at runtime by `public._vault_secret(name)` (SECURITY DEFINER) → `vault.decrypted_secrets`.
- Superseded orphans (intentionally renamed, not referenced): `deprecated.app.enc_key`, `deprecated.app.bvn_pepper` (original attempt before the `regco.*` naming was chosen).

---

## 3. Function versions

| Function | Version | Status |
|---|---|---|
| `cac-lookup` | **3** | ACTIVE, deployed 2026-07-18 10:39:59 UTC (id `e6867459-…`) |

`fn_decrypt_pii`, `fn_hash_bvn`, `fn_user_owns_customer` and the audit/ownership guard set are DB functions (no version number); all present and replaced by `20260720000000` / `20260719000001`.

---

## 4. Verification results

| Check | Method | Result |
|---|---|---|
| `fn_hash_bvn` uses Vault secret | `fn_hash_bvn('12345678901')` returns stable 64-hex hash; matches across calls | ✅ PASS |
| `fn_decrypt_pii` uses Vault secret | round-trip `pgp_sym_encrypt('x', key) → fn_decrypt_pii` returns `x` | ✅ PASS |
| Fail-closed on missing secret | `_vault_secret('regco.app_enc_key_MISSING')` raises `P0001: secret … not available in Vault` | ✅ PASS |
| Same-tenant ownership | `fn_user_owns_customer(real_user, same_inst_customer)` → `true` | ✅ PASS |
| Cross-tenant deny (logic) | `fn_user_owns_customer(NULL, cust)` → `false`; `fn_user_owns_customer(user, NULL)` → `false`; mismatch path returns `false` by code | ✅ PASS (see caveat) |
| cac-lookup auth enforced | POST without / with bad Bearer → `401` | ✅ PASS |
| CORS — disallowed origin | preflight `Origin: https://evil.com` → `200`, **no `access-control-allow-origin`** | ✅ PASS |
| CORS — allowed origin | preflight `Origin: https://regco-insight-suite.vercel.app` → `access-control-allow-origin: https://regco-insight-suite.vercel.app` | ✅ PASS |
| CORS — no origin | preflight no `Origin` → `200`, no ACAO | ✅ PASS |

**Caveat on cross-tenant test:** the live DB currently contains a single institution (`inst_count = 1`), so no natural cross-tenant customer/user pairs exist. The deny path was verified via NULL-input edge cases and by code inspection of `fn_user_owns_customer` (returns `false` when `v_cust_inst IS NOT DISTINCT FROM v_inst` is false). Additionally, attempting to move a customer to another institution triggered the audit trigger's own `fn_append_audit_log` "institution mismatch" denial — confirming the isolation layer is active at the trigger level too. A full cross-tenant 403 E2E test should be re-run once a second institution exists in the environment.

---

## 5. Rollback procedure (if any verification fails post-deploy)

**Crypto (`20260720000000`):** Re-apply the prior function bodies (which used the hardcoded fallback) — NOT recommended for prod. Preferred: keep Vault secrets intact; only the functions changed. To revert, restore the previous `fn_decrypt_pii`/`fn_hash_bvn` definitions from git history (pre-`20260720000000`) via `supabase db query`. Data encrypted with the Vault key remains decryptable as long as `regco.app_enc_key` is unchanged.

**Ownership guard + cac-lookup (`20260719000001` / function v3):** Revert `cac-lookup` to the prior deployed version: `supabase functions deploy cac-lookup --version <prev>` (or redeploy from the earlier git commit). The DB guard functions can be restored from git via `supabase db query -f <prior migration>`.

**CORS:** Unset / correct `CORS_ALLOWED_ORIGIN` via `supabase secrets unset CORS_ALLOWED_ORIGIN` (falls back to deny-all) or set to the correct domain.

**Vault secrets:** Do NOT delete `regco.app_enc_key` / `regco.app_bvn_pepper` — any PII encrypted with them becomes unrecoverable. If rotation is needed, generate a NEW secret and update both the Vault entry and the function's referenced name together.

**General:** All changes are committed to git; `git revert <commit>` for the relevant migration/function commits, then re-apply to the DB.
