
# Hero replica — Kota structure, boardroom illustration, blue palette

Strictly frontend. No database, no edge functions, no schema changes. Touches: `src/pages/Index.tsx` (hero section only), `src/index.css` (font import + a few CSS vars), and one new asset pointer for the uploaded boardroom illustration.

---

## 1. Color system (derived from the new illustration)

The uploaded illustration's background is a muted mid-blue around `#A9C8DE`. Mirroring the original Kota relationship (page bg = mid-tone of the illustration card, copy card = same hue much lighter, illustration card = the hue itself, shadow cards = a half-step darker):

| Token | Hex | Role |
|---|---|---|
| `--hero-page` | `#D6E4EF` | Page background (lightest tint of the illustration blue — same shade gap Kota uses between page and copy card) |
| `--hero-card` | `#EAF1F7` | Left copy card (lightest, near-white tinted blue — the "lighter version of the blue" you asked for) |
| `--hero-card-shadow` | `#C8DAE8` | Offset shadow card peeking behind the left copy card |
| `--hero-illus-card` | `#A9C8DE` | Right illustration card (matches the illustration's own background exactly so the artwork bleeds into the card edges) |
| `--hero-illus-shadow` | `#94B8D2` | Offset shadow card peeking behind the right illustration card |
| `--hero-ink` | `#0A0A0A` | Headline + button |
| `--hero-sub` | `#2A2A2A` | Body copy |

The shade *difference* between page → copy card → illustration card → shadow cards is the same step size as the green version (≈ 8–12% lightness per step in HSL), so the visual hierarchy reads identically.

---

## 2. Structure — unchanged from the previous plan

Everything from the prior plan stays exactly the same; only the right-card content and the color tokens swap.

```text
<section bg=hero-page>
  [existing SiteNavbar — untouched, still rendered above the hero]
  <div grid two-col gap=24>
    <div relative>                               ← LEFT (copy card)
      <div absolute translate(+24,+24) bg=hero-card-shadow radius=28/>
      <div relative bg=hero-card radius=28 p=48>
        <ReviewsChip />                          ← App Store + G + 5 stars pill
        <h1>4-line bold display headline</h1>
        <p>3-line sub-paragraph</p>
        <Link to=/book-demo bg=ink radius=full>Book a demo</Link>
      </div>
    </div>

    <div relative>                               ← RIGHT (illustration card)
      <div absolute translate(+24,+24) bg=hero-illus-shadow radius=28/>
      <div relative bg=hero-illus-card radius=28 p=56 overflow=hidden>
        <img src={boardroomAsset.url} class="w-full h-full object-cover" />
      </div>
    </div>
  </div>
  {/* "Who we work with" strip — REMOVED per request */}
</section>
```

Everything else — typography, headline weight/size/tracking, sub-paragraph treatment, reviews chip, black pill CTA, stacked offset shadow cards, card radius (28px), card padding, two-column grid with side-by-side desktop and stacked mobile breakpoints — stays identical to the previous plan.

---

## 3. How the new illustration is wired

The uploaded `image_hero_section.png` is at `/mnt/user-uploads/image_hero_section.png`. To avoid committing the binary into the repo, I'll upload it via the `lovable-assets` CLI and write only the pointer:

```bash
mkdir -p src/assets
lovable-assets create \
  --file /mnt/user-uploads/image_hero_section.png \
  --filename hero-boardroom.png \
  > src/assets/hero-boardroom.png.asset.json
```

Then in `Index.tsx`:

```tsx
import boardroomAsset from "@/assets/hero-boardroom.png.asset.json";
// ...
<img
  src={boardroomAsset.url}
  alt="Compliance team reviewing reports at a boardroom table"
  className="w-full h-full"
  style={{ objectFit: "cover", objectPosition: "center" }}
/>
```

Because the illustration's native background is the exact same blue as `--hero-illus-card`, the artwork blends seamlessly into the card with no visible seam — exactly like the Kota windows blend into the green card.

---

## 4. What this plan does NOT change

- No edits to `SiteNavbar`, `SiteFooter`, FAQ, stats band, four-products section, How-it-works, closing CTA, or anything below the hero.
- No edits to `supabase/`, `src/integrations/supabase/`, edge functions, migrations, or schemas.
- No changes to routing, auth, or business logic.
- "Who we work with" tile strip is removed from the hero per your request (the four logo squares + label).

---

## 5. Files touched

1. `src/index.css` — add `Inter Tight` font import + the seven `--hero-*` CSS vars listed above.
2. `src/pages/Index.tsx` — replace the existing hero `<section>` only; everything below it is left intact.
3. `src/assets/hero-boardroom.png.asset.json` — new CDN pointer (binary lives on Lovable Assets, not in the repo).
