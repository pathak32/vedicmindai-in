-- Site visitor tracking — anonymous session tracking for the public website
-- (separate from `profiles`, which only covers registered/logged-in accounts).
-- Powers the admin panel's Live Visitors + Today's Visitors stats.
-- Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS site_visits (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     text NOT NULL,
  first_seen_at  timestamptz NOT NULL DEFAULT now(),
  last_seen_at   timestamptz NOT NULL DEFAULT now(),
  page_path      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- One row per session_id — heartbeats update the existing row via upsert
-- rather than inserting a new row every time, so the table stays small.
CREATE UNIQUE INDEX IF NOT EXISTS site_visits_session_id_idx ON site_visits (session_id);

-- Fast lookups for "today" and "live now" queries
CREATE INDEX IF NOT EXISTS site_visits_first_seen_idx ON site_visits (first_seen_at);
CREATE INDEX IF NOT EXISTS site_visits_last_seen_idx ON site_visits (last_seen_at);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- The site runs on the anonymous Supabase key for every visitor (logged in
-- or not), so both the tracking writes AND the admin panel's reads need
-- explicit anon policies, or this table silently returns nothing.
CREATE POLICY "Anyone can insert their own visit" ON site_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own visit" ON site_visits
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read visit stats" ON site_visits
  FOR SELECT TO anon, authenticated
  USING (true);
