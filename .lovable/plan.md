# Switch agent to Lovable AI Gateway (Gemini 3 Flash)

You don't need to do anything — `LOVABLE_API_KEY` is already provisioned in your project. I'll swap the orchestrator over and you can send a new message in the agent rail to verify.

## Change

Edit `supabase/functions/agent-orchestrator/index.ts`:

1. Add a Lovable AI Gateway provider alongside the existing OpenRouter one:
   ```ts
   const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
   function makeLovableProvider(key: string) {
     return createOpenAICompatible({
       name: "lovable",
       baseURL: "https://ai.gateway.lovable.dev/v1",
       headers: {
         "Lovable-API-Key": key,
         "X-Lovable-AIG-SDK": "vercel-ai-sdk",
       },
     });
   }
   ```
2. Replace the model selection logic:
   - Primary: Lovable Gateway + `google/gemini-3-flash-preview`
   - Fallback (only if `LOVABLE_API_KEY` is missing): OpenRouter + `meta-llama/llama-3.3-70b-instruct:free` (real, tool-capable slug — replaces the broken `nvidia/nemotron-3-ultra-550b-a55b:free`)
3. Update the startup guard from "missing OPENROUTER_API_KEY" to "missing LOVABLE_API_KEY (or OPENROUTER_API_KEY)".
4. Add `onError` surfacing on the stream response so any future model issue shows in the UI red banner instead of spinning forever.

## Out of scope

- No frontend changes (`AgentRail.tsx` already handles errors and renders parts).
- No DB / RLS / tools / system prompt changes.
- No secret changes — `LOVABLE_API_KEY` is already set.

## File touched

- `supabase/functions/agent-orchestrator/index.ts`

## After I apply it

Just open the agent rail and send a message. Tool calls (screening, transactions, navigation, etc.) will work the same — Gemini 3 Flash supports the same tool-calling interface the code already uses. Lovable AI usage is billed against your workspace credits (visible in Settings → Plans & credits).
