-- Cover options for a work on the home page. Run once in the Supabase SQL
-- editor; safe to run again.
--
-- `cover_bg_url`: a photo for the cover to sit on. When set, it fills the card
-- and the work's own media sits framed in the middle of it. Left null, the card
-- falls back to the plain grey backdrop.
--
-- `cover_full`: the work's media fills the whole card instead, with no frame
-- and no backdrop — for shots that are already composed as a full image.
--
-- Both are additions to existing rows, and the site and /admin treat a missing
-- value as "off".

alter table public.selected_works add column if not exists cover_bg_url text;
alter table public.selected_works add column if not exists cover_full boolean not null default false;

-- The first covers. The photos ship with the site in public/images/covers, so
-- these are paths rather than storage URLs; anything uploaded through /admin
-- replaces them with a storage URL.
update public.selected_works
    set cover_bg_url = '/images/covers/sybelle-mountains.jpg'
    where case_study_id in (select id from public.case_studies where title = 'Sybelle');

update public.selected_works
    set cover_bg_url = '/images/covers/lumen-sky.jpg'
    where case_study_id in (select id from public.case_studies where title = 'Lumen');

update public.selected_works
    set cover_full = true
    where case_study_id in (select id from public.case_studies where title = 'STN App');
