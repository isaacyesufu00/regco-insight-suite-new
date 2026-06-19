## What's going wrong

The "NOT_FOUND lhr1::..." is a Vercel-style 404 from the preview host, not Supabase. Edge logs for `agent-orchestrator` show only `shutdown` with no successful invocations — the function is failing to boot. The likely culprit is the bleeding-edge imports `npm:ai@6` + `npm:@ai-sdk/openai-compatible@2` in Supabase's Deno runtime. When the POST fails, the browser's fallback path hits the Vercel shell and returns `NOT_FOUND lhr1`.

## Fix plan

### 1. Rebuild `agent-orchestrator` on a stable runtime

Rewrite `supabase/functions/agent-orchestrator/index.ts` to:

- Drop `npm:ai@6` and `npm:@ai-sdk/openai-compatible@2`.
- Use a direct `fetch`-based OpenAI-compatible Chat Completions tool-calling loop (the pattern that already deploys reliably in `attached_assets/.../agent-orchestrator`).
- Keep the full tool registry: `list_transactions`, `get_account_velocity`, `explain_alert`, `screen_entity`, `get_customer_360`, `adverse_media_scan`, `get_risk_score`, `open_case`, `add_case_note`, `request_account_freeze`, `draft_investigation_summary`, `get_audit_trail`, `get_filing_deadline`, `check_return_readiness`, `request_generate_return`, `navigate_dashboard`.
- Preserve the SHA-256 case-event hash chain and the inline approval flow already wired in the UI.
- Stream responses back as **SSE in the AI SDK UI message format** so the existing `useChat` frontend in `AgentRail.tsx` keeps working untouched.

### 2. Use OpenRouter with `nvidia/nemotron-3-ultra-550b-a55b:free`

Hardcode the orchestrator to:

- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `nvidia/nemotron-3-ultra-550b-a55b:free`
- Auth: `Authorization: Bearer ${OPENROUTER_API_KEY}` (already in project secrets)
- Required OpenRouter headers: `HTTP-Referer` and `X-Title` for the free tier.

**One caveat to flag honestly:** OpenRouter's `:free` models are heavily rate-limited (typically ~20 requests/min, ~50/day per key) and Nemotron Ultra is a very large model that occasionally returns 503 under load. The orchestrator will:

- Catch 429/503 and surface a clean "free model is busy, try again in a moment" error in the rail.
- Optionally fall back to a second free model if the first fails — I'll wire `meta-llama/llama-3.3-70b-instruct:free` as the fallback since it's faster and very reliable for tool calls. (Tell me to skip the fallback if you'd rather it fail loudly instead.)

If we later want to swap models, it'll be a one-line change in the edge function — no need for a full provider abstraction right now.

### 3. Frontend hardening (`src/components/dashboard/AgentRail.tsx`)

- Throw a visible toast if `VITE_SUPABASE_URL` is missing instead of silently building a relative URL that hits Vercel.
- Send the `apikey` header alongside `Authorization` so the request is never rejected as anonymous.
- Show "Agent backend unreachable" in the rail if the preflight OPTIONS doesn't return 2xx.

### 4. Verify

- Deploy `agent-orchestrator`, then call it from the edge-function curl tool with a trivial message and confirm a 200 SSE stream.
- Tail logs for boot errors.
- Send a real message from the rail ("show me recent alerts") and confirm a tool chip and final reply render.

## Files touched

- `supabase/functions/agent-orchestrator/index.ts` — full rewrite (fetch-based loop, hardcoded OpenRouter + Nemotron).
- `src/components/dashboard/AgentRail.tsx` — env guard, `apikey` header, unreachable-backend toast.

No database migrations. No new secrets (reuses existing `OPENROUTER_API_KEY`). No frontend redesign.

## Confirm before I build

- Model: `nvidia/nemotron-3-ultra-550b-a55b:free` on OpenRouter — confirmed.
- Fallback model on 429/503: **`meta-llama/llama-3.3-70b-instruct:free`** — say "no fallback" if you want it to fail loudly instead.
