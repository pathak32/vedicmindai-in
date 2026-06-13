-- ═══════════════════════════════════════════════════════════════
-- VedicMindAI — Questions & Quiz Engine Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Questions table (the main question bank)
CREATE TABLE IF NOT EXISTS public.questions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sutra         TEXT NOT NULL,
  topic         TEXT,
  question_text TEXT NOT NULL,
  option_a      TEXT NOT NULL,
  option_b      TEXT NOT NULL,
  option_c      TEXT NOT NULL,
  option_d      TEXT NOT NULL,
  correct_answer CHAR(1) CHECK (correct_answer IN ('a','b','c','d')) NOT NULL,
  explanation   TEXT,
  difficulty    INTEGER CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
  exam_type     TEXT CHECK (exam_type IN ('daily','weekly','olympiad','jee','neet','ssc','upsc','general')) DEFAULT 'general',
  last_used_on  DATE,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Daily quiz schedule (which 5 questions go live each day)
CREATE TABLE IF NOT EXISTS public.daily_quiz_schedule (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_date     DATE NOT NULL UNIQUE,
  question_ids  UUID[] NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quiz results (tracks every attempt)
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type     TEXT CHECK (quiz_type IN ('daily','weekly','olympiad','practice')) DEFAULT 'daily',
  quiz_date     DATE DEFAULT CURRENT_DATE,
  score         INTEGER DEFAULT 0,
  total         INTEGER DEFAULT 5,
  time_taken_sec INTEGER,
  answers       JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Weekly exam schedule
CREATE TABLE IF NOT EXISTS public.weekly_exam_schedule (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start    DATE NOT NULL UNIQUE,
  topic         TEXT,
  question_ids  UUID[] NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Olympiad rounds
CREATE TABLE IF NOT EXISTS public.olympiad_rounds (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round_name    TEXT NOT NULL,
  level         TEXT CHECK (level IN ('junior','senior','master')) DEFAULT 'junior',
  start_date    TIMESTAMPTZ,
  end_date      TIMESTAMPTZ,
  question_ids  UUID[] NOT NULL,
  is_active     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_questions_exam_type ON public.questions(exam_type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_last_used ON public.questions(last_used_on);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_date ON public.quiz_results(quiz_date);
CREATE INDEX IF NOT EXISTS idx_daily_schedule_date ON public.daily_quiz_schedule(quiz_date);

-- ─── RLS Policies ───────────────────────────────────────────────
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quiz_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_exam_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.olympiad_rounds ENABLE ROW LEVEL SECURITY;

-- Questions: anyone can read active questions
CREATE POLICY "Anyone can read active questions" ON public.questions
  FOR SELECT USING (is_active = true);

-- Questions: only admin can insert/update/delete
CREATE POLICY "Admin can manage questions" ON public.questions
  FOR ALL USING (auth.jwt() ->> 'email' IN (
    'hitesh@vedicmindai.in', 'test1@vedicmindai.in', '918573000191@vedicmindai.in'
  ));

-- Daily schedule: anyone can read
CREATE POLICY "Anyone can read daily schedule" ON public.daily_quiz_schedule
  FOR SELECT USING (true);

-- Quiz results: users can only see/insert their own
CREATE POLICY "Users can manage own quiz results" ON public.quiz_results
  FOR ALL USING (auth.uid() = user_id);

-- Weekly + Olympiad: read only
CREATE POLICY "Anyone can read weekly schedule" ON public.weekly_exam_schedule
  FOR SELECT USING (true);
CREATE POLICY "Anyone can read olympiad rounds" ON public.olympiad_rounds
  FOR SELECT USING (true);

-- ─── Auto-schedule today's daily quiz (run once) ────────────────
-- This picks 5 unused questions for today, balanced across difficulties
INSERT INTO public.daily_quiz_schedule (quiz_date, question_ids)
SELECT 
  CURRENT_DATE,
  ARRAY(
    SELECT id FROM public.questions 
    WHERE exam_type = 'daily' AND is_active = true
    AND (last_used_on IS NULL OR last_used_on < CURRENT_DATE - 7)
    ORDER BY difficulty, RANDOM()
    LIMIT 5
  )
ON CONFLICT (quiz_date) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- Done! Now go to Admin Panel → Quiz Manager → Generate with AI
-- ═══════════════════════════════════════════════════════════════
