-- Run this in the Supabase SQL editor for the public.chat and profiles tables.
alter table public.profiles enable row level security;
alter table public.profiles add column if not exists avatar_url text;

drop policy if exists "Authenticated users can read chat profiles" on public.profiles;
create policy "Authenticated users can read chat profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant select, update on table public.profiles to authenticated;

-- Replace missing or UUID-only profile names with a readable default.
create or replace function public.set_default_profile_username()
returns trigger
language plpgsql
set search_path = public
as $$
begin
	if new.username is null
		or btrim(new.username) = ''
		or lower(btrim(new.username)) = lower(new.id::text)
		or btrim(new.username) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
		new.username := 'User ' || left(new.id::text, 6);
	end if;
	return new;
end;
$$;

drop trigger if exists profiles_default_username on public.profiles;
create trigger profiles_default_username
before insert or update of username on public.profiles
for each row execute function public.set_default_profile_username();

update public.profiles
set username = 'User ' || left(id::text, 6)
where username is null
	or btrim(username) = ''
	or lower(btrim(username)) = lower(id::text)
	or btrim(username) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

create table if not exists public.chat_rooms (
	id uuid primary key default gen_random_uuid(),
	name text not null check (char_length(name) between 1 and 40),
	created_by uuid references auth.users(id),
	created_at timestamptz not null default now()
);

alter table public.chat_rooms drop constraint if exists chat_rooms_name_key;

insert into public.chat_rooms (name)
select 'General'
where not exists (
	select 1 from public.chat_rooms where name = 'General'
);

create table if not exists public.chat_room_members (
	room_id uuid not null references public.chat_rooms(id) on delete cascade,
	user_id uuid not null references auth.users(id) on delete cascade,
	joined_at timestamptz not null default now(),
	primary key (room_id, user_id)
);

create table if not exists public.chat_invites (
	code text primary key,
	room_id uuid not null references public.chat_rooms(id) on delete cascade,
	created_by uuid not null references auth.users(id),
	created_at timestamptz not null default now(),
	consumed_by uuid references auth.users(id),
	consumed_at timestamptz
);

alter table public.chat
	add column if not exists room_id uuid references public.chat_rooms(id);

update public.chat
set room_id = (select id from public.chat_rooms where name = 'General' limit 1)
where room_id is null
	and exists (select 1 from public.chat_rooms where name = 'General');

alter table public.chat alter column room_id set not null;

-- Keep existing rooms private to their creator and users who actually participated.
insert into public.chat_room_members (room_id, user_id)
select rooms.id, rooms.created_by
from public.chat_rooms as rooms
where rooms.created_by is not null
union
select messages.room_id, messages.uuid
from public.chat as messages
where messages.uuid is not null
on conflict (room_id, user_id) do nothing;

