Fix `src/services/sanctions.ts` build errors.

**Cause:** lines 33–54 contain English prose ("also add this type above the function…", "and run this once in your Supabase SQL editor…") and raw SQL (`CREATE EXTENSION …`, `CREATE INDEX …`) that were pasted into the `.ts` file. TypeScript is parsing them as code, producing all 30+ TS1434/TS1005/TS1435 errors.

**Fix:** delete lines 33–54 and replace with a clean type export:

```ts
export type SanctionsEntry = {
  matched_name: string;
  match_score: number;
  watchlist_name: string;
  customer_id: string;
  institution_id: string;
};
```

The stray SQL is discarded — per the standing rule, no database changes. If a trigram index is wanted later, that's a separate explicit DB request.

**Files touched:** `src/services/sanctions.ts` only. No other files, no DB, no edge functions.