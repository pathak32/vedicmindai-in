-- Removes generator scaffolding that leaked into published blog text:
-- "---END ARTICLE n---" lines and "Batch X -- ..." labels inside the body.
-- Step 1 counts; step 2 cleans. Run step 1 first.

-- 1. Count affected posts (read-only)
select
  count(*) filter (where content ilike '%---END ARTICLE%' or content_hi ilike '%---END ARTICLE%') as end_marker_posts
from blog_posts;

-- 2. Remove the marker lines (run after reviewing step 1)
update blog_posts
set content = regexp_replace(content, '\n?-+\s*END ARTICLE[^\n]*', '', 'gi'),
    content_hi = regexp_replace(content_hi, '\n?-+\s*END ARTICLE[^\n]*', '', 'gi')
where content ilike '%---END ARTICLE%' or content_hi ilike '%---END ARTICLE%';

-- 3. Verify none remain (should return 0)
select count(*) as remaining from blog_posts
where content ilike '%END ARTICLE%' or content_hi ilike '%END ARTICLE%';
