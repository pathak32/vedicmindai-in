-- Question Review Queue — Claude-generated candidate questions land here as
-- 'pending'. The admin panel's Question Review tab lets him approve/reject
-- each one after checking the explanation. Approved questions are the
-- source pool for eventually populating the real per-chapter question
-- banks across all three verticals (Vedic Maths, Reasoning, Aptitude).
-- Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS pending_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical        text NOT NULL,              -- 'Vedic Maths' | 'Reasoning' | 'Aptitude'
  chapter_id      text NOT NULL,              -- matches the real chapter/lesson id in the app
  chapter_title   text NOT NULL,              -- denormalized for display, e.g. 'Odd One Out'
  level           text NOT NULL DEFAULT '1',  -- '1' | '2' | '3' | '4'
  question_en     text NOT NULL,
  options         jsonb NOT NULL,             -- array of 4 option strings
  correct_index   int NOT NULL,               -- 0-3
  explanation     text NOT NULL,              -- shown to him for review, and to students once approved
  status          text NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at      timestamptz NOT NULL DEFAULT now(),
  reviewed_at      timestamptz
);

CREATE INDEX IF NOT EXISTS pending_questions_status_idx ON pending_questions (status);
CREATE INDEX IF NOT EXISTS pending_questions_chapter_idx ON pending_questions (chapter_id);

ALTER TABLE pending_questions ENABLE ROW LEVEL SECURITY;

-- Admin panel runs on the anonymous key, same as every other admin table
CREATE POLICY "Anyone can read pending questions" ON pending_questions
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert pending questions" ON pending_questions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update pending questions" ON pending_questions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete pending questions" ON pending_questions
  FOR DELETE TO anon, authenticated USING (true);
