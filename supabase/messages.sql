-- Contact form storage. Run once in the Supabase SQL editor.
--
-- The site talks to Supabase with the anon key, so the policies below are what
-- stand between the table and the public: anyone may insert a message, only a
-- signed-in admin may read one back. Do not add a select policy for anon —
-- `authenticated` is reachable only with a real Supabase session, which is what
-- /admin holds.

create table if not exists public.messages (
    id          uuid primary key default gen_random_uuid(),
    created_at  timestamptz not null default now(),
    name        text not null,
    email       text not null,
    kind        text not null default 'other',
    company     text,
    location    text,
    budget      text,
    message     text not null
);

-- If the table already exists from an earlier run, these add the columns.
alter table public.messages add column if not exists company text;
alter table public.messages add column if not exists location text;

alter table public.messages enable row level security;

drop policy if exists "anon can send a message" on public.messages;
create policy "anon can send a message"
    on public.messages
    for insert
    to anon
    with check (true);

-- The admin panel reads with the same anon key, but through a logged-in
-- session, so it arrives as `authenticated`. Nothing else does.
drop policy if exists "authenticated can read messages" on public.messages;
create policy "authenticated can read messages"
    on public.messages
    for select
    to authenticated
    using (true);

drop policy if exists "authenticated can delete a message" on public.messages;
create policy "authenticated can delete a message"
    on public.messages
    for delete
    to authenticated
    using (true);

-- Newest first, for the admin list.
create index if not exists messages_created_at_idx
    on public.messages (created_at desc);
