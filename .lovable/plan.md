
## Hero restructure + Vercel image fix

### 1. Reorder the hero to a single vertical stack
Drop the two-column grid. New top-to-bottom order, all centered in a 720px column:

1. **Reviews chip** (kept, small, on top)
2. **Headline** — `Automating regulatory compliance for the modern compliance desk.` (Inter Tight, ~clamp(40px, 4vw, 56px), weight 700, `-0.03em`)
3. **Subhead** — existing paragraph, max-width 560px, 16px, `var(--hero-sub)`
4. **CTA** — black "Book a demo" pill (unchanged styling)
5. **Illustration** — boardroom watercolor, full column width (max ~960px), no card frame, no rounded corners, no shadow card. The image's cream background blends straight into `var(--hero-page)`.

Spacing: 24px chip→h1, 28px h1→p, 32px p→CTA, 72px CTA→image, 96px below image.

Removes: the right-hand illustration card, the offset shadow card behind it, the `grid-template-columns` split, and the `min-height: 480` on the image card.

### 2. Fix the image not showing on Vercel
Root cause: `src/assets/hero-boardroom.png` is a 1.1 MB binary committed to the repo. The Vite import works locally but Vercel's deploy can drop it (LFS, size, or the file isn't in the deploy artifact).

Fix: move the image to the Lovable Assets CDN so it's served from `/__l5e/assets-v1/...` regardless of host.

Steps (build mode):
```bash
lovable-assets create --file src/assets/hero-boardroom.png \
  --filename hero-boardroom.png \
  > src/assets/hero-boardroom.png.asset.json
rm src/assets/hero-boardroom.png
```

Then in `src/pages/Index.tsx`:
```ts
// before
import boardroom from "@/assets/hero-boardroom.png";
// after
import boardroomAsset from "@/assets/hero-boardroom.png.asset.json";
const boardroom = boardroomAsset.url;
```

No other usage to update — the `<img src={boardroom}>` reference stays the same.

### Files touched
- `src/pages/Index.tsx` — hero JSX restructure + import swap (lines ~150–290)
- `src/assets/hero-boardroom.png.asset.json` — new CDN pointer
- `src/assets/hero-boardroom.png` — deleted

Nothing else changes: navbar, color tokens, sections below the hero, DB, edge functions all untouched.
