-- Blog Posts schema — powers both the Admin Panel "Blog Manager" tab
-- and the public /blog pages. Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,          -- 'Vedic Maths' | 'Reasoning' | 'Aptitude'
  subcategory text,
  target_keyword text,
  target_audience text,
  content text NOT NULL,           -- article body, paragraphs separated by blank lines
  status text NOT NULL DEFAULT 'draft',  -- 'draft' | 'published'
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- The admin panel runs as the anon key (PIN-protected in the UI itself),
-- and the public blog pages also read as anon — matching the pattern
-- already used by every other admin-managed table in this app.
CREATE POLICY "anon can read blog_posts" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "anon can insert blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "anon can update blog_posts" ON blog_posts
  FOR UPDATE USING (true);

CREATE POLICY "anon can delete blog_posts" ON blog_posts
  FOR DELETE USING (true);
