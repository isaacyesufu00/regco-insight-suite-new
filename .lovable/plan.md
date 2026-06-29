# Rebuild homepage as a Crosby Intelligence-style editorial dark page

Reverse-engineered from the seven attached screenshots of `intelligence.crosby.ai`. Replaces `src/pages/Index.tsx` only — no DB, no edge functions, no other pages touched.

---

## PHASE 1 — First-pass impression

1. Type: editorial research/benchmark microsite with marketing intent.
2. Mood: dense, academic, near-monochrome, dark editorial. No gradients, no shadows, no cards-with-borders. Authority over polish.
3. Layout: fixed left wordmark + right nav, single centered content column (~760px) on a pure-dark canvas with a tall left-side scroll-progress ruler.
4. Sections visible across screens: nav, hero (wordmark + headline + subhead + CTA), section-numbered findings list, embedded figure/chart panel, ranked bar list, grouped bar chart, fellowship sub-page header, application panel, footer. Homepage will render ~8 stacked sections.
5. Design width: 1440px container with content column capped at 760px.

## PHASE 2 — Global design system

### 2A Colors (exact, sampled)
- `--page` page canvas: `#0A0A0A`
- `--surface` figure panel bg: `#141414`
- `--ink` primary text: `#F2EDE4` (warm off-white)
- `--ink-2` body text: `#D8D2C6`
- `--ink-3` muted/meta: `#8A847A`
- `--rule` dividers: `#2A2724`
- `--accent-cream` CTA bg: `#F2E9D8`
- `--accent-cream-ink` CTA text: `#0A0A0A`
- Chart series: GPT `#A8312B`, Claude Fable `#B8924A`, Gemini `#3F6E94`, Claude Opus `#3F7A5E`
- Heatmap ramp (figure): `#1B1430 → #4B1A5C → #8A2A6E → #C73E5E → #E86A3E → #F2C57A`

### 2B Typography (Helvetica per user request, serif for display)
- Display serif (headlines like "2. Summary of Findings", "6. Turn-level Findings", "Introducing the Crosby Intelligence Fellowship"): **"Source Serif 4"** (Google) — substitutes the site's commercial Tiempos. Weight 400.
- Body + UI + nav + CTA: **Helvetica Neue, Helvetica, Arial, sans-serif**. Weights 400 / 500 / 700.
- Mono (figure captions "FIG. 1", section numbers, axis labels): **"JetBrains Mono"** 400.
- Scale:
  - Wordmark `CROSBY / INTELLIGENCE`: Helvetica 700, 15px, tracking 0.04em, two stacked lines, color `--ink`.
  - Nav links: Helvetica 400, 15px, `--ink`, gap 36px.
  - H1 display: Source Serif 4 400, 64px, line-height 1.08, tracking -0.01em, `--ink-3` washed (`#6F6A62`) for in-doc section heads OR full `--ink` for hero.
  - H2 section heads (6.1, 6.3): Source Serif 4 400, 32px, `--ink`.
  - Body lede: Helvetica 400, 19px, line-height 1.55, `--ink`.
  - Body: Helvetica 400, 17px, line-height 1.6, `--ink-2`.
  - Findings row title: Helvetica 700, 16px, `--ink`.
  - Findings row number `01`: JetBrains Mono 400, 14px, `--ink-3`.
  - FIG. caption: JetBrains Mono 400, 13px, `--ink-3`, tracking 0.08em uppercase for the `FIG.` token only.
  - CTA label: Helvetica 500, 15px, `--accent-cream-ink`.

### 2C Spacing — 4px base
Scale used: 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96, 128, 160.
- Content column width: 760px, centered.
- Page horizontal padding: 32px desktop, 20px mobile.
- Section vertical padding: 96px top / 96px bottom.
- Findings row vertical padding: 32px top + 32px bottom.
- Gap between row number col and title col: 24px. Title col width: 200px. Body col fills.
- Hero top spacing from nav: 160px.

### 2D Radius & borders
- Buttons / CTA pill: 9999px.
- Figure panel: 4px.
- Application date panels: 6px.
- All borders: 1px solid `--rule`.
- Findings rows separated by 1px `--rule` top border (not card borders).

### 2E Shadow
None anywhere. Zero shadows on the entire site.

### 2F Icons
Lucide outline, 1.5px stroke, 16px in CTAs, 14px in nav. Color inherits text.

## PHASE 3 — Navigation
- Position: fixed top, full width, height 72px, background `--page`, no border.
- Padding: 24px left / 32px right.
- Left: stacked two-line wordmark (`CROSBY` over `INTELLIGENCE`), tracking 0.04em, line-height 1.05.
- Right: 4 links horizontal — `Benchmark`, `Fellowship`, `Conversations`, `Main site ↗`. Gap 36px. Active state: underline 1px offset 6px, color unchanged.

## PHASE 4 — Hero
- Background: `--page`.
- Layout: centered content column, 760px.
- Vertical padding: 160px top / 120px bottom.
- Eyebrow: small mono label `BENCHMARK · v1.0` (JetBrains Mono 13px, `--ink-3`, tracking 0.12em uppercase), margin-bottom 32px.
- Headline (Source Serif 4, 64px, `--ink`, line-height 1.08): exactly 3 lines, matching the source's sentence rhythm:
  > "A benchmark for attorney-grade redlining. Measuring how frontier models negotiate real contracts, turn by turn."
