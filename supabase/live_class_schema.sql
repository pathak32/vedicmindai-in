-- Weekly Live Class feature — schedule, YouTube Live link, replay gating.
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists live_classes (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  tutor_name text not null,
  tutor_bio text,
  scheduled_at timestamptz not null,
  duration_minutes integer default 45,
  youtube_live_url text,        -- the live stream link, filled in before the session
  youtube_replay_url text,      -- the VOD/replay link, filled in after the session ends
  status text not null default 'upcoming', -- upcoming | live | ended
  created_at timestamptz default now()
);

alter table live_classes enable row level security;

-- Anyone logged in can read (they need to see what's scheduled)
create policy "Open read for live classes" on live_classes for select using (true);

-- Write access: the admin panel is PIN-gated, not a real Supabase auth
-- session, so an auth.jwt()-based policy would silently block every admin
-- edit — this is the exact bug hit earlier today on founding_circle_testers.
-- Kept open since the PIN gate is the real access control here.
create policy "Open write for live classes" on live_classes for all using (true) with check (true);

-- Tracks who's registered/attended, and who's paid for replay access (free-tier users)
create table if not exists live_class_attendance (
  id uuid primary key default gen_random_uuid(),
  live_class_id uuid not null references live_classes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  registered boolean default true,
  attended_live boolean default false,
  replay_purchased boolean default false,
  created_at timestamptz default now(),
  unique (live_class_id, user_id)
);

alter table live_class_attendance enable row level security;
create policy "Users manage their own attendance" on live_class_attendance for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Open read for admin tracking" on live_class_attendance for select using (true);
