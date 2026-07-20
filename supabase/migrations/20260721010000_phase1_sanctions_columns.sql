-- ============================================================================
-- Phase 1 — Sanctions / PEP data-model fix (stops guaranteed false negatives)
--
-- Root cause: sync-sanctions* upsert into sanctions_entries columns
-- (full_name, list_name, aliases, nationality, list_type, entity_type,
-- reason, source_url, last_updated) that DO NOT EXIST on the table. The
-- real columns are matched_name (NOT NULL) and watchlist_name (NOT NULL,
-- CHECK IN ('UN','OFAC','EU','UK','CBN')). Every upsert therefore
-- errored out and NO sanctions rows were ever stored — screening silently
-- returned nothing.
--
-- Likewise screen-customer reads full_name (absent) and inserts into
-- screening_results as search_name/search_bvn (absent; real columns are
-- search_name_hash/search_bvn_hash, institution_id NOT NULL) — also failing.
--
-- This migration aligns the schema to what the functions actually need,
-- makes institution_id nullable on the GLOBAL watchlist so shared lists are
-- stored once, adds plaintext matching columns for PEP, and adds trigram
-- indexes so ilike name screening is fast.
-- Idempotent.
-- ============================================================================

-- GIN trigram operator for fast substring name screening.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------- sanctions_entries : add the columns the syncer needs ----------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'aliases'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD COLUMN aliases text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'nationality'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD COLUMN nationality text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'entity_type'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD COLUMN entity_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'source_url'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD COLUMN source_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD COLUMN notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'last_updated'
  ) THEN
    ALTER TABLE public.sanctions_entries ADD COLUMN last_updated timestamptz;
  END IF;
END $$;

-- Global watchlists are shared across institutions; institution_id must be nullable.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sanctions_entries'
      AND column_name = 'institution_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.sanctions_entries ALTER COLUMN institution_id DROP NOT NULL;
  END IF;
END $$;

-- ---------- pep_entries : add plaintext name for matching ----------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pep_entries'
      AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.pep_entries ADD COLUMN full_name text;
  END IF;
END $$;

-- ---------- performance : trigram indexes for ilike name screening ----------
CREATE INDEX IF NOT EXISTS idx_sanctions_name_trgm
  ON public.sanctions_entries USING gin (matched_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pep_full_name_trgm
  ON public.pep_entries USING gin (full_name gin_trgm_ops);

-- Arbiter for the idempotent upsert (ON CONFLICT ("matched_name","watchlist_name")).
-- Without it the upsert errors and nothing is stored (the original code
-- referenced a "full_name,list_name" arbiter that never existed).
CREATE UNIQUE INDEX IF NOT EXISTS uq_sanctions_name_list
  ON public.sanctions_entries (matched_name, watchlist_name);
