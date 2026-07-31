-- Contact form storage. Run once in the Supabase SQL editor.
--
-- The site talks to Supabase with the anon key, so the policies below are what
-- stand between the table and the public: anyone may insert a message, nobody
-- may read one back. Reading is left to the service role, which the browser
-- never sees — do not add a select policy for anon.

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

-- Newest first, for the admin list.
create index if not exists messages_created_at_idx
    on public.messages (created_at desc);
