# Fix: agent says "Switching view" but URL doesn't change

## Root cause

In `src/components/dashboard/AgentRail.tsx`, the navigation effect checks:

```ts
p.toolName === "navigate_dashboard" && p.state === "output-available"
```

In AI SDK v5 UI message parts, tool parts look like `{ type: "tool-navigate_dashboard", state, input, output }` — there is **no `toolName` field on the part**. So that condition is always false and `navigate(path)` never fires, even though the tool ran successfully on the server and produced `{ ui_action: "navigate", path: "/dashboard/my-reports", ... }`.

The `ToolChip` component already works around this with `part.toolName ?? part.type?.replace(/^tool-/, "")` — the navigation effect just missed the same fallback.

## Fix

One small edit in `src/components/dashboard/AgentRail.tsx` (the `useEffect` that watches `messages` for navigation):

- Derive the tool name from `part.type` (`tool-<name>`) instead of relying on `part.toolName`.
- Keep the `state === "output-available"` and `ui_action === "navigate"` guards so it only fires once per completed call.

## Out of scope

- No edge-function/tool changes — the server-side `navigate_dashboard` tool is correct.
- No route map changes (`returns` → `/dashboard/my-reports` is intentional; if you want a different destination for CBN returns, tell me which page and I'll remap it).
- No styling, no new tools.

## File

- `src/components/dashboard/AgentRail.tsx` — fix the tool-part detection in the navigation `useEffect`.
