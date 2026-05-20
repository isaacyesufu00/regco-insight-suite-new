## Goal

Add form-based generation (no CBS upload) for 3 report types — **SCUML Annual Compliance**, **NDIC Premium Return**, **NDIC Single Obligor** — inside the existing `/dashboard/new-report` wizard. Generated output uses the AI Gateway with the exact prompts you supplied.

## Flow changes in `NewReport.tsx`

Current flow assumes CBS file upload. For these 3 report types, the wizard branches:

```
Step 1 (Regulator tab + Type)
  → if reportType ∈ FORM_BASED_TYPES:
      Step 2: Period selector (Year only for SCUML/Premium, Quarter+Year for Single Obligor)
      Step 3: Custom form (sections A–G / A–E)
      Step 4: Processing → Ready (DOCX download)
  → else: existing CBS-upload path (unchanged)
```

`FORM_BASED_TYPES = ["SCUML Annual Compliance", "NDIC Premium Return", "Single Obligor Report"]`.

The "SCUML Annual Compliance" type label in `REPORT_TYPES_BY_REGULATOR.SCUML[0]` becomes the canonical name shown on the card with the description you supplied.

## New files

1. **`src/components/reports/SCUMLForm.tsx`** — Sections A–G, all fields listed (Yes/No radios, dates, numbers, textarea, two certification checkboxes). Returns a typed payload on submit.
2. **`src/components/reports/NDICPremiumForm.tsx`** — Sections A–E with live auto-calc:
   - Total insured deposits = Total – Uninsured
   - Premium payable = insured × 0.40% (rate read-only)
   - Section D total auto-sum
3. **`src/components/reports/NDICSingleObligorForm.tsx`** — Sections A–E with dynamic exposures table (add/remove rows, ≥1 required), live computations for exposure %, totals, largest exposure, single obligor limit = 5% × capital base.
4. **`src/components/reports/FormShell.tsx`** — Shared section header + field primitives so the three forms stay consistent with the dashboard's EigenPal black-and-white aesthetic (`#F5F5F0` bg, `#0A0A0A` text, `Inter`, hairline borders).
5. **`supabase/functions/generate-form-report/index.ts`** — New edge function:
   - JWT-verified, derives `user_id` from `sub` claim
   - Validates body with Zod (`{ report_id, report_type, form_payload, period_label }`)
   - Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with the exact system prompt matching the report type (SCUML / NDIC Premium / Single Obligor templates you provided)
   - Wraps the generated text into a `.docx` via the `docx` npm package, uploads to `reports` bucket at `${user_id}/${report_id}.docx`, updates `reports` row: `status='Ready'`, `report_url=path`, `generated_at=now()`
   - On error: updates row to `status='failed'` with `error_message`

## `NewReport.tsx` integration

- New `submitFormReport(payload)` path: inserts a `reports` row with `status='processing'`, then invokes `generate-form-report`. Re-uses the existing Step 4 polling block (`status === 'ready'` → download URL via signed URL since reports bucket is private).
- The existing CBS-upload `handleSubmit` and Step 2/3 UI remain untouched for the other 13 report types.

## Data & calculations (technical)

- All money inputs accept plain numbers; format as `₦` with `Intl.NumberFormat('en-NG')` for display only.
- Single Obligor exposure rows: `exposure_pct = (outstanding / capital_base) * 100`, computed on render.
- SCUML KYC percentages: `(complete / total) * 100`, shown next to the inputs.

## Security

- Edge function uses service role only server-side; client uses anon key.
- All form data validated server-side with Zod before AI call.
- `reports` row is created client-side with `user_id = auth.uid()` (existing RLS allows this).
- Signed URLs (1h) for downloads, matching existing memory rule.

## Out of scope (will not change)

- Existing CBS upload path
- Reports list, dashboard, sidebar
- Memory references to n8n/webhooks etc. — generation routed through the new edge function, surfaced to users as "RegCo generation engine".

## Deliverables

5 new files, edits to `NewReport.tsx`, one Supabase migration only if needed (none expected — `reports` table already has all columns used).