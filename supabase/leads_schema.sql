-- Leads schema — captures emails from lead-magnet forms (starting with the
-- Vedic Maths Formula Cheat Sheet offered after the 5-Second Challenge).
-- Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'mindcheck_cheatsheet',  -- which form/offer captured this lead
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Deliberately INSERT-only for the anon key -- this table holds real user
-- emails, so (unlike blog_posts/pending_questions) anon must NOT be able to
-- SELECT/UPDATE/DELETE, or anyone with devtools open could read the whole
-- email list straight off the public anon key. Reading this table is an
-- admin-only job for now (check it directly in the Supabase dashboard) --
-- an admin-panel view can be added later if he wants one.
DROP POLICY IF EXISTS "anon can insert leads" ON leads;
CREATE POLICY "anon can insert leads" ON leads
  FOR INSERT WITH CHECK (true);