create or replace function public.is_chat_room_member(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
	select exists (
		select 1 from public.chat_room_members
		where room_id = p_room_id and user_id = auth.uid()
	);
$$;

create or replace function public.create_private_chat(p_name text)
returns table (room_id uuid, room_name text, share_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
	v_user_id uuid := auth.uid();
	v_room_id uuid;
	v_room_name text := regexp_replace(trim(p_name), '\s+', ' ', 'g');
	v_code text;
	v_first_words text[] := array['funny', 'happy', 'bright', 'cosmic', 'gentle', 'sleepy', 'tiny', 'golden', 'swift', 'fuzzy'];
	v_second_words text[] := array['apple', 'comet', 'otter', 'waffle', 'panda', 'planet', 'muffin', 'turtle', 'cookie', 'kiwi'];
begin
	if v_user_id is null then
		raise exception 'Sign in to create a private chat';
	end if;
	if v_room_name is null or char_length(v_room_name) < 1 or char_length(v_room_name) > 40 then
		raise exception 'Chat names must be between 1 and 40 characters';
	end if;

	insert into public.chat_rooms (name, created_by)
	values (v_room_name, v_user_id)
	returning id into v_room_id;

	insert into public.chat_room_members (room_id, user_id)
	values (v_room_id, v_user_id);

	loop
		v_code := v_first_words[1 + floor(random() * array_length(v_first_words, 1))::int]
			|| '-' || v_second_words[1 + floor(random() * array_length(v_second_words, 1))::int]
			|| '-' || lpad(floor(random() * 1000000000)::bigint::text, 9, '0');
		begin
			insert into public.chat_invites (code, room_id, created_by)
			values (v_code, v_room_id, v_user_id);
			exit;
		exception when unique_violation then
			-- Generate another code if the random invite collides with an existing one.
			null;
		end;
	end loop;

	return query select v_room_id, v_room_name, v_code;
end;
$$;

create or replace function public.join_chat_with_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
	v_user_id uuid := auth.uid();
	v_room_id uuid;
begin
	if v_user_id is null then
		raise exception 'Sign in to join a private chat';
	end if;

	update public.chat_invites
	set consumed_by = v_user_id, consumed_at = now()
	where code = lower(trim(p_code)) and consumed_at is null
	returning chat_invites.room_id into v_room_id;

	if v_room_id is null then
		raise exception 'This sharing code is invalid or has already been used';
	end if;

	insert into public.chat_room_members (room_id, user_id)
	values (v_room_id, v_user_id)
	on conflict (room_id, user_id) do nothing;

	return v_room_id;
end;
$$;

create or replace function public.create_chat_invite(p_room_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
	v_user_id uuid := auth.uid();
	v_code text;
	v_first_words text[] := array['funny', 'happy', 'bright', 'cosmic', 'gentle', 'sleepy', 'tiny', 'golden', 'swift', 'fuzzy'];
	v_second_words text[] := array['apple', 'comet', 'otter', 'waffle', 'panda', 'planet', 'muffin', 'turtle', 'cookie', 'kiwi'];
begin
	if v_user_id is null then
		raise exception 'Sign in to create a sharing code';
	end if;
	if not exists (
		select 1 from public.chat_room_members
		where room_id = p_room_id and user_id = v_user_id
	) then
		raise exception 'You are not a member of this private chat';
	end if;

	loop
		v_code := v_first_words[1 + floor(random() * array_length(v_first_words, 1))::int]
			|| '-' || v_second_words[1 + floor(random() * array_length(v_second_words, 1))::int]
			|| '-' || lpad(floor(random() * 1000000000)::bigint::text, 9, '0');
		begin
			insert into public.chat_invites (code, room_id, created_by)
			values (v_code, p_room_id, v_user_id);
			return v_code;
		exception when unique_violation then
			-- Retry if the randomly generated code already exists.
			null;
		end;
	end loop;
end;
$$;

revoke all on function public.is_chat_room_member(uuid) from public;
revoke all on function public.create_private_chat(text) from public;
revoke all on function public.join_chat_with_code(text) from public;
revoke all on function public.create_chat_invite(uuid) from public;
grant execute on function public.is_chat_room_member(uuid) to authenticated;
grant execute on function public.create_private_chat(text) to authenticated;
grant execute on function public.join_chat_with_code(text) to authenticated;
grant execute on function public.create_chat_invite(uuid) to authenticated;

alter table public.chat_rooms enable row level security;
alter table public.chat_room_members enable row level security;
alter table public.chat_invites enable row level security;

drop policy if exists "Authenticated users can read chat rooms" on public.chat_rooms;
drop policy if exists "Users can create chat rooms" on public.chat_rooms;
drop policy if exists "Members can read their chat rooms" on public.chat_rooms;
create policy "Members can read their chat rooms"
on public.chat_rooms for select to authenticated
using (public.is_chat_room_member(id));

drop policy if exists "Users can read their room memberships" on public.chat_room_members;
create policy "Users can read their room memberships"
on public.chat_room_members for select to authenticated
using (user_id = auth.uid());

revoke insert, update, delete on public.chat_rooms from authenticated;
revoke all on public.chat_invites from anon, authenticated;
grant select on public.chat_rooms, public.chat_room_members to authenticated;

drop policy if exists "Authenticated users can read chat" on public.chat;
drop policy if exists "Chat members can read room messages" on public.chat;
create policy "Authenticated users can read chat"
on public.chat
for select
to authenticated
using (public.is_chat_room_member(room_id));

drop policy if exists "Users can insert their own chat messages" on public.chat;
create policy "Users can insert their own chat messages"
on public.chat
for insert
to authenticated
with check (
	uuid = auth.uid()
	and public.is_chat_room_member(room_id)
);

drop policy if exists "Users can delete their own chat messages" on public.chat;
create policy "Users can delete their own chat messages"
on public.chat
for delete
to authenticated
using (uuid = auth.uid() and public.is_chat_room_member(room_id));

grant select, insert on table public.chat to authenticated;
grant delete on table public.chat to authenticated;

-- Supabase Table Editor needs a primary key to target individual chat rows.
do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conrelid = 'public.chat'::regclass
			and contype = 'p'
	) then
		alter table public.chat
			add column if not exists chat_row_id uuid default gen_random_uuid();
		update public.chat
		set chat_row_id = gen_random_uuid()
		where chat_row_id is null;
		alter table public.chat alter column chat_row_id set default gen_random_uuid();
		alter table public.chat alter column chat_row_id set not null;
		alter table public.chat add constraint chat_pkey primary key (chat_row_id);
	end if;
end;
$$;

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

-- Delete chat messages and invite-code records every midnight UTC.
-- Chat rooms and memberships are intentionally retained.
create extension if not exists pg_cron with schema pg_catalog;

create or replace function public.cleanup_chat_logs()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
	delete from public.chat;
	delete from public.chat_invites;
end;
$$;

revoke all on function public.cleanup_chat_logs() from public, anon, authenticated;

select cron.unschedule(jobid)
from cron.job
where jobname = 'delete-chat-and-invite-logs-midnight';

select cron.schedule(
	'delete-chat-and-invite-logs-midnight',
	'0 0 * * *',
	'select public.cleanup_chat_logs()'
);

notify pgrst, 'reload schema';