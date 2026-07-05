## Homepage: Helvetica font swap + new hero background image

Two focused edits to `src/pages/Index.tsx` (the OffDeal-style pixel replica homepage). No structural, layout, color, or copy changes — only font family and hero background image.

### 1. Global font swap → Helvetica

Current page uses two inline font stacks defined at the top of `Index.tsx`:
- serif: `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif` (headlines, decorative wordmarks)
- sans: `system-ui, sans-serif` (body, nav, buttons, labels)

Replace **both** stacks with a single Helvetica-first stack applied everywhere on the homepage:

```
"Helvetica Neue", Helvetica, Arial, sans-serif
```

This means every serif headline (hero H1, section titles, "The RegCo Advantage", "Who We Serve", FAQ, testimonials, footer decorative REGCO wordmark, final CTA) becomes Helvetica as well — matching the user's "change the font to helvetica" instruction literally, no serif exceptions.

Scope: only `src/pages/Index.tsx`. Other pages (`/product`, `/about-us`, `/who-we-serve`, dashboard, etc.) are untouched and keep their existing typography.

### 2. Hero background image → user's uploaded manual-process photo

Use the last uploaded image (`user-uploads://regco_hero_manual_process-Picsart-AiImageEnhancer.png` — the dramatic photo of stacked paperwork, sticky notes, calculator, coffee mug) as the hero section's background image, replacing the current `src/assets/regco-hero-dark.jpg`.

Approach:
- Register the upload as a Lovable CDN asset so it doesn't bloat the repo:
  ```
  lovable-assets create --file /mnt/user-uploads/regco_hero_manual_process-Picsart-AiImageEnhancer.png \
    --filename regco-hero-paperwork.png > src/assets/regco-hero-paperwork.png.asset.json
  ```
- Import the pointer JSON in `Index.tsx` and use `.url` as the hero `background-image`.
- Remove the now-unused import of `regco-hero-dark.jpg` (leave the file on disk; other components may not use it but no need to delete).

### 3. Tint so hero text stays readable

The uploaded image is already fairly dark/moody but has warm yellow highlights that will fight white headline text. Add a darkening tint overlay on top of the image, under the text:

- Keep the existing radial + linear gradient overlays in the hero, and strengthen the base tint to:
  ```
  linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.8) 100%)
  ```
  layered above the background image via `background: <gradient>, url(<image>)` with `background-size: cover; background-position: center`.
- Result: paperwork photo is clearly visible but muted; white eyebrow, headline, subhead, stats all remain high-contrast.

No other hero geometry, copy, CTA, or stat-row changes.

### Files touched
- `src/pages/Index.tsx` — font stack constants + hero background image + tint gradient
- `src/assets/regco-hero-paperwork.png.asset.json` — new CDN asset pointer (created via `lovable-assets`)

### Explicitly NOT changed
- Layout, spacing, colors elsewhere, section order, copy, accordion behavior, footer wordmark structure, other pages, editorial theme, nav component
