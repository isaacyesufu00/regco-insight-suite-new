## Changes

### 1. Homepage FAQ section (`src/pages/Index.tsx`)
Add a new `<section className="section-pad border-t border-[var(--line)]">` between the closing CTA and `<SiteFooter />`. Same B/W editorial aesthetic:
- Left column (md:col-span-4): `tag` "Questions" + `text-h2` "Frequently asked."
- Right column (md:col-span-8): 6 Q&A items via shadcn `Accordion` (type="single", collapsible), separated by `border-t border-[var(--line)]`, with mono question numbers (01–06), `text-[17px]` ink question, `text-[14.5px] text-ink-3` answer.
- Topics: CBS data integration, regulatory coverage (CBN/NDIC/NFIU/SCUML/FIRS), security & data residency, deployment timeline, pricing model, support SLA.

### 2. Hero CTA → email capture (`src/pages/Index.tsx`)
Replace the two-button row (Book a demo + See the product) with a single inline email form occupying the same slot:
- `<form>` with a borderless email `Input` (placeholder "Work email") + black pill submit button "Book a demo" with `ArrowUpRight`.
- Wrapper: `border border-[var(--line)] rounded-full pl-5 pr-1 py-1 flex items-center max-w-[420px]`.
- Submit navigates to `/book-demo?email=<value>` (presentation only, no backend).
- Remove the "See the product" link entirely. No other hero copy changes.

### 3. Dashboard AI agent rail tweaks (`src/components/dashboard/AgentRail.tsx`)
- Width: bump from `360px` → `370px`.
- Composer input: reduce vertical height (smaller `min-h` / `py`) so the input sits tighter — about one line shorter, same horizontal padding and pinned position.

No other files, no logic, no theme token changes.
