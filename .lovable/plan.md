## Scope
Frontend-only. No database, edge function, RLS, or migration changes. Items A (OpenRouter swap) and E (route_intent tool) remain flagged and out of scope until you approve them separately.

## 1. Agent input bar — match reference (`src/components/dashboard/AgentRail.tsx`)
Rebuild the composer to be 1:1 with the uploaded reference:
- Single pill-shaped white bar, fully rounded, soft outer glow (subtle blue/lavender radial blur behind it).
- Left: `+` icon button (opens existing Quick Actions popover).
- Thin vertical divider, then textarea with placeholder "Forming…" — single-line look that grows on input.
- Right cluster: small "context" icon (bookmark/doc), a chevron-up (model/options stub), a mic icon, then a circular black submit button with a white square "stop" glyph when streaming (filled black circle by default with up-arrow when idle).
- Remove current bordered/rect style; drop shadow `0 8px 32px rgba(80,120,255,0.12)` plus a faint top gradient halo.

## 2. Quick actions preload (B)
On click, set the textarea value to the prompt and focus it instead of auto-sending. "Import file" keeps its file-picker behavior.

## 3. Copy + Regenerate (C)
Under the last completed assistant message, add a right-aligned row of small ghost icon buttons: Share (decorative), Regenerate (resends previous user prompt via `sendMessage`), Copy (`navigator.clipboard.writeText`), and a `…` overflow stub. Matches the icon row in the Project Breeze reference.

## 4. Lighter chat bubble (D)
Change user bubble to `bg-[#F4F4F2]` with `border border-black/[0.04]`, ink text. Assistant stays bare.

## 5. AI step indicator (new component)
While `status === "submitted"` or `streaming` and before assistant text arrives, render a vertical step list above the response, matching the reference:
- Each step: small icon (globe/search/dot) + grey label like "Thinking through the process…", "Searching for mentions of board approval", "Found details regarding…".
- Driven by parsing `message.parts` for `reasoning` / `tool-call` / `tool-result` parts (AI SDK already emits these). For plain text streams with no tool parts, show a single "Thinking…" shimmer step.
- Pure presentational; no backend change. New file: `src/components/dashboard/AgentSteps.tsx`.

## 6. Document preview modal (new component)
New `src/components/dashboard/DocumentPreviewModal.tsx` built on existing shadcn `Dialog`:
- Centered card, white, rounded-2xl, ~720px wide, max-h 80vh, scrollable body.
- Header row: small chevron-down title pill ("Agent plan" / document name), close `X` button top-right.
- Body renders markdown content (uses existing markdown setup or a plain prose block).
- Triggered from: (a) clicking an uploaded file chip in the agent rail, (b) clicking a generated artifact link in an assistant message. Wire trigger via a new `useDocumentPreview()` context in `AgentCenter.tsx`.

## 7. Homepage hero redesign (`src/pages/Index.tsx`)
Restructure hero to mirror the Axion reference layout, **keeping white background** (you'll swap to an image later):
- Full-viewport hero section (`min-h: 88vh`), white bg, generous outer padding.
- Top: existing `SiteNavbar` stays sticky; ensure nav links render right-aligned with a bordered "Book a demo" pill on the far right (already close — verify spacing).
- Content anchored **bottom-left**: large serif display headline (use existing `text-display`, keep current copy "The compliance operating system for Nigerian finance."), short 2-line subhead below, then a single small rectangular CTA button ("BOOK A DEMO" uppercase, cream/ink) — mirrors "JOIN THE WAITLIST".
- Remove the email-capture input from the hero (moves the form to a later section or just keeps the CTA → `/book-demo`).
- Right side reserved empty for the future hero image.

## Files touched
- `src/components/dashboard/AgentRail.tsx` (input bar, bubble color, quick-action preload, copy/regen row, integrate steps + preview trigger)
- `src/components/dashboard/AgentSteps.tsx` (new)
- `src/components/dashboard/DocumentPreviewModal.tsx` (new)
- `src/components/agent/AgentCenter.tsx` (mount preview modal + context)
- `src/pages/Index.tsx` (hero restructure)

## Out of scope / flagged
- A. OpenRouter provider swap in `agent-orchestrator` — still required to fully kill "forever thinking"; awaiting approval.
- E. `route_intent` tool — awaiting approval.
- No Supabase reads/writes, no edge function edits, no schema or RLS changes.

## Open question
Should the homepage hero keep the current headline copy, or do you want new copy for the Axion-style layout?
