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

insert into storage.buckets (id, name, public)
values ('music', 'music', true)
on conflict (id) do update set public = true;

drop policy if exists "Admin can upload music files" on storage.objects;
create policy "Admin can upload music files"
on storage.objects for insert to authenticated
with check (

	bucket_id = 'music'
	and owner_id = auth.uid()::text
	and auth.uid() = '13df2e26-2285-43de-855d-ba42c9c9ff8d'::uuid
);

drop policy if exists "Authenticated users can read music files" on storage.objects;
create policy "Authenticated users can read music files"
on storage.objects for select to authenticated
using (bucket_id = 'music');

create table if not exists public.games (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	url text not null,
	created_by uuid not null references auth.users(id),
	created_at timestamptz not null default now()
);

alter table public.games enable row level security;

drop policy if exists "Authenticated users can read games" on public.games;
create policy "Authenticated users can read games"
on public.games for select to authenticated using (true);

drop policy if exists "Admin can add games" on public.games;
create policy "Admin can add games"
on public.games for insert to authenticated
with check (created_by = auth.uid() and auth.uid() = '13df2e26-2285-43de-855d-ba42c9c9ff8d'::uuid);

grant select, insert on table public.games to authenticated;