-- Knowledge Points system — replaces "XP" as a redeemable subscription-discount
-- mechanic, not just a gamification score.
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists knowledge_points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,          -- can be negative (negative marking)
  source text not null,             -- 'daily_quiz' | 'lesson_quiz' | 'practice_question' | 'lesson_completion' | 'battle_mode'
  reference_id text,                -- e.g. lesson id, quiz date — for audit/debugging
  created_at timestamptz default now()
);

alter table knowledge_points_ledger enable row level security;
create policy "Users manage their own points ledger" on knowledge_points_ledger for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Open read for admin tracking" on knowledge_points_ledger for select using (true);

-- One row per user per calendar month — tracks the 3 eligibility criteria and
-- the resulting tier for that month. Monthly subscribers redeem-or-lose each
-- cycle; annual subscribers additionally get an entry in knowledge_points_annual_lock.
create table if not exists knowledge_points_monthly (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_year text not null,          -- 'YYYY-MM'
  total_points integer not null default 0,
  daily_quiz_attempted_pct numeric,  -- % of days in month with a daily quiz attempt
  all_weekly_exams_given boolean default false,
  reasoning_lessons_completed integer default 0,
  maths_lessons_completed integer default 0,
  criteria_met boolean default false,
  tier_reached integer default 0,    -- 0, 1000, 1500, or 2000
  discount_pct integer default 0,    -- 0, 30, 40, or 50
  redeemed boolean default false,
  updated_at timestamptz default now(),
  unique (user_id, month_year)
);

alter table knowledge_points_monthly enable row level security;
create policy "Users manage their own monthly record" on knowledge_points_monthly for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Open read for admin tracking" on knowledge_points_monthly for select using (true);

-- Annual subscribers only: tracks the best-ever tier reached during the
-- subscription year. Never decreases — only upgrades when a later month
-- reaches a higher tier. This is the "best month locks it in" rule.
create table if not exists knowledge_points_annual_lock (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_start_date date not null,
  locked_tier integer default 0,       -- highest tier ever reached this subscription year
  locked_discount_pct integer default 0,
  last_updated_month text,
  redeemed_at_renewal boolean default false,
  updated_at timestamptz default now(),
  unique (user_id, subscription_start_date)
);

alter table knowledge_points_annual_lock enable row level security;
create policy "Users manage their own annual lock" on knowledge_points_annual_lock for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Open read for admin tracking" on knowledge_points_annual_lock for select using (true);
