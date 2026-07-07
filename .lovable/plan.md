
## Scope

Rebuild three marketing pages in a single black/red/white Helvetica system:
- `/` (Homepage)
- `/who-we-serve`
- `/product`

All other pages, routes, dashboards, auth flows, and backend code stay untouched. Only these three routes get swapped to the new components.

## Files to add

- `src/components/marketing-bw/Nav.tsx` — fixed top nav (REGCO logo, centered links, red "Book a Demo" CTA). Transparent → black on scroll past 40px.
- `src/components/marketing-bw/ScrollTicks.tsx` — fixed left scroll-progress indicator. Uses IntersectionObserver on `[data-section]` children of `<main>`, animates active tick 16px → 32px. Hidden below 1024px.
- `src/components/marketing-bw/NumberedList.tsx` — shared numbered-entry list (red number, white title, dim body, dividers). Reused across all three pages.
- `src/components/marketing-bw/ClosingCTA.tsx` — pure-black centered CTA block with configurable headline/subheadline.
- `src/components/marketing-bw/tokens.ts` — exported color/spacing constants (`--black`, `--black-pure`, `--white`, `--white-dim`, `--white-faint`, `--red`, `--red-hover`, `--border`, font stack).
- `src/pages/marketing-bw/HomeBW.tsx` — split hero (grayscale image left, black panel right with three-line headline, red "desk." accent), then Problem section (4 findings), How It Works (3 steps with red-ringed number circles), Closing CTA.
- `src/pages/marketing-bw/WhoWeServeBW.tsx` — compact centered hero, 6 numbered institution entries, closing CTA.
- `src/pages/marketing-bw/ProductBW.tsx` — compact centered hero, 4 engine entries, closing CTA.

Hero image: use `user-uploads://IMG_5424.JPG` (the second uploaded image) via `lovable-assets create` → `src/assets/hero-bw.jpg.asset.json`, rendered with `filter: grayscale(100%)` and a right-edge gradient fade into the black panel.

## Files to edit

- `src/App.tsx` — swap the route elements for `/`, `/who-we-serve` (add if missing), and `/product` to the three new page components. Leave every other route as-is.

## Files to leave alone

- All existing marketing components (`SiteNavbar`, `SiteFooter`, `EditorialTheme`, `HeroSection`, `eigen/*`, `FoundingLetter`, `AboutUs`, dashboard, auth, Supabase, edge functions, etc.).
- No footer is specified for these three pages, so they render without one (matches the spec: nav + hero + sections + closing CTA only).

## Technical details

- Font stack applied via inline `style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}` on each page root (avoids touching global CSS / other pages).
- Colors used as inline style values from `tokens.ts` — no Tailwind semantic tokens added, since this is an isolated marketing surface and the rest of the app uses different systems.
- ScrollTicks reads `document.querySelectorAll('[data-section]')` on mount and observes them; each section wrapper in the three pages sets `data-section` and a stable id.
- Nav scroll state via a single `useEffect` + `scroll` listener with `passive: true`.
- Responsive: hero uses a CSS media query via inline `<style>` block scoped in the component (stacks under 900px, headline shrinks to 48px); ticks hidden under 1024px via `hidden lg:flex` Tailwind utility (Tailwind is already available project-wide).
- No new dependencies.
- No changes to Supabase, RLS, or edge functions.

## Out of scope (explicitly not doing)

- No testimonials, stats, or fabricated numbers.
- No serif fonts, cream cards, Atlassian blue, or Geist Mono anywhere in these three pages.
- No red backgrounds or large red fills — red stays an accent only.
- No changes to About Us, dashboard, login, or any other route.
