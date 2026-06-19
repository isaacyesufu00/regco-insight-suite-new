## Reset & new direction

Strip the editorial "paper + rust" system. Replace with a strict **black / white / hairline-grey** system inspired by **harvey.ai** and **rogo.ai**. RegCo is repositioned as **four products**. Dashboard becomes a clean **two-pane** workspace: narrow AI agent rail on the left, dominant work canvas on the right with a top tab-router (Fraud · Identity · Returns). **No icon sidebar, no third column** — just the two panes.

## Typography — Apple system stack everywhere

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
             "Helvetica Neue", system-ui, sans-serif;
```

Mono for KPI numbers: `ui-monospace, "SF Mono", Menlo, monospace`. Remove all webfont imports (`Instrument Serif`, `Inter`, `Lora`, `JetBrains Mono`) from `main.tsx` / `index.css`.

## Sizing & proportions (balanced)

- Display h1: 56px / 1.05 / -0.02em · h2: 36px · h3: 22px · Body: 15px · Small: 13px · KPI number: 28px mono.
- Page max-width 1200px, side padding 24px.
- Section vertical padding 80px desktop / 56px mobile.
- Cards: 20px padding, 8px radius, 1px `#E5E5E5` border, no shadow.
- Buttons & inputs: 38px tall, 14px text, pill radius.

## Design tokens

**Marketing (strict B/W)**
- `--bg #FFFFFF` · `--bg-inverse #0A0A0A`
- `--ink #0A0A0A` · `--ink-2 #3A3A3A` · `--ink-3 #6B6B6B` · `--ink-4 #A8A8A8`
- `--line #E5E5E5` · `--line-2 #F0F0F0`

**Dashboard adds**
- `--navy #172B4D` · `--blue #0052CC` · `--green #00875A` · `--rail-bg #F4F5F7` · `--rail-border #DFE1E6`

## What's removed

- All marketing mockups: `DashboardMock`, `DashboardShowcase`, `MockScreenshot`, `eigen/DashboardMockup`, `eigen/DashboardTutorialSection`, every faux screenshot.
- Editorial italics, serif headings, rust accent, paper bg, `blue-underline`.
- All webfont packages.
- **The current dashboard sidebar (`DashboardSidebar.tsx`) entirely** — no icon nav, no labels nav.

## Product positioning (four products)

```text
01 · Automated Returns          End-to-end CBN & NFIU filing
02 · Live Client Screening      BVN, NIN, Sanctions, PEP, Adverse Media
03 · Transaction Monitoring     Near-real-time fraud, AML, anomaly detection
04 · Audit Trail & Case Mgmt    Chain of custody, case workflow
```

Marketing nav gets a Products dropdown listing all four.

## Marketing pages (Harvey/Rogo, no imagery)

- **Homepage** — hero (56px headline, two pill CTAs) → text trust strip → four product blocks stacked with `01–04` numerals → 3-column "How it works" → 4 mono stat tiles → black closing CTA band.
- **Product** — intro + four anchored sections (`#returns`, `#screening`, `#monitoring`, `#audit`): kicker, h2, two-column body. No mockups.
- **Who we serve, About, Pricing** — restyled to the new B/W sans system. Pricing = three hairline cards.
- **Navbar + Footer** — minimal B/W replacements.

## Auth & Book-a-demo

Split shell, both panels white, hairline divider, underline-only inputs, solid black submit. No serif, no rust, no paper.

## Dashboard — strict two-pane workspace

No sidebar of any kind. Only two panes.

```text
┌─ Agent rail (280px, #F4F5F7) ┬─ Work canvas (flex-1) ────────────────────────────┐
│                              │ [ Fraud & AML ] [ Identity ] [ Returns ]   user ▾ │
│ Thought: Checking CBN Rule 4 │ ─────────────────────────────────────────────────  │
│ Thought: Compiling NFIU XML  │                                                    │
│ Output: 14 alerts triaged…   │  [ KPI · KPI · KPI · KPI ]                         │
│                              │                                                    │
│                              │  [ Dual-axis chart                            ]    │
│                              │                                                    │
│                              │  [ Risk ledger table                          ]    │
│ ┌──────────────────────────┐ │                                                    │
│ │ + What do you want to…  ↵│ │                                                    │
│ └──────────────────────────┘ │                                                    │
└──────────────────────────────┴────────────────────────────────────────────────────┘
```

**Left agent rail — 280px fixed**
- Background `#F4F5F7`, right border `1px #DFE1E6`.
- Small RegCo wordmark at top of the rail (so brand still appears without a sidebar).
- Plain-text ledger stream, no bubbles: grey "Thought:" lines stacked above black output lines. 13px, 1.5 line-height.
- Pinned composer at bottom: white container, subtle shadow, single `+` icon, placeholder **"What do you want to know?"**.
- Conversation state held in a `useRef`-backed messages array (async-safe, prevents trailing-closure cuts during streaming). Backed by existing `agent-chat` edge function.

**Right canvas (flex-1, dominant)**
- Top bar = three tabs (**Fraud & AML**, **Identity & Screening**, **Regulatory Returns**) on the left; on the right a small user menu (profile, settings, sign out, calendar) — these replace what the sidebar used to expose.
- Active tab = `#0052CC` underline, navy `#172B4D` text. Tabs are routable and AI-switchable.
- Inner padding 24px, max content 1100px, KPI grid 4 × 20px gap.

**Tab 1 — Fraud & AML (default)**
KPIs: Processing Latency (ms), Alerts Triaged, False-Positive Ratio, Cleared Volume (₦). Recharts dual-axis area+bar. Smart Risk Ledger grid: Txn ID · Entity · Triggering Control · Risk Score 0.00–1.00.

**Tab 2 — Identity & Screening**
Corporate Alignment Matrix (beneficial owners ↔ CAC). Sanctions Verification Board across UN, US OFAC, EU, UK HM Treasury, CBN Watchlist.

**Tab 3 — Regulatory Returns**
Filing Schedule Checklist (daily / monthly / quarterly, status Draft / Validating / Submitted / Acknowledged) + one-click XML/JSON export widgets per return.

## Out of scope (this round)

- Real NFIU XML compilers / live sanctions feeds (UI + stubbed data only).
- Trust-strip logos until provided.
- Dark mode, mobile dashboard (desktop-first ≥1280px).
- Admin pages beyond inheriting tokens.

## Deliverables order

1. Apple font stack + tokens + sizing scale in `index.css`; strip webfont imports; clean `tailwind.config.ts`.
2. New minimal Navbar (with Products dropdown) + Footer.
3. Rewrite Homepage around four products, no mockups.
4. Rewrite Product page with four anchored sections.
5. Restyle Who-we-serve, About, Pricing.
6. Restyle Sign-in, Sign-up, Book-demo.
7. New `DashboardLayout` = **only** 280px agent rail + flex-1 canvas. Delete `DashboardSidebar`.
8. Canvas tab bar (Fraud / Identity / Returns) + user menu on the right.
9. Build the three tab views with KPI strip + chart + grid each.
10. Rebuild left rail as plain-text ledger stream + pinned composer; port `AgentCenter` chat logic.
11. Delete dead components: marketing mockups, unused `eigen/*`, `regco/MockScreenshot`, legacy Navbar/Footer, `DashboardSidebar`.

Approve and I'll start building.