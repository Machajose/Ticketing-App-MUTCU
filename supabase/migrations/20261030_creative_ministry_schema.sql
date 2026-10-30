-- Rebrand Supabase objects and ticket references for Creative Ministry Tickets.
-- Run this once in the Supabase SQL Editor before deploying the client code that uses
-- creative_ministry_events, creative_ministry_organizers, and creative_ministry_tickets.
BEGIN;

ALTER TABLE public.gems_events RENAME TO creative_ministry_events;
ALTER TABLE public.gems_organizers RENAME TO creative_ministry_organizers;
ALTER TABLE public.gems_tickets RENAME TO creative_ministry_tickets;
ALTER SEQUENCE public.gems_ticket_number_seq RENAME TO creative_ministry_ticket_number_seq;

ALTER FUNCTION public.gems_has_role(text[]) RENAME TO creative_ministry_has_role;
CREATE OR REPLACE FUNCTION public.creative_ministry_has_role(allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.creative_ministry_organizers
    WHERE user_id = auth.uid()
      AND role = ANY (allowed_roles)
  );
$$;

ALTER TABLE public.creative_ministry_tickets
  ALTER COLUMN ticket_code SET DEFAULT (
    'KIF'::text || lpad(nextval('public.creative_ministry_ticket_number_seq'::regclass)::text, 3, '0'::text)
  );

-- Stop with a clear message if existing data has duplicate payment references.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.creative_ministry_tickets
    WHERE mpesa_code IS NOT NULL AND btrim(mpesa_code) <> ''
    GROUP BY upper(btrim(mpesa_code))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate M-Pesa references exist. Resolve them before applying the Creative Ministry rename migration.';
  END IF;
END $$;

-- Prevent a M-Pesa transaction reference from issuing multiple tickets.
CREATE UNIQUE INDEX IF NOT EXISTS creative_ministry_tickets_mpesa_code_unique
  ON public.creative_ministry_tickets (upper(btrim(mpesa_code)))
  WHERE mpesa_code IS NOT NULL AND btrim(mpesa_code) <> '';

-- Rename policy names that carry the previous brand. The policy expressions keep
-- their existing permissions and continue to reference the renamed helper function.
DO $$
DECLARE
  item record;
  new_name text;
BEGIN
  FOR item IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('creative_ministry_events', 'creative_ministry_organizers', 'creative_ministry_tickets')
      AND policyname ILIKE '%gems%'
  LOOP
    new_name := regexp_replace(item.policyname, 'gems', 'cm', 'gi');
    EXECUTE format('ALTER POLICY %I ON %I.%I RENAME TO %I', item.policyname, item.schemaname, item.tablename, new_name);
  END LOOP;
END $$;

-- Rename legacy constraint names without changing constraints or their enforcement.
DO $$
DECLARE
  item record;
  new_name text;
BEGIN
  FOR item IN
    SELECT c.conname, t.relname AS table_name
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname IN ('creative_ministry_events', 'creative_ministry_organizers', 'creative_ministry_tickets')
      AND c.conname ILIKE '%gems%'
  LOOP
    new_name := regexp_replace(item.conname, 'gems', 'cm', 'gi');
    EXECUTE format('ALTER TABLE public.%I RENAME CONSTRAINT %I TO %I', item.table_name, item.conname, new_name);
  END LOOP;
END $$;

-- Rename standalone indexes on these tables while leaving constraint-backed indexes
-- to the constraint rename above.
DO $$
DECLARE
  item record;
  new_name text;
BEGIN
  FOR item IN
    SELECT idx.relname AS index_name
    FROM pg_index i
    JOIN pg_class idx ON idx.oid = i.indexrelid
    JOIN pg_class tbl ON tbl.oid = i.indrelid
    JOIN pg_namespace n ON n.oid = tbl.relnamespace
    WHERE n.nspname = 'public'
      AND tbl.relname IN ('creative_ministry_events', 'creative_ministry_organizers', 'creative_ministry_tickets')
      AND idx.relname ILIKE '%gems%'
      AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conindid = idx.oid)
  LOOP
    new_name := regexp_replace(item.index_name, 'gems', 'cm', 'gi');
    EXECUTE format('ALTER INDEX public.%I RENAME TO %I', item.index_name, new_name);
  END LOOP;
END $$;

COMMIT;
