# Regulatory return generation — full pipeline

Build one unified, approval-gated pipeline that can produce **XML, XLSX, CSV, and PDF** for all 11 returns in the catalog, exposed from both the **agent rail** and a new **dashboard wizard**. Existing infrastructure (`generate-form-report`, `process-report`, `reports` table) is reused — not replaced.

## Architecture

```text
┌──────────────────┐    ┌──────────────────────┐
│ Agent rail       │    │ /dashboard/my-reports│
│ (chat + chip)    │    │ "Generate return"    │
└────────┬─────────┘    └─────────┬────────────┘
         │                        │
         │  request_generate_return / form submit
         ▼                        ▼
   ┌──────────────────────────────────────────┐
   │ report_requests row (status='pending')   │  ← approval-gated
   │   return_type · period · formats[] · params│
   └────────────────────┬─────────────────────┘
                        │ officer Approves
                        ▼
        ┌───────────────────────────────────┐
        │ Edge fn: generate-return          │
        │  1. resolveSchedule()             │
        │  2. checkReadiness()  (per-type)  │
        │  3. buildPayload()    (per-type)  │
        │  4. renderXml/Xlsx/Csv/Pdf()      │
        │  5. upload to reports bucket      │
        │  6. insert reports row + URLs     │
        │  7. case_events hash (audit)      │
        └───────────────────────────────────┘
```

### New edge function: `generate-return`
- One entry point, dispatches per `return_type`.
- Internal modules under `supabase/functions/generate-return/returns/<code>.ts`, each exporting:
  - `requiredFields`, `readiness(ctx, period)` → `{ ready, missing_fields }`
  - `buildPayload(ctx, period, params)` → strongly-typed object
  - `renderXml(payload)`, `renderRows(payload)` (for xlsx/csv), `renderPdfSections(payload)`
- Shared helpers:
  - `formats/xml.ts` — handcrafted templates per regulator schema (NFIU goAML v4.0.2, CBN eFASS, NDIC, FIRS).
  - `formats/xlsx.ts` — SheetJS / `xlsx` npm via Deno's `npm:` specifier.
  - `formats/csv.ts` — plain text writer.
  - `formats/pdf.ts` — `npm:pdfkit` (already proven works in Deno) with a shared cover page + signature block.
  - `storage.ts` — upload to `reports` bucket, return 1h signed URLs.

### Return modules shipped in this pass (all 11 catalog entries)

| Code | Format support | Notes |
|---|---|---|
| `NFIU_STR` | XML (goAML), PDF | Per-case; requires `case_id`. Maps `cases` + `unified_transactions` + `customers`. |
| `NFIU_CTR` | XML (goAML), XLSX, CSV, PDF | Daily aggregation, ≥ NGN 5M individual / 10M corporate. Readiness already implemented — wire into payload. |
| `CBN_MPR` | XLSX (eFASS template), PDF | Monthly. CAR, liquidity ratio, NPL ratio from `compliance_scores`/manual params. |
| `CBN_FX`  | XLSX, CSV, PDF | Weekly FX position. |
| `NDIC_PREM` | XLSX, PDF | Reuses existing `generate-form-report` SCUML/NDIC template engine for the text body, plus structured XLSX. |
| `NDIC_SO` | XLSX, CSV, PDF | Single obligor; pulls aggregated exposure by `customer_id`. |
| `SCUML_ANN` | PDF, XLSX | Reuses existing SCUML text template; wraps as PDF. |
| `FIRS_VAT` / `FIRS_PAYE` / `FIRS_WHT` / `FIRS_CIT` | XLSX, CSV, PDF | Tax returns; XML deferred (FIRS portal accepts XLSX). |

Each module has a strict `requiredFields` list. When `readiness()` returns gaps, the orchestrator reports them per-field (same shape as the CTR check already returns).

### Approval gate (mandatory for every return)
1. Officer triggers via chat or wizard → `report_requests` row inserted with `status='pending_approval'`, `metadata={ return_type, period, formats, params }`.
2. Agent rail renders the existing `MutationApproval` chip showing return type, period, requested formats, and the readiness summary.
3. On **Approve**, frontend calls `generate-return` edge function with `request_id`. The function re-verifies the row belongs to the caller, re-runs readiness, and only proceeds if `ready=true` (officer can still approve with warnings, recorded in audit).
4. On success: `reports` row inserted with `pdf_url`/`xlsx_url`/`file_url` (XML) + `report_filename`; `case_events` hash chain extended with `{event_type:'return_generated', payload:{request_id, return_type, hashes}}`.
5. Officer downloads from chat chip and from the My Reports table.

