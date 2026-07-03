## Homepage Rebuild — OffDeal-style Pixel Replica for RegCo

Full rebuild of `/` (`src/pages/Index.tsx`) following the spec exactly. Current editorial dark-theme homepage will be replaced. All twelve sections built inline with hex tokens and px sizing per spec.

### Files touched
- **`src/pages/Index.tsx`** — full rewrite. Twelve sections, all inline styles, no substitutions.
- **`src/components/editorial/EditorialTheme.tsx`** — leave alone. Other pages (`/product`, `/about-us`, `/who-we-serve`) still use it. Homepage will not import from it.
- **`index.html`** — no change (title/meta already set).
- No new dependencies. Lucide already available for chevrons, plus, arrow, play, pie, search, clock, workflow, bank, network, card, document, columns icons.

### Section build order
```text
1  Announcement bar (#000, pulsing green dot, 2 underlined links)
2  Sticky nav (blur, REGCO wordmark, 5 dropdown labels, white CTA)
3  Hero (814px, dark bg image + radial+linear overlay, pill badge,
      serif 84px 2-line headline, subhead, email pill + Get Started,
      CBS integration link, 4-stat row w/ inset left border)
4  "Built for" strip (serif label + 6 grayscale wordmarks: CBN, NFIU,
      SCUML, NDIC, FIRS, PENCOM as text wordmarks)
5  "Manual review costs time" (2 columns, #F4F1EE cards, image placeholders)
6  "Modern Approach" (#F7F5F2, video block + play ring, 4 stat blocks)
7  "RegCo Advantage" (#222, accordion: 1 open + 3 collapsed at 0.5 opacity)
8  Testimonials (3 bracketed placeholder cards, serif quote, avatar row)
9  Who We Serve (3x2 grid, dark CTA card in slot 2, 5 institution cards)
10 FAQ (2-col, 5 accordion rows w/ + → × rotate)
11 Final CTA card (#EBE5DF, serif headline, 2 buttons, floating notif)
12 Footer (#171514, 6-col grid, giant #928D80 outline REGCO wordmark)
```

### Interaction state
- Accordion state (sections 7 & 10): `useState<number | null>` per group, one-open-at-a-time, chevron/plus rotates 180°/45°.
- Nav chevrons rotate on hover via CSS (no dropdown menus wired — spec says "treat as plain nav link if no dropdown exists yet").
- All arrow-icon buttons: shared `<ArrowChip>` inline component with hover nudge.
- No new routes. Links point to existing `/about`, `/demo` (spec) — will use `/about-us` and `/book-demo` to match current router, noted in code.

### Placeholder images
Sections 3, 5, 6, 7, 11 need imagery. Approach:
- Hero bg (S3): dark server-room / data-viz — generate one image via `imagegen` (fast tier, 1920x1080, jpg) → `src/assets/hero-dark.jpg`.
- Manual Way (S5 col 1): generate cluttered spreadsheet illustration.
- RegCo Way (S5 col 2), Modern Approach media (S6), Advantage diagram (S7), Final CTA visual (S11): use a single dashboard mock generated once, reused. Placeholder gray blocks with correct aspect ratios acceptable if generation is skipped — spec permits placeholders.

Plan: generate hero image + one dashboard mock (2 images total) so the page renders substantively; other slots use aspect-ratio placeholder divs with `#F4F1EE` fill and small caption. Real screenshots swap in later.

### Font stacks (inline everywhere on this page)
```
serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif
sans:  system-ui, sans-serif
```
No Helvetica, no JetBrains Mono on this page. Editorial theme (other pages) unaffected.

### Do-not list — enforced
- No Paper.design floating chrome
- No named testimonials — bracketed placeholders only
- No unverified numbers in announcement bar
- Serif for every headline
- Card radii exactly: 8 / 10 / 12 as specified
- Who We Serve is exactly 3×2 with dark CTA in slot 2
- Inset left-border stat pattern preserved on hero + Section 6

### Out of scope
- Wiring real dropdown menus for nav items
- Video playback modal
- Real logo assets for CBN/NFIU/etc. (text wordmarks per spec fallback)
- Any DB/edge function changes (per standing rule)

### Verification
After build: read the rendered `/` via Playwright at 1440×900, screenshot full hero + one mid-section + footer wordmark to confirm layout, colors, and stat inset borders match spec.
