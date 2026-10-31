-- Level concept PDFs: premium plans download directly, everyone else requests access
-- and an admin approves or rejects (Admin panel -> PDF Requests).
-- NOT YET RUN. Run once in the Supabase SQL Editor.
-- Admins are the accounts whose app_metadata.role is 'admin' (same check as the Admin panel).

create table if not exists public.pdf_download_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  level       int  not null check (level between 1 and 4),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  unique (user_id, level)
);

alter table public.pdf_download_requests enable row level security;

-- Students see and create only their own requests, and only as pending.
create policy "Students read own pdf requests" on public.pdf_download_requests
  for select using (
    user_id = auth.uid()
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );

create policy "Students create own pdf request" on public.pdf_download_requests
  for insert with check (user_id = auth.uid() and status = 'pending');

-- A student may re-open a request that was rejected (back to pending), nothing else.
create policy "Students reopen rejected pdf request" on public.pdf_download_requests
  for update
  using (user_id = auth.uid() and status = 'rejected')
  with check (user_id = auth.uid() and status = 'pending');

-- Admins approve, reject and clean up.
create policy "Admins manage pdf requests" on public.pdf_download_requests
  for all
  using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
  with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
