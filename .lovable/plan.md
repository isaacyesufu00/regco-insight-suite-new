## What I found

The deployed `agent-chat` source in this project currently calls:

```ts
https://ai.gateway.lovable.dev/v1/chat/completions
```

with:

```ts
Lovable-API-Key: LOVABLE_API_KEY
```

That is the correct Lovable AI Gateway pattern used elsewhere in the project, and a direct gateway test from the sandbox returned `200` with assistant content.

The reason the UI can still show:

```text
Something went wrong: AI request failed (404). Please try again.
```

is likely that the browser is receiving an HTTP `404` from the request URL itself, not the current deployed gateway call. The current frontend only displays `AI request failed (404)` when the edge-function HTTP response has status `404` and no JSON error body. The latest `agent-chat` logs also do not show a recent authenticated chat attempt, which supports that the request may not be reaching the deployed function version you expect.

## Plan

1. Verify the exact runtime URL the browser is posting to
   - Inspect the built `AGENT_AI_URL` value in the live Agent page.
   - Confirm whether `VITE_SUPABASE_URL` is present in the preview runtime.
   - If it is missing or stale, the frontend may be posting to `undefined/functions/v1/agent-chat` or another incorrect URL, which would explain the frontend-side `404`.

2. Harden the Agent frontend URL construction
   - Change `AgentPage.tsx` to build the function URL from the existing Supabase client configuration instead of relying only on `import.meta.env.VITE_SUPABASE_URL`.
   - Keep the request contract unchanged: client still sends `{ system, messages }` and expects `{ content }`.
   - Add a clear client-side error if the Supabase URL is unavailable, instead of silently producing a bad function URL.

3. Confirm the deployed edge function is the active one
   - Redeploy `agent-chat` after the code check.
   - Check recent edge logs for:
     - `agent-chat request started`
     - `agent-chat calling Lovable AI Gateway url=https://ai.gateway.lovable.dev/v1/chat/completions`
     - `agent-chat completed`
   - This confirms the request reaches the current source and does not call Anthropic directly.

4. If the edge function still returns an upstream error
   - Keep the Gateway URL as `https://ai.gateway.lovable.dev/v1/chat/completions`.
   - Keep the server-side header as `Lovable-API-Key: LOVABLE_API_KEY`.
   - Improve the edge-function response so any upstream non-200 becomes HTTP `500` with a JSON error body, never a raw propagated `404`.

5. Validate end-to-end
   - Open `/dashboard/agent` in the preview with an authenticated session.
   - Send a short message.
   - Confirm the network POST to `/functions/v1/agent-chat` returns `200` with `{ "content": "..." }`.
   - Confirm the UI displays the assistant reply and no longer shows `(404)`.