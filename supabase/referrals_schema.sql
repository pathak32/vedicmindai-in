-- VedicMindAI Referral System Schema
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.referrals (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  referral_count   INTEGER DEFAULT 0,
  converted_count  INTEGER DEFAULT 0,
  reward_claimed   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_uses (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code   TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  converted       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referral" ON public.referrals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own referral" ON public.referrals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read referral_uses" ON public.referral_uses FOR SELECT USING (true);
CREATE POLICY "Users can insert referral use" ON public.referral_uses FOR INSERT WITH CHECK (auth.uid() = referred_user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_uses_code ON public.referral_uses(referral_code);
