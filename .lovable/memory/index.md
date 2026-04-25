# Memory: index.md
Updated: today

# Project Memory

## Core
- Tone: Premium, authoritative, bank-grade. No hype, generic errors, or jargon.
- Proprietary illusion: NEVER mention n8n, Supabase, webhooks, or 3rd-party tools in UI/network logs.
- Security: Enforce RLS by user_id. Sensitive tables locked to service-role.
- Edge functions: Must verify JWT and use `sub` claim for identity. Never trust user_id in request body.
- Invite-only: No public signup. Admins provision accounts. `/signup` redirects to `/book-demo`.
- Passwords: 4 states (Weak, Fair, Strong, Compromised). Enforce 5-attempt lockout (15 mins).
- Visuals: Brand pivoted to dark (#0A0A0A) + orange gradient (#FF9A00 → #FF3D00). Inter typeface, Black 900 wordmark + sharp gradient square mark. Use `<RegCoLogo />` component everywhere — no PNG logo.
- Files: All secure file access uses 1-hour signed URLs via Supabase Storage.

## Memories
- [Brand Identity](mem://brand/identity) — Mission, target audience, and value proposition
- [Brand Tone](mem://brand/tone) — Premium, authoritative voice constraints
- [Messaging Restrictions](mem://constraints/messaging-restrictions) — Forbidden terms to maintain proprietary illusion
- [Visual Direction](mem://style/visual-direction) — Dark + orange palette, Inter, RegCoLogo component, motion tokens
- [Core Offerings](mem://features/core-offerings) — High-level summary of platform capabilities
- [Security Standards](mem://constraints/security-standards) — RLS, lockouts, session timeouts, and file security
- [Pricing Tiers](mem://features/pricing-tiers) — Starter, Growth, Enterprise plans and lead capture
- [Supabase Integration](mem://tech/supabase-integration) — RLS policies, table access restrictions, and roles
- [Auth & Onboarding](mem://features/auth-and-onboarding) — Invite-only flow, password strength rules
- [Lead Capture](mem://features/lead-capture) — Demo requests, institutional context, and WhatsApp integration
- [Email Notifications](mem://tech/email-notifications) — Resend integration for alerts via Edge Functions
- [Dashboard Functionality](mem://features/dashboard-functionality) — Layout, SVG ring, cards, and reports table
- [Report Management](mem://features/report-management) — 5-step generation flow, report types, formats, retries
- [Data Management](mem://features/data-management) — File uploads (50MB max), preview modal, CBS export support
- [Admin Panel](mem://features/admin-panel) — Client management, onboarding workflow, and demo requests
- [Navigation](mem://style/navigation) — Sticky navbar, hybrid routing (React Router + anchors)
- [Marketing Design Patterns](mem://style/marketing-design-patterns) — Stat bars, 3-step workflows, penalty banners
- [Compliance Monitoring](mem://features/compliance-monitoring) — 100-point scoring engine, deadlines, cron reminders
- [Support System](mem://features/support-system) — Floating help button, ticketing flow, and FAQs
- [Edge Functions Security](mem://tech/edge-functions-security) — JWT validation and identity derivation via 'sub' claim
- [Disclaimers](mem://legal/disclaimers) — CBN non-affiliation, non-clickable Careers link
- [Cookie Consent](mem://features/cookie-consent) — Session-based acceptance banner styling