### Dashboard wizard (`/dashboard/my-reports`)
- New `GenerateReturnDialog` opened by a primary button.
- Steps: **Return type** (grouped by regulator) → **Period** (picker matched to frequency) → **Formats** (multi-select, defaulted per return) → **Parameters** (return-specific fields: e.g. CBN_MPR asks for CAR/Liquidity/NPL overrides; NFIU_STR asks for `case_id`) → **Review readiness** (calls the same readiness check, shows missing fields) → **Submit for approval**.
- Same backend path; submission lands in the agent rail's approval chip (and is also visible as a `pending_approval` row in the Returns table). Either surface can approve.

### Output formats — concretely
- **XML**: per-regulator templates with strict element ordering. goAML for NFIU uses the published v4.0.2 schema. Each XML render is unit-tested with a sample payload (Deno.test under each module).
- **XLSX**: workbook with a *Cover* sheet (institution, period, certifier) + one or more *Data* sheets matching the regulator template columns.
- **CSV**: data sheet only, headers row 1.
- **PDF**: cover page + structured tables + signature block. Generated with `npm:pdfkit`; for SCUML/NDIC the existing text template is rendered into the PDF body.

## Database changes

Single migration:
- `report_requests`: add `formats text[] not null default '{}'`, `params jsonb not null default '{}'`, `readiness jsonb`, `approved_at timestamptz`, `approved_by uuid`, `report_id uuid references public.reports(id)`. Index on `(user_id, status)`.
- `reports`: add `return_type text`, `xml_url text`, `csv_url text` (pdf_url/xlsx_url/file_url already exist). Index on `(user_id, return_type, period_start)`.
- RLS unchanged — both tables already user-scoped.

## Files touched / added

**New**
- `supabase/functions/generate-return/index.ts` — entry point + dispatcher.
- `supabase/functions/generate-return/_shared/{readiness,storage,audit,periods}.ts`.
- `supabase/functions/generate-return/formats/{xml,xlsx,csv,pdf}.ts`.
- `supabase/functions/generate-return/returns/{nfiu_str,nfiu_ctr,cbn_mpr,cbn_fx,ndic_prem,ndic_so,scuml_ann,firs_vat,firs_paye,firs_wht,firs_cit}.ts`.
- `src/components/reports/GenerateReturnDialog.tsx` + step components.
- `src/hooks/useGenerateReturn.ts`.

**Edited**
- `supabase/functions/agent-orchestrator/index.ts` — `request_generate_return` accepts `formats[]` + `params`; persists into `report_requests`. Add `list_return_types` tool so the agent can enumerate options. `check_return_readiness` delegates to the per-type modules so STR/MPR/etc. also return structured `missing_fields`.
- `src/components/dashboard/AgentRail.tsx` — `MutationApproval` for `request_generate_return` posts to `generate-return` and renders the download links from the response.
- `src/pages/dashboard/MyReports.tsx` (or equivalent) — "Generate return" button + pending-approval row state.

## Out of scope (explicit follow-ups)
- Direct portal submission (NFIU goAML upload, CBN eFASS upload). We produce the file; officer uploads.
- Institution-level configuration of CTR thresholds, certifier names, branch lists — using sane defaults + per-request overrides for now.
- FIRS XML (portal accepts XLSX today).
- Multi-officer dual-approval workflow.

## Verification
- Per-module Deno tests with golden XML/XLSX/CSV fixtures.
- End-to-end manual: in agent rail, "Generate CTR for yesterday in XML and XLSX" → chip → Approve → two files downloadable. Repeat from wizard with `CBN_MPR` for 2026-05.
- Confirm `case_events` row created and `reports` row visible in My Reports.

## Effort note
This is a multi-step build (11 return modules × up to 4 formats + wizard + approval wiring). I will land it in this order so you have working value at each checkpoint:
1. Migration + `generate-return` skeleton + shared format helpers.
2. `NFIU_CTR` and `NFIU_STR` end-to-end (XML + XLSX + CSV + PDF) wired through agent rail.
3. `CBN_MPR`, `CBN_FX`.
4. `NDIC_PREM`, `NDIC_SO`, `SCUML_ANN` (reusing existing template engine).
5. FIRS quartet.
6. Dashboard wizard.

If you'd rather get the wizard earlier or trim coverage to ship faster, say so before I start.
