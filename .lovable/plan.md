# Fix "VITE_SUPABASE_URL is missing" + finish file-attachment work

## Root cause of the new error
The `NOT_FOUND lhr1::...` page is served by Vercel/Lovable's published host, not Supabase. It appears because the **published build has no `VITE_SUPABASE_URL`**, so `AgentRail.tsx` falls back to an empty `FUNCTION_URL`, the agent POST hits a relative path, and the host returns its 404 page.

Why it's missing in the published build: this is a classic Vite project where `.env` exists locally (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` are all set) but `.env` is listed in `.gitignore` (line 25). The sandbox preview works because `.env` is on disk; the published deploy ships without it.

## Fix
1. **Remove `.env` from `.gitignore`** so the Vite build at publish time embeds `VITE_SUPABASE_*` into the bundle. (Values are publishable anon keys, safe to commit — this is the standard Lovable + Vite pattern.)
2. After the edit, **republish** from the Publish dialog so the new build picks them up. Sandbox preview keeps working as-is.
3. No code changes to `AgentRail.tsx` for this fix — the existing env guard already shows the correct red banner; we just need the env to actually be present in prod.

## Bundled with this: the original file-attachment feature
Same scope as the previous plan, frontend-only edits to `src/components/dashboard/AgentRail.tsx`:

- Remove the **calendar icon button** + `Calendar` import from the rail header (keep Settings).
- Wire the **`+` button** to a hidden `<input type="file" multiple>` accepting `.pdf, .xlsx, .xls, .csv, .docx, .txt, .md, .json`.
- Parse each file **client-side to text** and prepend it to the user's message before `sendMessage({ text })`:
  - `pdfjs-dist` for PDFs (worker imported via `?url`)
  - `xlsx` (SheetJS) for spreadsheets → CSV per sheet
  - `mammoth` for `.docx`
  - `file.text()` for `.txt/.md/.json/.csv`
- Limits: max 5 files, 20 MB each, 40k chars per file (truncated with `…[truncated]`).
- Attached files render as chips above the textarea with a × to remove; parsing shows a small spinner chip; submit disabled while parsing.
- Errors (unsupported type, oversize, parser failure) render as red chips that auto-dismiss in 5s.
- `bun add pdfjs-dist xlsx mammoth`.

## Out of scope
- No edge-function or DB changes.
- No image/multimodal attachments (Nemotron is text-only).
- No drag-and-drop.

## Files touched
- `.gitignore` — remove the `.env` line.
- `src/components/dashboard/AgentRail.tsx` — remove calendar button, add attachment UI + parsers.
- `package.json` / `bun.lock` — 3 new deps.
