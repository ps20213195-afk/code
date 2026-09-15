-- Run this in the Supabase SQL editor for the public.chat and profiles tables.
alter table public.profiles enable row level security;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant select, update on table public.profiles to authenticated;

alter table public.chat enable row level security;

drop policy if exists "Authenticated users can read chat" on public.chat;
create policy "Authenticated users can read chat"
on public.chat
for select
to authenticated
using (true);

drop policy if exists "Users can insert their own chat messages" on public.chat;
create policy "Users can insert their own chat messages"
on public.chat
for insert
to authenticated
with check (uuid = auth.uid());

grant select, insert on table public.chat to authenticated;

create table if not exists public.music (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	url text not null,
	created_by uuid not null references auth.users(id),
	created_at timestamptz not null default now()
);

alter table public.music enable row level security;

drop policy if exists "Authenticated users can read music" on public.music;
create policy "Authenticated users can read music"
on public.music for select to authenticated using (true);

drop policy if exists "Admin can publish music" on public.music;
create policy "Admin can publish music"
on public.music for insert to authenticated
with check (created_by = auth.uid() and auth.uid() = '13df2e26-2285-43de-855d-ba42c9c9ff8d'::uuid);

grant select, insert on table public.music to authenticated;