## What's actually different

Two specific layout mistakes vs the Kota reference:

**1. Grid proportions are wrong.** Kota uses roughly a **`0.85fr` / `1.9fr`** split — the copy card is narrow and the illustration card is more than twice as wide, almost panoramic. We're rendering **`1fr` / `1fr`** (equal halves), which makes the left card look oversized and the right card look cramped (so the image can't "stretch across" the hero).

**2. Left card height is being padded out.** We force `min-height: 640px` on the left card. Kota lets the left card size to its content (headline + paragraph + button ≈ 540-560px), and uses `align-items: stretch` so the right card matches whatever the left card actually is. Right now our right card is forced taller than it needs to be, which is also why the image looks lonely inside it.

## Fix (Index.tsx only — no CSS token changes, no other files)

In the hero `<section>`:

| Change | From | To |
|---|---|---|
| Desktop grid columns | `minmax(0, 1fr) minmax(0, 1fr)` | `minmax(320px, 0.85fr) minmax(0, 1.9fr)` |
| Left card `min-height` | `640` | remove — let content size it |
| Left card `padding` | `56px 52px` | `44px 40px` (Kota's left card is tighter) |
| Headline `font-size` | `clamp(44px, 4.2vw, 64px)` | `clamp(40px, 3.4vw, 54px)` (since the card is narrower, the headline naturally wraps to 4 lines like Kota's "Employee health / insurance / that works for / modern teams") |
| Right card `min-height` | `640` | remove |
| Right card height | (none) | `height: 100%` so it stretches to match the left card via `align-items: stretch` on the grid |
| Image positioning | `position: absolute; inset: 0; object-fit: cover` | unchanged — once the card is wide enough, the boardroom illustration will fill edge-to-edge horizontally |

## Result

- Left card becomes compact and roughly the width of Kota's copy card.
- Right card spans ~⅔ of the hero, so the boardroom image stretches horizontally across the full panel like Kota's window-grid illustration.
- Both cards remain equal height (driven by the left card's natural content height ≈ 540px), with the stacked shadow peek still visible.

## What stays untouched

Everything else: pill navbar, color tokens, radius, shadow offset, reviews chip order, button, and every section below the hero. No DB or edge-function changes. Pre-existing TS errors in Settings/Customer360/Screening remain out of scope per your standing rule.