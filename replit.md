# RegCo — Regulatory Compliance Platform

## Overview
RegCo is a React SPA that helps Nigerian banks and microfinance institutions generate CBN-ready regulatory compliance reports. It was migrated from Lovable to Replit.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite (port 5000)
- **UI**: Tailwind CSS + shadcn/ui component library
- **Auth & Database**: Supabase (hosted, external)
- **Routing**: React Router v6
- **State/Data**: TanStack React Query

## Key Features
- Authentication (login, forgot/reset password) via Supabase Auth
- Dashboard for compliance officers (reports, data sources, calendar, settings, support)
- Admin panel (client management, onboarding, demo requests)
- Public marketing pages (home, use cases, features, pricing, about, security, legal)

## Supabase Integration
The app connects directly to a hosted Supabase project. All database queries and auth are handled client-side via `@supabase/supabase-js`.

**Environment variables (set as Replit env vars):**
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` — Supabase project ID

## Supabase Edge Functions
The following edge functions are deployed on Supabase (not in this repo's server):
- `send-demo-notification` — emails admin on new demo requests (uses Resend)
- `send-support-notification` — emails admin on new support tickets (uses Resend)
- `onboard-client` — admin-only: creates user, sends welcome email
- `calculate-compliance-score` — calculates and saves compliance score
- `send-deadline-reminders` — daily cron: sends email reminders for upcoming report deadlines

## Development
```
npm run dev     # Starts Vite dev server on port 5000
npm run build   # Production build
npm run preview # Preview production build
```

## Project Structure
```
src/
  App.tsx                    # Root component, all routes
  pages/                     # All page components
  components/                # Shared UI components
  components/ui/             # shadcn/ui primitives
  contexts/AuthContext.tsx   # Auth state provider
  hooks/                     # Custom React hooks
  integrations/supabase/     # Supabase client + TypeScript types
  lib/utils.ts               # Utility helpers
supabase/
  migrations/                # Database migration SQL files
  functions/                 # Edge function source code
```
