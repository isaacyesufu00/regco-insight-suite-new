# Schema-driven CBN report template system

Replace per-return hand-coded TS modules with one **template-driven** generator. A return is defined as a row in a new `report_templates` table whose `definition` JSONB describes data sources, required fields, and output layout. Adding a new CBN form becomes a SQL insert + admin UI edit — no code change, no redeploy.

## Why

The previous plan needed 11 TS modules × 4 formats. That doesn't scale to "any CBN form". A schema-driven engine lets compliance officers add or amend forms (the regulator changes them yearly) without an engineering cycle.

## Template shape

```jsonc
// report_templates.definition (jsonb)
{
  "code": "CBN_MPR",
  "title": "Monetary Policy Return",
  "regulator": "CBN",
  "frequency": "monthly",
  "version": 1,
  "period": { "kind": "month" },           // day | week | month | quarter | year | event
  "parameters": [                          // user-supplied at request time
    { "key": "car_pct",       "label": "Capital Adequacy Ratio (%)", "type": "number", "required": true },
    { "key": "liquidity_pct", "label": "Liquidity Ratio (%)",        "type": "number", "required": true }
  ],
  "sources": [                              // declarative DB pulls; engine runs them, no SQL injection
    {
      "id": "tx",
      "table": "unified_transactions",
      "select": "id,amount,currency,transaction_type,channel,branch_code,customer_id,customer_name,account_number,transaction_date,narration,description",
      "filters": [
        { "col": "transaction_date", "op": "gte", "value": "${period.start}" },
        { "col": "transaction_date", "op": "lt",  "value": "${period.end}"   }
      ]
    },
    { "id": "customers", "table": "customers", "select": "id,bvn,date_of_birth,full_name", "join_on": { "source": "tx", "local": "id", "foreign": "customer_id" } }
  ],
  "readiness": [                            // missing-field rules, run against pulled data
    { "rule": "field_present", "source": "tx",        "field": "branch_code",       "label": "branch_code" },
    { "rule": "field_present", "source": "customers", "field": "bvn",               "label": "customer.bvn" },
    { "rule": "min_rows",      "source": "tx",        "min": 1,                     "label": "transactions for period" }
  ],
  "layout": {                               // shared by xlsx/csv/pdf renderers
    "cover": [
      { "label": "Institution",   "value": "${institution.name}" },
      { "label": "Period",        "value": "${period.label}" },
      { "label": "CAR",           "value": "${params.car_pct}%" }
    ],
    "sections": [
      {
        "id": "transactions",
        "title": "Cash Transactions",
        "type": "table",
        "source": "tx",
        "columns": [
          { "header": "Date",     "value": "${row.transaction_date|date}" },
          { "header": "Branch",   "value": "${row.branch_code}" },
          { "header": "Amount",   "value": "${row.amount|naira}" }
        ]
      }
    ]
  },
  "xml": {                                  // optional regulator XML mapping (goAML/eFASS)
    "root": "report",
    "namespaces": { "xmlns": "http://goaml.unodc.org/" },
    "elements": [
      { "name": "report_code", "value": "CBN_MPR" },
      { "name": "period",      "value": "${period.label}" },
      { "name": "transactions",
        "repeat_source": "tx",
        "child": { "name": "transaction", "elements": [
          { "name": "id",     "value": "${row.id}" },
          { "name": "amount", "value": "${row.amount}" }
        ]}
      }
    ]
  },
  "formats": ["xlsx", "csv", "pdf", "xml"]   // which renderers are enabled
}
```

A tiny expression language — `${path|filter}` — is enough. Filters: `date`, `datetime`, `naira`, `upper`, `lower`, `default:<x>`. No arbitrary JS; the engine walks the JSON.

## Engine

New edge function `generate-return` (single function, no per-return code):

```text
template = report_templates.get(code)
period   = resolvePeriod(template.period, requestedPeriod)
data     = runSources(template.sources, period, ctx)      // typed Supabase calls, never raw SQL
checks   = runReadiness(template.readiness, data)         // -> { ready, missing_fields[] }
if (!checks.ready && !approveOverride) return checks
out = {
  xlsx: renderLayoutXlsx(template.layout, data, params, ctx),
  csv:  renderLayoutCsv (template.layout, data, params, ctx),
  pdf:  renderLayoutPdf (template.layout, data, params, ctx),
  xml:  template.xml ? renderXml(template.xml, data, params, ctx) : undefined,
}
upload(out) -> reports row + signed URLs + case_events audit hash
```

