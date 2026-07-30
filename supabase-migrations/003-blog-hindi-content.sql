-- Run this once in the Supabase SQL Editor (same as previous migrations).
-- Adds Hindi title/content fields to blog_posts. Both are nullable --
-- most existing posts have no Hindi version yet, and the app falls back
-- to the English title/content automatically whenever the Hindi field
-- is empty, so this is safe to run without breaking any live post.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_hi text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_hi text;
