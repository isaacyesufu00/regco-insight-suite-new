## Pixel-level diff (Kota reference vs current RegCo)

| # | Element | Kota reference | Current RegCo | Fix |
|---|---|---|---|---|
| 1 | **Right-card illustration fit** | Illustration fills the entire card edge-to-edge (the 8 windows reach all four corners). | Boardroom image is small, centered; a wide lighter-blue empty band sits below it, making the card look "half full". | The uploaded PNG has built-in whitespace + a two-tone background. Switch the right card so it uses the illustration's mid-tone blue (`#A9C8DE`) as the card background and apply `object-fit: cover; object-position: center; width: 100%; height: 100%` on an absolutely-positioned `<img>` inside a relatively-positioned card. Also raise the right card's `min-height` to match the actual rendered left-card height with `align-items: stretch` on the grid so both cards are identical height. |
| 2 | **Headline size & wrap** | Headline is visually larger and wraps to 3 lines: `Employee health insurance / that works for / modern teams`. | RegCo headline is smaller and wraps to 5 short lines due to `max-width: 460px` + `clamp(36px, 3.4vw, 52px)`. | Remove `maxWidth` cap on `<h1>` (let it use full card width minus padding), bump size to `clamp(44px, 4.2vw, 64px)`, keep `letter-spacing: -0.03em`, `line-height: 1.02`. Target 3 lines at desktop: "Automating regulatory / compliance for the / modern compliance desk." |
| 3 | **Reviews chip composition** | `[App Store icon] ★ [G icon] ★ ★ ★ ★ ★` — a single yellow star sits *between* the two brand marks. | RegCo chip shows both marks side-by-side then 5 stars at the end (no star between marks). | Restructure chip children to `<AppStoreMark/> <Star/> <GoogleMark/> <Star×5/>` with 6px gaps so it reads identically. |
| 4 | **Card corner radius** | ~32px (slightly chunkier). | 28px. | Bump both cards + their shadow layers to `border-radius: 32px`. |
| 5 | **Shadow-card offset** | Shadow card peeks ~16-18px up and to the right of the front card (visible as a thin band on the top edge and right edge). | RegCo uses `translate(12px, -12px)` — slightly too subtle and the right card's shadow is mostly hidden by the page bg because the colors are too close. | Increase to `translate(16px, -16px)` and darken `--hero-card-shadow` / `--hero-illus-shadow` by ~6% lightness so the offset is actually visible against `--hero-page`. |
| 6 | **Card vertical padding** | More generous — body text sits with healthy breathing room above the CTA. | RegCo's CTA sits close to the bottom and the headline is close to the top, content reads "stretched". | Set card `padding: 56px 52px`. Use `flex-direction: column` and `justify-content: flex-start` (no `space-between`); rely on natural spacing with `marginTop: 32` on paragraph and `marginTop: 48` on CTA. |
| 7 | **Nav pill position** | Floats with clear gap above the cards; the tinted page background is visible *behind* the pill. | Same structurally, but currently sits a touch too close to the cards. | Add `marginBottom: 36px` after the pill, and `padding: 32px 0 80px` on the hero section. |
| 8 | **Pill nav internal spacing** | Tight, items closer together; "Products ⌄" dropdown caret is small. | Close already; gap is 28px which is correct. | No change needed (verified). |
| 9 | **Page background tone** | Kota's outer page is a soft pistachio that's distinctly lighter than the card. The contrast ratio between page and card is very visible. | RegCo's page (`--hero-page`) and card (`--hero-card`) are too close in hue — they almost blend. | Adjust the blue tokens in `src/index.css`: <br>• `--hero-page: 210 45% 88%` (slightly more saturated) <br>• `--hero-card: 210 50% 95%` (lighter) <br>• `--hero-illus-card: 207 42% 78%` (match illustration body) <br>• `--hero-card-shadow: 210 35% 80%` (darker, to make peek visible) <br>• `--hero-illus-shadow: 207 35% 70%` |
| 10 | **Bottom-of-page seam** | Kota has the trust-logos strip; you asked to remove. | Removed ✓ — no action. | — |
| 11 | **Book a demo button** | Slightly taller (~52px), font-weight 500, tracking tight. | RegCo: padding `16px 28px`. Close. | Bump padding to `18px 32px`, `font-size: 15.5px`, confirm `border-radius: 999px`. |

## Files changed

- `src/index.css` — retune the 5 `--hero-*` HSL tokens for proper contrast and visible shadow peek.
- `src/pages/Index.tsx` — rebuild the hero block with the 11 fixes above (image fills right card via absolute positioning, headline sizing, chip order, padding, offsets, radii).

## What stays untouched

- The pill navbar component, link routing, font stack, all sections below the hero, and every other page.
- No DB changes. No edge-function changes. No work on the pre-existing TS errors in `SettingsExtraSections.tsx`, `Customer360.tsx`, `Screening.tsx` (per your standing rule).

After this pass the only legitimate difference between the two screenshots will be the boardroom artwork itself (Kota's illustrated windows vs. your boardroom render) — every layout, spacing, color-relationship, and typographic metric will match.