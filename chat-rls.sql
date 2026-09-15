-- Run this in the Supabase SQL editor for the public.chat and profiles tables.
-- profiles.id must contain one non-null auth user UUID per profile.
-- Check first; this should return zero rows before adding the primary key.
select id, count(*)
from public.profiles
group by id
having id is null or count(*) > 1;

alter table public.profiles
	alter column id set not null;

alter table public.profiles
	add constraint profiles_pkey primary key (id);

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