All four renderers iterate the **same layout/xml object**, so adding a return type means inserting a template row and the generator produces every format automatically.

## Filters and safety

The `filters[]` array is a whitelist: `eq | neq | gt | gte | lt | lte | ilike | in`. The engine maps these to `PostgrestFilterBuilder` calls — no string concatenation, no `rpc('execute_sql')`. Columns and tables are validated against a per-template allowlist before any query runs.

## Versioning

`report_templates` rows are immutable per `(code, version)`. Edits create a new `version`; old generated reports keep a `template_version` pointer for audit reproducibility.

## Admin authoring UI

`/dashboard/admin/templates` (admin-only, gated by `has_role('admin')`):
- List of templates with `code`, `version`, regulator, status (`draft|active|archived`).
- JSON editor (Monaco) with live schema validation against the template-schema Zod definition (so officers can't ship a broken template).
- "Validate against sample data" button: runs the readiness + a renderer dry run and shows the resulting XLSX preview.
- "Activate" promotes a draft to active; only one active version per code at a time.

Officers without admin role pick from active templates only.

## Database changes (single migration)

- `report_templates`
  - `id uuid pk`, `code text not null`, `version int not null default 1`, `regulator text`, `frequency text`,
    `definition jsonb not null`, `status text not null default 'draft'` (`draft|active|archived`),
    `created_by uuid`, `created_at`, `updated_at`,
    `unique(code, version)`.
- `reports`: add `template_id uuid references report_templates(id)`, `template_version int`.
- Seed one template per row already in `filing_schedules` (11 starter templates, all `status='active'`, version 1). NFIU_CTR ships with the readiness rules from the existing check; the rest start minimal and are extended in the admin UI.
- RLS:
  - `report_templates`: `SELECT` to authenticated for `status='active'`; full CRUD only to `has_role(auth.uid(),'admin')`. `service_role` full.

## Files

**New**
- `supabase/functions/generate-return/index.ts`
- `supabase/functions/generate-return/engine/{expr.ts,sources.ts,readiness.ts,layout.ts,xml.ts,xlsx.ts,csv.ts,pdf.ts,upload.ts}`
- `supabase/functions/_shared/template-schema.ts` (Zod schema for `definition`, shared by engine + admin UI validation via codegen or duplicated)
- `src/pages/admin/Templates.tsx`, `src/components/admin/TemplateEditor.tsx`
- `src/hooks/useReportTemplates.ts`

**Edited**
- `supabase/functions/agent-orchestrator/index.ts`:
  - `list_return_types` tool now reads `report_templates` where `status='active'`.
  - `check_return_readiness` calls the engine's `runReadiness` (no per-type code).
  - `request_generate_return` records the chosen `template_id` + `formats[]` + `params` into `report_requests`.
- `src/components/dashboard/AgentRail.tsx`: approval chip invokes `generate-return` with `request_id`, renders download URLs.
- `src/pages/dashboard/MyReports.tsx`: "Generate return" button → wizard reads parameter schema from `report_templates.definition.parameters` and renders the form dynamically (no per-return UI code).

## Verification

- Deno tests for the engine with two fixture templates: one minimal (CTR), one with XML mapping.
- Snapshot tests for `renderXml` and `renderLayoutCsv` against golden files.
- Manual: insert a new "CBN_TEST" template via admin UI → it immediately appears in the agent's return list and the wizard, with no code change or redeploy.

## Out of scope

- Form *intake* for the regulator portal (we still produce the file; officer uploads).
- Cross-period aggregations beyond `sum/count/min/max` filter values — handled in a later "computed sources" phase.
- Multi-language templates.

## Effort order

1. Migration + seed 11 active templates from `filing_schedules`.
2. Engine: expression/filter eval, sources, readiness, csv + xlsx renderers.
3. Generic XML renderer + PDF renderer.
4. `generate-return` edge function + agent wiring.
5. Dashboard wizard reading from `report_templates`.
6. Admin authoring UI (last — engine works without it; SQL inserts are a fallback).
