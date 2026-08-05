-- Add referral_code column to profiles so we know which referrer to credit
-- when this user subscribes. Set at signup if they came via /ref/:code URL.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text;

-- Index for fast lookup by referral code
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
