Widen the dashboard AI agent rail to give the ledger stream and composer more breathing room, leaving everything else untouched.

## Change

In `src/components/dashboard/AgentRail.tsx`:
- Increase the `<aside>` width from `280px` to `360px`.

That's the only edit. No typography, color, layout, or copy changes. The work canvas keeps its `flex-1` behavior and simply reflows to the remaining width.