-- Battle Mode: 1v1 real-time Vedic Maths battles
-- Run this in Supabase Dashboard → SQL Editor

create table if not exists battle_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  creator_id uuid not null references auth.users(id),
  creator_name text not null,
  opponent_id uuid references auth.users(id),
  opponent_name text,
  status text not null default 'waiting', -- waiting | active | completed
  questions jsonb not null,               -- array of {prompt, options, answer, tag}
  current_round int not null default 0,
  round_winner_id uuid,                   -- winner of the CURRENT round, null until answered
  round_started_at timestamptz default now(),
  creator_score int not null default 0,
  opponent_score int not null default 0,
  match_winner_id uuid,                   -- overall winner once someone reaches 5
  created_at timestamptz default now()
);

-- Row Level Security: only the two players in a room can see/update it
alter table battle_rooms enable row level security;

create policy "Players can view their own battle rooms"
  on battle_rooms for select
  using (auth.uid() = creator_id or auth.uid() = opponent_id or opponent_id is null);

create policy "Anyone authenticated can create a battle room"
  on battle_rooms for insert
  with check (auth.uid() = creator_id);

create policy "Players can update their own battle rooms"
  on battle_rooms for update
  using (auth.uid() = creator_id or auth.uid() = opponent_id or opponent_id is null);
  -- "or opponent_id is null" is required so a joining player can claim an
  -- open room in the first place — without it, joining is impossible since
  -- you aren't yet the opponent at the moment you're trying to become one.

-- Enable Realtime so both players see live updates to this table
alter publication supabase_realtime add table battle_rooms;

-- Helpful index for room code lookups
create index if not exists idx_battle_rooms_code on battle_rooms(code);
