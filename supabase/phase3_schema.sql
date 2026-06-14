-- VedicMindAI Phase 3 Tables
-- Run in Supabase SQL Editor

-- Demo logins table
CREATE TABLE IF NOT EXISTS public.demo_logins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  password_plain TEXT,
  school_name TEXT NOT NULL,
  city TEXT,
  contact TEXT,
  days INTEGER DEFAULT 7,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaboration requests table
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_name TEXT NOT NULL,
  org_type TEXT DEFAULT 'school',
  city TEXT,
  state TEXT,
  student_count TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table (if not done already)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  referral_count INTEGER DEFAULT 0,
  converted_count INTEGER DEFAULT 0,
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.demo_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Demo logins: only admin
CREATE POLICY "Admin manages demo logins" ON public.demo_logins FOR ALL
  USING (auth.jwt() ->> 'email' IN ('918573000191@vedicmindai.in','hitesh@vedicmindai.in'));

-- Collaboration: anyone can insert, admin reads all
CREATE POLICY "Anyone can submit collaboration" ON public.collaboration_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads collaborations" ON public.collaboration_requests
  FOR SELECT USING (auth.jwt() ->> 'email' IN ('918573000191@vedicmindai.in','hitesh@vedicmindai.in'));

-- Referrals: users own their row
CREATE POLICY "Users manage own referral" ON public.referrals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_demo_expires ON public.demo_logins(expires_at);
CREATE INDEX IF NOT EXISTS idx_collab_status ON public.collaboration_requests(status);

-- profiles table: add missing columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS daily_quiz_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_messages_today INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_last_reset DATE DEFAULT CURRENT_DATE;
