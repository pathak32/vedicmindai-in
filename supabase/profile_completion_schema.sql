-- Profile completion fields — gates exams/quizzes/battles until filled.
-- Run this once in the Supabase SQL editor.

-- Student-side fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS board text; -- CBSE / ICSE / State / Other
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class_section text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS roll_number text; -- optional
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url text; -- optional, for certification

-- Parent-side fields (child being tracked)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS child_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS child_school_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS child_grade text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS child_section text;
