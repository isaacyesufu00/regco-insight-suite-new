## Goal

Keep the Crosby Intelligence editorial design exactly as-is (layout, type scale, dark theme, cream CTA pill, mockup figures, fixed nav, scroll ruler) but swap all copy to RegCo / compliance content — preserving sentence count, line count, and words-per-sentence so the visual rhythm stays identical. Rebrand the wordmark to RegCo, update the navbar links, add matching pages for each nav link in the same theme, add another mockup, and swap the two CTAs to "Book a demo".

## 1. `src/pages/Index.tsx` — in-place edits, no structural changes

**Wordmark (Nav + Footer)**
- Replace the two-line `CROSBY / INTELLIGENCE` with two-line `REGCO / COMPLIANCE` (same Helvetica, weight 700, letter-spacing, line-height). Footer wordmark mirrors nav.
- Footer copyright `© 2026 RegCo Research` → `© 2026 RegCo Compliance`.

**Navbar links** — replace the current four items with: `Home`, `Product`, `About us`, `Who we serve`, `Log in`. Same `navLink` style, same gap. Routes:
- Home → `/`
- Product → `/product`
- About us → `/about-us`
- Who we serve → `/who-we-serve`
- Log in → `/login`
Drop the `Main site ↗` item.

**Hero**
- Eyebrow stays as the just-approved `ledger · v1.0`.
- H1: same word count (7 words) as "A benchmark for attorney-grade redlining." → "A platform for audit-grade regulatory compliance."
- Lede: match the original two-sentence / ~39-word structure, rewritten about RegCo grading filings, returns readiness, and supervised reporting against examiner baselines.
- CTA "Read the benchmark" → **"Book a demo"**, route `to="/book-demo"`.

**Summary of Findings → "Summary of Capabilities"**
- H2 keeps the washed style and "2." prefix.
- Intro sentence rewritten to the same word count, RegCo-flavored.
- Each of the four FINDINGS rows keeps `n` (01–04), title word/character length, and body sentence count + word count:
  - 01 Issue prioritization → Filing prioritization
  - 02 Over-acceptance → Over-reporting
  - 03 Surgicalness → Precision
  - 04 The gap → The gap
- Bodies rewritten with matching sentence counts/lengths about CBN/NFIU returns, readiness gaps, and supervised reporting.

**Figure 1 caption** — same word/line count, reframed as return-readiness intensity across (return type, section, period).

**Turn-level Findings → "Period-level Findings"**
- Sub-heads: "6.1 Overall score" → "6.1 Overall readiness"; "6.3 Score by turn" → "6.3 Score by period".
- Paragraphs rewritten in matching word counts, swapping model names for RegCo modules.

**Mockup data labels (keep all chart layout / sizes identical)**
- `OVERALL` series: GPT-5.5 / Claude Fable 5 / Gemini 3.5 Flash / Claude Opus 4.8 → Returns Engine / Screening Core / Monitoring Hub / Audit Vault (similar character lengths to preserve bar text fit).
- `DIMS` labels: Legal / Commercial / Negotiation / Counterparty / Deal-closing → Returns / Screening / Monitoring / Audit / Reporting.
- Grouped-bar legend matches the new `OVERALL` names.

**Add one extra mockup section** matching the existing visual language (a ranked-list mockup similar to `RankedBars` but titled as "Filing readiness by jurisdiction") inserted between section 6 and the Fellowship CTA. Uses the same `surface / rule / Mono / HELV` tokens — no new design primitives. Bump `SECTION_COUNT` from 8 to 9 and add `data-ruler-id="8"` accordingly, renumbering the Fellowship section.

**Fellowship CTA → "Compliance Program" block**
- H1 same word count: "Introducing the RegCo Compliance Acceleration Program" (matches the original word count).
- Body paragraph rewritten at matching length with grant/credit numbers preserved as visual anchors but reframed (e.g. "$50,000 in onboarding credits" / "$25,000 in compute credits").
- Date panels keep labels and dates.
- CTA "Apply here" → **"Book a demo"** (already routes `/book-demo`).
- `fellowship@regco.ai` → `hello@regco.ai`.

## 2. Shared editorial theme module

Extract the existing `Nav`, `ScrollRuler`, `CreamCTA`, `Col`, color tokens (`C`), and text styles (`H1`, `H1Washed`, `H2`, `Lede`, `Body`, `Mono`, `HELV`, `MONO`) from `Index.tsx` into `src/components/editorial/EditorialTheme.tsx` so the new pages reuse the exact same primitives (no visual drift). `Index.tsx` then imports from this module.

## 3. New pages — same theme, RegCo copy

Each new page uses the shared `Nav`, `ScrollRuler`, 760px `Col`, eyebrow → H1 → lede → numbered rows → cream CTA. All copy preserves the homepage's sentence/word rhythm.

- `src/pages/Product.tsx` — eyebrow `product · v1.0`, hero, "Summary of Capabilities" with 4 numbered rows (Returns, Screening, Monitoring, Audit), one reused mockup (RankedBars variant), closing "Book a demo".
- `src/pages/AboutUs.tsx` — eyebrow `about · v1.0`, hero, mission paragraph, 3 numbered principles rows, closing "Book a demo".
- `src/pages/WhoWeServe.tsx` — eyebrow `audience · v1.0`, hero, 4 numbered audience rows (Tier-1 banks, MFBs, Fintechs, Holdcos), closing "Book a demo".

## 4. Routing — `src/App.tsx`

Add routes `/product`, `/about-us`, `/who-we-serve` pointing at the three new pages. `/login` already exists. No other route changes.

## 5. Out of scope (do not change)

- No database, edge function, or schema changes.
- No edits to dashboard, agent UI, marketing components, or any page not listed above.
- No new design tokens, libraries, or animation work — strictly copy + brand + routing + 3 new pages reusing existing primitives.

## Files touched

- `src/pages/Index.tsx` — copy, nav, CTAs, +1 mockup section, brand wordmark
- `src/components/editorial/EditorialTheme.tsx` (new) — shared primitives
- `src/pages/Product.tsx` (new)
- `src/pages/AboutUs.tsx` (new)
- `src/pages/WhoWeServe.tsx` (new)
- `src/App.tsx` — 3 new routes
