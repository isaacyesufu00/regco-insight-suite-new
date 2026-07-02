Text-only copy swap across the editorial site. No layout, component, style, chart, or asset changes — only string replacements inside existing JSX.

## Scope

Three files, all copy-only:

1. **`src/pages/Index.tsx`** (homepage / benchmark page)
2. **`src/pages/Fellowship.tsx`** or whichever file currently renders `/fellowship` → repurposed as the Mission page (route path unchanged, only visible copy swapped)
3. **`src/components/editorial/EditorialTheme.tsx`** (shared Nav) — brand + nav links

## Global Nav (EditorialTheme.tsx)

- Brand wordmark: `REGCO / COMPLIANCE` (two-line stacked, existing typography preserved)
- Links, in order: `Home`, `Product`, `About us`, `Who we serve`, `Log in`
- Route targets stay as they are today; only the visible labels change

## Homepage (`src/pages/Index.tsx`) — copy map

Replace text in-place, keeping every existing wrapper, chart, heatmap, leaderboard, and figure caption element:

- Eyebrow → `REGCO · COMPLIANCE PLATFORM`
- Hero H1 (2 lines) → `Compliance automation for banks / that can't afford to miss a filing.`
- Hero subhead (3 lines) → RegCo connects to your core banking system … audit trail.
- Hero CTA label → `Book a demo →` (route unchanged)
- Section 1 label → `1. What We Measure` + 3 body paragraphs (3 / 4 / 4 lines) per brief
- Section 2 heading → `2. Summary of Capabilities` + 3-line intro
- Items 01–04 titles + bodies replaced verbatim (Filing Engine, Over-reporting, Precision, The gap)
- Section 3 heatmap: paragraph above grid, column group headers (`STRUCTURING / SHELL ACCOUNTS / SYNTHETIC IDENTITY`), sub-column headers (`INTAKE / REVIEW / ESCALATE / CLOSE`), row labels list, legend text, FIG. 1 caption, illustrative-data disclaimer. Cell numeric values kept identical.
- Section 4: heading `4. Stage-level Findings`, subheading `4.1 Overall coverage`, 6-line body, leaderboard rows (RegCo / Rule-Based Detection / Machine Learning Only / Manual Review) with no percentages, FIG. 2 caption, small internal-methodology note, subheading `4.2 Coverage by case side`, 1-line cut-off fragment.
- Section 5: `4.3 Coverage by review stage`, eyebrow line, 9-line body, chart legend labels, axis labels unchanged in structure.
- Section 6: legend, `default to clearing borderline activity.` fragment, x-axis labels (`Detection / Documentation / Audit Trail / Filing / Case Resolution`), FIG. 3 caption + disclaimer.

## Mission page (was Fellowship)

Same file, same components, copy only:

- Breadcrumb → `‹ RegCo Compliance`
- H1 (3 lines) → `We exist to make compliance / a system, not a / manual process.`
- Intro 3-line paragraph
- `Why this needed to be built` + 2-line and 9-line body paragraphs
- `What the platform handles` + 5-line paragraph
- `Who we are built for` + 4-line paragraph
- CTA button → `Learn about us →` (points to `/about`)

**Founding Letter component** (existing block, copy only):
- Header left: `REGCO / COMPLIANCE`
- Header right italic: `Compliance infrastructure for regulated institutions`
- Red rule + date `June 27th, 2026`
- Six replacement paragraphs verbatim
- Final sentence with existing red-`zero` treatment kept (only the surrounding words change to `RegCo exists to make compliance invisible to the institution and defensible to the regulator. It is day [zero].`)
- Signature placeholder unchanged
- Name block → `Isaac Yesufu / Founder and CEO, RegCo`
- Trailing centered red italic link → `Learn more about what we are building →` to `/about`

## Case Studies

If a `/conversations` page currently exists in the editorial theme, swap its label to `Case Studies` and replace its body with the two placeholder cards + closing note from the brief. If it does not exist yet, this plan does **not** add a new page — I will flag it and ask before creating one.

## Explicit exclusions (enforced during the swap)

Remove any lingering instance of: specific benchmark percentages, "senior examiner baselines", bare "audit-grade", third-party benchmark claims, "adaptive position management", Crosby Intelligence references, the "RegCo Compliance Research Program" section, any "Apply here" CTA, fabricated Fellowship date cards, and bare "machine learning" phrasing (allow only `rule-based and AI-assisted`).

## Out of scope

- No CSS, spacing, color, font, chart geometry, or component structure changes
- No route additions, no new components, no asset swaps
- No database, edge function, or auth changes

## Verification

After the edits I'll re-read each modified file and grep the repo for the forbidden phrases to confirm none survive.
