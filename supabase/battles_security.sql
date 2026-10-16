-- Battle Mode: stop listing and claiming other players' rooms directly.
-- NOT YET RUN. Run in the SQL Editor, then test a challenge end to end.
-- Requires public.is_admin() from security_admin_rls.sql.

-- 1. Look up an open room by code. Returns only the fields the preview needs.
create or replace function public.battle_find_by_code(p_code text)
returns table (id uuid, code text, topic text, difficulty text, creator_name text, status text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select br.id, br.code, br.topic, br.difficulty, br.creator_name, br.status, br.created_at
  from battle_rooms br
  where br.code = upper(p_code)
    and br.status = 'waiting'
    and br.opponent_id is null
  limit 1;
$$;

-- 2. Accept an open room. Sets the opponent only if the room is still open and
--    the caller is not its creator.
create or replace function public.battle_accept(p_room uuid, p_name text, p_starts timestamptz)
returns setof battle_rooms
language sql
security definer
set search_path = public
as $$
  update battle_rooms
     set opponent_id = auth.uid(),
         opponent_name = p_name,
         status = 'starting',
         battle_starts_at = p_starts
   where id = p_room
     and opponent_id is null
     and status = 'waiting'
     and creator_id <> auth.uid()
     and auth.uid() is not null
  returning *;
$$;

grant execute on function public.battle_find_by_code(text) to anon, authenticated;
grant execute on function public.battle_accept(uuid, text, timestamptz) to authenticated;

-- 3. Tighten battle_rooms policies.
--    Drop the open read, and the clauses that let anyone see or claim open rooms.
drop policy if exists "Open read for admin tracking" on battle_rooms;
drop policy if exists "Players can view their own battle rooms" on battle_rooms;
drop policy if exists "Players can update their own battle rooms" on battle_rooms;

create policy "Players and admins view battle rooms" on battle_rooms
  for select using (
    auth.uid() = creator_id or auth.uid() = opponent_id or public.is_admin()
  );

create policy "Players update their battle rooms" on battle_rooms
  for update using (
    auth.uid() = creator_id or auth.uid() = opponent_id or public.is_admin()
  ) with check (
    auth.uid() = creator_id or auth.uid() = opponent_id or public.is_admin()
  );
-- The insert policy "Anyone authenticated can create a battle room" stays.
