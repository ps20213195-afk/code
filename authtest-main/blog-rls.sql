-- Run this in the Supabase SQL editor to enable community blog posts and comments.
create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    title text not null check (char_length(title) between 1 and 120),
    body text not null check (char_length(body) between 1 and 10000),
    media_url text check (media_url is null or (char_length(media_url) <= 2048 and media_url ~ '^https://')),
    author_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

create table if not exists public.blog_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references public.blog_posts(id) on delete cascade,
    body text not null check (char_length(body) between 1 and 2000),
    media_url text check (media_url is null or (char_length(media_url) <= 2048 and media_url ~ '^https://')),
    author_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
alter table public.blog_comments enable row level security;

drop policy if exists "Signed-in users can read blog posts" on public.blog_posts;
create policy "Signed-in users can read blog posts"
on public.blog_posts for select to authenticated using (true);

drop policy if exists "Signed-in users can publish blog posts" on public.blog_posts;
create policy "Signed-in users can publish blog posts"
on public.blog_posts for insert to authenticated with check (author_id = auth.uid());

drop policy if exists "Signed-in users can read blog comments" on public.blog_comments;
create policy "Signed-in users can read blog comments"
on public.blog_comments for select to authenticated using (true);

drop policy if exists "Signed-in users can comment on blog posts" on public.blog_comments;
create policy "Signed-in users can comment on blog posts"
on public.blog_comments for insert to authenticated with check (
    author_id = auth.uid()
    and exists (select 1 from public.blog_posts where id = post_id)
);

grant select, insert on public.blog_posts, public.blog_comments to authenticated;
notify pgrst, 'reload schema';