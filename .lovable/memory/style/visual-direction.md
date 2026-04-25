---
name: Visual Direction
description: New RegCo brand identity — dark + orange gradient, Inter typography, and reusable RegCoLogo component
type: design
---

RegCo's visual identity (revamped 2026):

**Palette**
- Background black: `#0A0A0A` (primary dark surface, navbar, hero, ticker, footer, final CTA)
- Background night: `#111111` (raised cards on dark)
- Background elevated dark: `#1A1A1A` (icon wells inside dark cards)
- Background white: `#FFFFFF` (light sections — problem statement, feature split, dashboard preview, pricing)
- Background light-2: `#F5F5F5` (dashboard sidebar, soft surface)
- Brand gradient: `linear-gradient(135deg, #FF9A00 0%, #FF3D00 100%)` — used for accents, marks, key buttons, halftone panels
- Brand accent solid: `#FF6200`
- Text on dark: white (`#FFFFFF`), muted `#888888` / `rgba(255,255,255,0.55)`
- Text on light: `#0A0A0A`, muted `#555555`
- Border on dark: `rgba(255,255,255,0.08)` (border-dark-soft utility)
- Border on light: `#E8E8E8`

**Typography**
- Font family: Inter (400, 500, 600, 700, 800, 900)
- Hero headlines: Inter Bold/Black, letter-spacing -0.02em, line-height 1.1
- Body: Inter Regular 15-16px

**Logo**
- Use the reusable `<RegCoLogo />` component from `src/components/RegCoLogo.tsx`
- Wordmark "RegCo" in Inter Black 900
- A sharp gradient square mark sits at the top-right of the last "o", overlapping it slightly
- Pass `dark` prop on dark backgrounds (renders white wordmark)
- Sizes: sm, md (default, navbar), lg, xl
- Replaces the old PNG logo across navbar, footer, auth pages, and dashboard

**Motion**
- All scroll reveals use Framer Motion with easing `[0.25, 0.46, 0.45, 0.94]` and durations 0.6-0.7s
- Cards lift on hover via `.lift-on-hover` utility (translateY -4px, soft shadow)
- Hero map uses `useScroll` parallax (translates up 40% over scroll)
- Final CTA uses `.animate-brand-pulse` radial glow (4s ease-in-out infinite)
- Marquees: `.animate-marquee-left`, `.animate-marquee-right`, `.animate-marquee-slow`

**Tokens & utilities (in src/index.css)**
- `.bg-brand-gradient`, `.text-brand-gradient`
- `.bg-surface-black`, `.bg-surface-night`, `.bg-surface-elevated-dark`, `.bg-surface-light-2`
- `.border-dark-soft`, `.border-dark-medium`
- `.halftone-overlay` (radial dot pattern for gradient panels)
- `.ease-apple` (cubic-bezier easing utility)
