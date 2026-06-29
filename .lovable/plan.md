## Rebuild the marketing site as a pixel-faithful Crosby Intelligence replica

Scope: redesign the public marketing surface (Homepage, Benchmark-style content page, Fellowship-style content page, Book Demo, Sign Up) to match the Crosby Intelligence reference screenshots exactly. No database changes. No edits to dashboard/app code. Same word counts, sentence counts, and line counts as the reference — dashboard mockups replace every image slot.

---

### 1. Design system (locked tokens)

Add to `src/index.css` as CSS variables + Tailwind tokens:

**Colors**
- `--page` `#0A0A0A` — page background
- `--surface` `#141414` — chart/figure container surface
- `--surface-2` `#1A1A1A` — alt band
- `--ink` `#F5F1E8` — primary text (warm off-white)
- `--ink-2` `#C9C4B8` — secondary body
- `--ink-3` `#8A847A` — muted/captions/figure labels
- `--line` `rgba(245,241,232,0.10)` — hairline dividers
- Chart accents: GPT red `#B83A3A`, Fable tan `#B8923F`, Gemini blue `#3E6E94`, Opus green `#4A7A5E`

**Type**
- Headings: `"Tiempos Headline", "GT Sectra", "Source Serif Pro", Georgia, serif` — weight 400, letter-spacing −0.01em
  - H1 64px / 1.05
  - H2 44px / 1.1 (section "2. Summary of Findings")
  - H3 28px / 1.2 (sub-section "6.1 Overall score")
- Body: `"Inter Tight", Inter, system-ui` — weight 400, 18px / 1.55, color `--ink-2`
- Mono labels (figure captions, "FIG. 1", "01"): `"JetBrains Mono", ui-monospace` — 13px, color `--ink-3`, letter-spacing 0.02em

**Spacing**: 4px base; section vertical padding 128px; container max-width 1280px; reading column max-width 760px centered.

**Radii**: figure containers 12px; pills/bars 6px; no shadows anywhere; only hairline borders.

---

### 2. Global chrome

**`SiteNavbar`** (rebuild): fixed top, 88px tall, transparent over `--page`.
- Left: stacked wordmark "CROSBY / INTELLIGENCE" — Inter Tight 600, 13px, letter-spacing 0.08em, two lines, 4px gap.
- Right group: "Benchmark · Fellowship · Conversations · Main site ↗" — Inter Tight 400, 15px, `--ink`, 40px gaps. No pill, no CTA, no underline; hover → opacity 0.7.

**Left rail tick scale** (decorative, fixed left): 24 horizontal 1px ticks, 8px vertical gap, vertically centered, color `--line`. Pure CSS, no logic.

**`SiteFooter`**: minimal, single row — wordmark left, three legal links right, all `--ink-3` 13px.

---

### 3. Homepage (`src/pages/Index.tsx`)

Replace current Index entirely. Sequence top-to-bottom (every text block preserves the reference's exact line/word count, only the words swap to RegCo's domain):

1. **Hero** — centered 760px column, 240px top padding.
   - H1 serif (2 lines): "Compliance intelligence / for regulated institutions."
   - 3-line body paragraph (matches "We're launching the Crosby Intelligence Fellowship..." rhythm — 3 lines, ~38 words).
   - No CTA in hero (Crosby has none here).

2. **Section "2. Summary of Findings"** — serif H2 left-aligned at 760px column start.
   - 3-line intro paragraph.
   - Then 4 numbered rows, each a two-column row inside a 1080px container with a 1px top divider:
     - Left col 280px: mono "01" + Inter Tight 600 17px label.
     - Right col: 4-5 line body paragraph at 17px / 1.55.
   - Numbered items: 01 Issue prioritization → 02 Over-acceptance → 03 Surgicalness → 04 The gap (relabeled for compliance domain, same line counts).

3. **Figure 1 — heatmap mock** — full container 1080px wide, 700px tall, `--surface` bg, 12px radius, 24px inner padding.
   - Three side-by-side scenario panels ("SCENARIO 1/2/3") rendered as pure CSS grids of 16 rows × 4 cols of small rounded rects, fills interpolated from `#1E1145 → #5B2A6E → #B83A6E → #E07A4A` based on a static seed array.
   - Bottom: horizontal gradient bar `0 ──────── 1.0 intensity` + checkbox "Scores".
   - Caption below: mono "FIG. 1 Each cell = the cluster intensity..." (same wording structure).

4. **Section "6. Turn-level Findings"** + sub "6.1 Overall score" — serif headings, then a 4-bar horizontal ranking mock:
   - 4 rows, each = circle index (1-4) + colored bar (GPT red, Fable tan, Gemini blue, Opus green) with model name + icon left + percentage right.
   - Bar widths: 50.5% / 47.3% / 45.1% / 44.4% of track. Track bg `--surface-2`, bars solid accent.

5. **Sub "6.3 Score by turn"** + 8-line body paragraph + grouped vertical bar chart mock — 5 categories × 4 bars, pure CSS flex with `<div>` bars, value label above each bar, axis labels below. No chart library.

6. **Section "Weighted pass rate" (Figure 6 style)** — same grouped bar chart pattern, different values.

7. **Fellowship-style closing block** — serif H2 "Introducing the RegCo / Compliance Fellowship" (2 lines), then "Why we're launching this program" H3 + two body paragraphs at the exact 2-line and 6-line counts shown in screenshot 5.

8. **Footer**.

All charts/figures are CSS-only mocks — no Recharts, no canvas, no images.

---

### 4. Other pages

- **`/book-demo`** and **`/sign-up`**: same dark canvas, 760px centered column, serif H1, 3-line body, then form fields with hairline bottom borders only (no boxes), submit = text link "Submit →" in `--ink`. Reuses the same SiteNavbar/SiteFooter.
- **Existing feature/product marketing pages** kept as-is for now (out of scope).

---

### 5. Bug fix bundled in

Also fix the TS errors blocking the build (single pass, no logic changes):
- `src/components/settings/SettingsExtraSections.tsx` — cast the `institution_users` invites query through `as unknown as InviteRow[]` and break the deep-instantiation by extracting the select string to a const.
- `src/pages/Customer360.tsx` — map the DB row into the `Customer` shape with safe defaults for the missing fields.
- `src/pages/Screening.tsx` — change the `sanctions_sync_log` insert to `supabase.from("sanctions_sync_log" as any)`; table exists at runtime but is missing from generated types (no DB changes — this is a types-only workaround per your rule).

### Technical notes

- Fonts loaded via `<link>` in `index.html` (Google Fonts: Source Serif Pro 400, Inter Tight 400/500/600, JetBrains Mono 400).
- All visuals are HTML/CSS — zero new dependencies, no asset uploads required.
- File touches: `index.html`, `src/index.css`, `tailwind.config.ts`, `src/components/site/SiteNavbar.tsx`, `src/components/site/SiteFooter.tsx`, new `src/components/site/LeftRail.tsx`, new `src/components/site/mocks/{Heatmap,RankingBars,GroupedBars}.tsx`, `src/pages/Index.tsx`, `src/pages/BookDemo.tsx`, `src/pages/SignUp.tsx`, plus the 3 TS-error fixes above.
- No database migrations. No edge function changes. No dashboard route changes.

Approve and I'll build it in one pass.