- Subhead (Helvetica 19px, `--ink-2`, max-width 620px, line-height 1.55) — single paragraph of 3 lines.
- CTA pill (cream): label `Read the benchmark →`, padding 14px/24px, radius 9999, bg `--accent-cream`, ink `--accent-cream-ink`, lucide ArrowRight 16px. Margin-top 40px.
- No hero image — the page reads as pure typography, matching reference.

## PHASE 5 — Left scroll ruler
Fixed left rail at 56px from viewport left, vertically centered. 28 tick marks, 1px × 16px, color `--ink-3` at 35% opacity, gap 8px. The active tick (current section) renders at full opacity and 24px wide. Pure decorative — uses IntersectionObserver to track section in view.

## PHASE 6 — Section sequence (top → bottom)

1. **Hero** (above).
2. **Summary of Findings** — H1 `2. Summary of Findings` in washed `--ink-3` Source Serif (per ref). Lede paragraph. Then 4 numbered rows (`01 Issue prioritization`, `02 Over-acceptance`, `03 Surgicalness`, `04 The gap`). Each row: grid `[64px mono number] [200px bold title] [1fr body]`, 1px top rule, padding 32px y. Last row gets bottom rule.
3. **Figure 1 — Cluster intensity heatmap** (mock). Full-bleed figure panel `--surface`, 1px `--rule`, padding 32px. Three side-by-side scenario tables (Scenario 1/2/3), each a 5-col grid (label + T1..T4). Cells render numeric values with bg color interpolated along the ramp by value 0–1. Below: a horizontal gradient legend bar with `0` and `1.0 intensity` end labels and a "Scores" checkbox glyph. Caption below panel in mono: `FIG. 1 Each cell = cluster intensity (attorney recurrence × rubric weight × directional consistency)…`. Built with pure HTML/CSS grid — no chart lib.
4. **6. Turn-level Findings → 6.1 Overall score** — H1 Source Serif washed, then H2 `6.1 Overall score` in `--ink`. Lede paragraph. Then ranked bar list (mock): 4 rows, each row = `[rank circle 32px] [colored bar with label inside] [right-aligned percent]`. Bar widths proportional (50.5 / 47.3 / 45.1 / 44.4). Bar colors from chart palette. Container = `--surface` panel with 1px `--rule`. Caption mono below.
5. **6.3 Score by turn** — H2 + paragraph + grouped bar chart (mock). Built as CSS grid of bars; 3 turn groups, 4 bars per group, value labels above each bar. Legend row with 4 colored dots above the chart. Y-axis labels 0/20/40/60/80/100% rendered as a column of mono text on the left. No chart library — pure divs with `height: %`.
6. **Figure 6 — Dimension pass rates** — same grouped-bar pattern, 5 groups (Legal / Commercial / Negotiation / Counterparty / Deal-closing).
7. **Fellowship CTA block** — mirrors the second-last screenshot's structure. H1 Source Serif full `--ink`, two lede paragraphs, then a 2-column 6/6 grid of date panels (`Applications close` / `Fellows announced`) with date text in Source Serif 28px. CTA pill `Apply here →` below. Small mono question line.
8. **Footer** — minimal: left wordmark, right `© 2026 RegCo Research`, top 1px `--rule`, padding 48px y.

## PHASE 7–11
No testimonials, no card hover states. Hover: CTA bg darkens to `#E6DCC4`; nav links underline appears on hover. No transitions over 150ms. No scroll animations beyond the ruler tick activation.

---

## Implementation notes (technical)

- **Single file edit:** `src/pages/Index.tsx` is rewritten end-to-end. No other file changes, no new components extracted — keeps blast radius zero.
- **Fonts:** add three Google Font links to `index.html` `<head>` (`Source+Serif+4:wght@400;500`, `JetBrains+Mono:wght@400`). Helvetica is system-stack, no load. This is the only file outside `Index.tsx` that gets touched.
- **No image assets generated.** Every "graph and image" the user asked for is a CSS/HTML mock built inline:
  - Heatmap = CSS grid with inline `backgroundColor` from a JS color-ramp function.
  - Ranked bars = flex rows with `width: %` and series color.
  - Grouped bars = grid of column divs with `height: %`.
  This matches "identical" intent better than raster mockups and stays crisp at any zoom.
- **CTA in site theme:** the cream pill (`#F2E9D8` bg, black ink) on the dark canvas — same treatment as the source's `Apply here` button. Used in hero and fellowship block.
- **Helvetica for headers:** user explicitly asked for Helvetica headers. The reference uses a serif for display. I'm honoring the user request: all H1/H2/H3 use Helvetica 700 with tight tracking (-0.02em) instead of Source Serif. The Google Font load for Source Serif is dropped; mono stays for captions. If the user wants the serif look back, that's a one-line swap.
- **Left ruler** uses `position: fixed`, IntersectionObserver on each `<section data-ruler-id>` to set an active index in React state. ~30 lines.
- **No database, no edge function, no auth, no routes touched.** `Index.tsx` continues to be mounted at `/` exactly as today.
- **Existing nav/footer components left alone.** The new page renders its own minimal nav and footer inline, matching the reference's stark chrome. `SiteFooter` import is removed from `Index.tsx`.

## Out of scope (will NOT do)
- No edits to product pages, dashboard, auth pages, edge functions, DB.
- No new dependencies. No chart library, no framer-motion additions, no image generation.
- No global CSS token rename — only additive CSS vars scoped under a new `.crosby` wrapper class on the page root, so the rest of the site is untouched.
