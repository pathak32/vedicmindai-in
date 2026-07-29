-- Run this once in the Supabase SQL Editor (same as previous migrations).
-- Adds two things: a likes counter on blog_posts, and a moderated
-- comments system (blog_comments).

-- ── Likes ───────────────────────────────────────────────────────────────
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0;

-- Atomic increment via RPC — avoids the read-then-write race condition
-- two simultaneous likes on the same post would otherwise hit.
CREATE OR REPLACE FUNCTION increment_blog_likes(post_slug text)
RETURNS integer
LANGUAGE sql
AS $$
  UPDATE blog_posts SET likes = likes + 1 WHERE slug = post_slug
  RETURNING likes;
$$;

-- ── Comments (moderated) ────────────────────────────────────────────────
-- Anyone can submit a comment (name + text, no login required — this is a
-- public marketing blog, not gated app content). Nothing shows publicly
-- until approved from the admin panel. This is the same shape as the
-- Question Review Queue and Blog Manager drafts: submitted -> reviewed ->
-- approved -> visible.
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Note on this app's existing security model: like blog_posts itself
-- (anon can already SELECT drafts, just never shown by the public UI),
-- comment moderation here is enforced by app code, not by RLS row
-- filtering -- the admin panel needs to read pending/rejected rows with
-- the same anon key the public site uses, since there's no separate
-- "admin" Postgres role anywhere in this app (admin access is a
-- client-side PIN gate). This matches the established pattern rather
-- than introducing a new one.
DROP POLICY IF EXISTS "anon can read blog_comments" ON blog_comments;
CREATE POLICY "anon can read blog_comments" ON blog_comments
  FOR SELECT USING (true);

-- Inserts are restricted to status='pending' at the database level, so a
-- direct API call can't bypass moderation by inserting as 'approved'.
DROP POLICY IF EXISTS "anon can submit pending blog_comments" ON blog_comments;
CREATE POLICY "anon can submit pending blog_comments" ON blog_comments
  FOR INSERT WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "anon can moderate blog_comments" ON blog_comments;
CREATE POLICY "anon can moderate blog_comments" ON blog_comments
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "anon can delete blog_comments" ON blog_comments;
CREATE POLICY "anon can delete blog_comments" ON blog_comments
  FOR DELETE USING (true);
