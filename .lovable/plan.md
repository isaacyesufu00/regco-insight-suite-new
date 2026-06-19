## Vision

One unified redesign in the spirit of **anthropic.com**: warm off-white paper, near-black ink, a single rust accent, serif display + clean sans body, generous whitespace, quiet motion. Every surface — marketing, auth, app — speaks the same language.

## Design system (built first, used everywhere)

**Palette (semantic tokens in `index.css`)**
- `--paper` `#F5F3EE` (background)
- `--paper-2` `#E8E4DD` (cards / dividers)
- `--ink` `#0D0D0D` (text, primary)
- `--ink-muted` `#5A5A57`
- `--accent` `#C44A2F` (rust — used sparingly: CTAs, key marks, focus)
- Status: success `#3F6B4A`, warn `#B8862A`, error `#9C2A1F` (muted, paper-friendly)

**Type**
- Display: **Instrument Serif** (hero, H1–H2) — Anthropic-style editorial serif
- Body / UI: **Inter** (kept) at tight tracking
- Mono accents: **JetBrains Mono** for stats, code, table figures
- Installed via `@fontsource/*`, wired in `tailwind.config.ts`

**Foundations**
- Radius: 6px default, 10px cards, full on pills
- Shadows: near-zero; rely on 1px `--paper-2` borders
- Motion: 200–400ms ease-out, subtle fades + 8–12px lifts only

## Phase 1 — Tokens & shell (foundation)

1. Rewrite `src/index.css` tokens (light only; dark mode deferred).
2. Update `tailwind.config.ts` colors + font families.
3. Install `@fontsource/instrument-serif`, `@fontsource/jetbrains-mono`; import in `main.tsx`.
4. Refactor shadcn Button, Card, Input, Badge variants to new tokens.
5. New shared `Navbar` + `Footer` (paper, serif wordmark, thin underline links, single rust CTA).

## Phase 2 — Marketing pages

**Homepage (`src/pages/Index.tsx`)**
- Hero: serif headline left, calm right-rail product still life; one rust CTA + ghost secondary
- Trust strip (logos, monochrome)
- "What RegCo does" — 3 editorial columns, serif sub-heads, hairline rules
- Product preview — large bordered screenshot, captioned like a magazine
- Outcomes (stats in mono)
- Compliance coverage grid (CBN / NDIC / NFIU / SCUML / FIRS) — small cards, no gradients
- Long-form CTA band on ink background

**Product page** — anatomy-of-a-report walkthrough, alternating text + screenshot rows (zig-zag), captions in serif.

**Who We Serve** — one section per institution type (Unit MFB, State MFB, National MFB, Commercial, Fintech, PMB), editorial layout with pull-quotes.

**About** — mission essay style, single column max-w-2xl, founder note, footnotes.

## Phase 3 — Auth & lead capture

**Sign In / Sign Up / Forgot / Reset** — split layout: left paper panel with serif quote + wordmark, right white form panel. Inputs underlined (no boxes), rust submit, mono helper text.

**Book a Demo** — same split, form questions feel like an interview (one prominent question at a time visually grouped), success state is a serif "Thank you." letter.

## Phase 4 — Dashboard (full rethink)

**Information architecture**
```text
┌─ Top bar: wordmark · workspace switcher · search · profile
├─ Left rail (collapsible, icon+label):
│   Overview · Reports · Calendar · Customers · Monitoring
│   Intelligence · Agent · Settings
└─ Workspace (paper bg, max-w-7xl, generous gutters)
```

**Overview (new home)**
- Greeting + today's regulatory date in serif
- Compliance score as a large editorial number with mono delta
- "Due this week" card list (deadline, type, status pill)
- Recent reports table (hairline rules, no zebra)
- Right column: regulatory news ticker, agent shortcut

**Reports** — table-first, filters as chip row, "New report" opens a focused full-screen 5-step flow (one question per screen, serif prompts).

**Agent** — kept functional (edge function untouched); chat surface restyled: serif assistant name, mono timestamps, paper bubbles, no avatars; right rail shows referenced sources as footnotes.

**Calendar, Monitoring, Customers, Intelligence, Settings** — restyled to the same grammar; no business logic changes.

## Phase 5 — Polish

- Replace marketing imagery with on-brand monochrome/duotone treatments of the existing PNGs
- SEO pass on each marketing page (title <60, meta <160, single H1, JSON-LD for Organization)
- Accessibility: AA contrast verified, focus states use rust ring
- Remove now-unused legacy components (`eigen/*`, duplicate navbars/footers)

## Out of scope

- Backend / edge functions / DB schema (agent-chat stays as-is)
- Dark mode (deferred)
- Mobile app

## Deliverables order

1. Tokens + fonts + shadcn variants + Navbar/Footer
2. Homepage
3. Product · Who We Serve · About
4. Sign In · Sign Up · Forgot · Reset · Book Demo
5. Dashboard IA + Overview
6. Dashboard inner pages (Reports, Agent, Calendar, Monitoring, Customers, Intelligence, Settings)
7. Cleanup, SEO, a11y pass

Approve and I'll start with Phase 1 (design system). If you want to see rendered direction options for the homepage hero before I commit the tokens, say "show directions" and I'll generate 3 Anthropic-style variants for you to pick from.