
# Combined Frontend Pass (no DB, no edge functions)

Doing both batches in one pass since they overlap on `Index.tsx`.

## 1. Homepage hero (`src/pages/Index.tsx`)
- Font: Helvetica stack (`-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`). Drop Instrument Serif.
- Headline: two lines, ~`clamp(34px, 3.6vw, 46px)`, weight 600, tracking -0.01em, line-height 1.1. Copy: "The compliance operating system" / "for regulated finance."
- Subhead: 2–3 lines, ~14px muted, max-width ~480px. No "Nigeria/Nigerian".
- Bring back the email capture pill (input + inline submit) under subhead, max-width ~480px. Submit routes to `/book-demo?email=...`.
- Constrain text column to ~480px so the right side stays open for the future hero image.

## 2. Agent input bar (`src/components/dashboard/AgentRail.tsx`)
- Left cluster: `+` only. Right cluster: send button (swaps to stop while streaming). Remove mic, context, chevron, share, etc.
- Textarea auto-grows up to ~6 lines; rounded-3xl pill that reshapes for long content. Keep radial glow + white surface.

## 3. Wire "Learn more" on four products (`src/pages/Index.tsx`)
- `01` → `/product/automated-returns`
- `02` → `/product/live-screening`
- `03` → `/product/transaction-monitoring`
- `04` → `/product/audit-trail`

## 4. Strip "Nigeria/Nigerian" across the site (copy-only)
Substitutions:
- "Nigerian banks" → "regulated banks"
- "Nigerian financial institutions" → "regulated financial institutions"
- "Nigerian finance" → "regulated finance"
- "for/in Nigeria" → "for your jurisdiction" or drop
- "Nigerian compliance desk" → "the compliance desk"
- "Central Bank of Nigeria" → "the Central Bank" or drop
- "Nigerian microfinance banks" → "microfinance banks"
- Meta tags rewritten without "Nigeria"
- Acronyms CBN/NFIU/SCUML/NDIC/FIRS/PENCOM stay (product scope, not country tags)
- NDPC page: keep "NDPC" acronym, remove spelled-out "Nigeria Data Protection…" wording

Files (copy-only edits): `index.html`, `Index.tsx`, `ProductPage.tsx`, `ProductAutomatedReturns.tsx`, `ProductLiveScreening.tsx`, `ProductTransactionMonitoring.tsx`, `AboutPage.tsx`, `CompanyPage.tsx`, `MarketingPages.tsx`, `SiteFooter.tsx`, `Footer.tsx`, `EditorialAuthShell.tsx`, `HomepageChrome.tsx`, `MockScreenshot.tsx`, `HeroSection.tsx`, `FeaturesSection.tsx`, `StatsSection.tsx`, `SecuritySection.tsx`, `AboutSection.tsx`, `InstitutionScrollSection.tsx`, `eigen/*`, `About.tsx`, `Contact.tsx`, `SignUp.tsx`, `Screening.tsx`, `Security.tsx`, `RegulatoryIntelligence.tsx`, `TransactionMonitor.tsx`, `PrivacyPolicy.tsx`, `DashboardWorkspace.tsx`, `UseCaseMFB.tsx`, `UseCaseCompliance.tsx`, `AgentPage.tsx`, `BlogUpdates.tsx`, `CBNCirculars.tsx`, `ComplianceGuide.tsx`, `PartnershipsPage.tsx`, `TermsOfServicePage.tsx`, `PrivacyPolicyPage.tsx`, `NDPCCompliancePage.tsx`, `downloadReport.ts`.

## Out of scope / flagged
- OpenRouter provider swap + `route_intent` tool (edge function) — still pending your go-ahead.
- Any "Nigeria" strings stored in the DB or edge function code — flagged, not touched.
