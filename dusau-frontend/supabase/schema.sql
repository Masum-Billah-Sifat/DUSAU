-- DUSAU first-stage database schema
-- Run this in Supabase SQL Editor.
-- It creates auth/org foundation plus all content tables needed later.

create extension if not exists pgcrypto;

-- Shared fixed list used by committees.from_year, committees.to_year,
-- committee_members.session, and alumni.session.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'dusau_session_year') then
    create type dusau_session_year as enum (
      '2001-02',
  '2002-03',
  '2003-04',
  '2004-05',
  '2005-06',
  '2006-07',
  '2007-08',
  '2008-09',
  '2009-10',
  '2010-11',
  '2011-12',
  '2012-13',
  '2013-14',
  '2014-15',
  '2015-16',
  '2016-17',
  '2017-18',
  '2018-19',
  '2019-20',
  '2020-21',
  '2021-22',
  '2022-23',
  '2023-24',
  '2024-25',
  '2025-26',
  '2026-27',
  '2027-28',
  '2028-29',
  '2029-30',
  '2030-31',
  '2031-32',
  '2032-33',
  '2033-34',
  '2034-35',
  '2035-36',
  '2036-37',
  '2037-38',
  '2038-39',
  '2039-40',
  '2040-41',
  '2041-42',
  '2042-43',
  '2043-44',
  '2044-45',
  '2045-46',
  '2046-47',
  '2047-48',
  '2048-49',
  '2049-50'
    );
  end if;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1) ORGANIZATION: exactly one row, id = 1.
create table if not exists organizations (
  id integer primary key default 1 check (id = 1),
  public_email text not null,
  public_phone text not null,
  cover_image_path text not null,
  cover_title text not null,
  cover_description text not null,
  admin_email text not null,
  admin_password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_organizations_updated_at on organizations;
create trigger trg_organizations_updated_at
before update on organizations
for each row execute function set_updated_at();

-- 2) ADMIN SESSIONS: created on login, revoked on logout/logout-all/password/email changes.
create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id integer not null default 1 references organizations(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  user_agent text,
  ip_address text
);

create index if not exists idx_admin_sessions_org_active
on admin_sessions (organization_id, expires_at)
where revoked_at is null;

-- 3) COMMITTEES
create table if not exists committees (
  id uuid primary key default gen_random_uuid(),
  from_year dusau_session_year not null,
  to_year dusau_session_year not null,
  summary text not null,
  is_archived boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only one pinned committee at a time.
create unique index if not exists ux_committees_one_pinned
on committees (is_pinned)
where is_pinned = true;

create index if not exists idx_committees_public_order
on committees (is_archived, sort_order, created_at desc);

drop trigger if exists trg_committees_updated_at on committees;
create trigger trg_committees_updated_at
before update on committees
for each row execute function set_updated_at();

-- 4) COMMITTEE MEMBERS
create table if not exists committee_members (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references committees(id) on delete cascade,
  name text not null,
  profile_image_path text not null,
  department text not null,
  position text not null,
  session dusau_session_year not null,
  is_archived boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  pinned_sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_committee_members_committee_order
on committee_members (committee_id, is_archived, sort_order, created_at desc);

create index if not exists idx_committee_members_committee_pinned_order
on committee_members (committee_id, is_pinned, pinned_sort_order, created_at desc)
where is_pinned = true and is_archived = false;

drop trigger if exists trg_committee_members_updated_at on committee_members;
create trigger trg_committee_members_updated_at
before update on committee_members
for each row execute function set_updated_at();

-- 5) ALUMNI
create table if not exists alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profile_image_path text not null,
  department text not null,
  latest_dusau_position text not null,
  session dusau_session_year not null,
  short_quote text,
  current_company text,
  current_company_position text,
  workplace text,
  workplace_position text,
  is_archived boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  pinned_sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_alumni_public_order
on alumni (is_archived, sort_order, created_at desc);

create index if not exists idx_alumni_pinned_order
on alumni (is_pinned, pinned_sort_order, created_at desc)
where is_pinned = true and is_archived = false;

drop trigger if exists trg_alumni_updated_at on alumni;
create trigger trg_alumni_updated_at
before update on alumni
for each row execute function set_updated_at();

-- 6) ADVISORS
create table if not exists advisors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profile_image_path text not null,
  workplace text not null,
  position_at_workplace text not null,
  short_quote text,
  is_archived boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  pinned_sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_advisors_public_order
on advisors (is_archived, sort_order, created_at desc);

create index if not exists idx_advisors_pinned_order
on advisors (is_pinned, pinned_sort_order, created_at desc)
where is_pinned = true and is_archived = false;

drop trigger if exists trg_advisors_updated_at on advisors;
create trigger trg_advisors_updated_at
before update on advisors
for each row execute function set_updated_at();

-- 7) GALLERY
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_path text not null,
  is_archived boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  pinned_sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_items_public_order
on gallery_items (is_archived, sort_order, created_at desc);

create index if not exists idx_gallery_items_pinned_order
on gallery_items (is_pinned, pinned_sort_order, created_at desc)
where is_pinned = true and is_archived = false;

drop trigger if exists trg_gallery_items_updated_at on gallery_items;
create trigger trg_gallery_items_updated_at
before update on gallery_items
for each row execute function set_updated_at();

-- 8) EVENTS
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date date not null,
  category text not null,
  location_tags text[] not null check (cardinality(location_tags) >= 1),
  cover_image_path text not null,
  is_archived boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  pinned_sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_public_order
on events (is_archived, event_date desc, sort_order, created_at desc);

create index if not exists idx_events_pinned_order
on events (is_pinned, pinned_sort_order, event_date desc)
where is_pinned = true and is_archived = false;

drop trigger if exists trg_events_updated_at on events;
create trigger trg_events_updated_at
before update on events
for each row execute function set_updated_at();

-- 9) EVENT IMAGES
create table if not exists event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  image_path text not null,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_event_images_event_order
on event_images (event_id, is_archived, sort_order, created_at desc);

drop trigger if exists trg_event_images_updated_at on event_images;
create trigger trg_event_images_updated_at
before update on event_images
for each row execute function set_updated_at();

-- 10) EVENT VIDEOS
create table if not exists event_videos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  youtube_url text not null,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_event_videos_event_order
on event_videos (event_id, is_archived, sort_order, created_at desc);

drop trigger if exists trg_event_videos_updated_at on event_videos;
create trigger trg_event_videos_updated_at
before update on event_videos
for each row execute function set_updated_at();

-- Notes:
-- 1. Max pinned count rules such as alumni/advisors/gallery/events <= 10 are best enforced
--    inside the protected API transaction logic because the admin may pin/unpin/reorder together.
-- 2. Business rules such as "at least one pinned alumni" or "committee can be pinned only if
--    it has at least one pinned member" are also best enforced in API logic.
-- 3. This schema already includes normal sort_order and pinned_sort_order so both general
--    listing order and pinned section order can be controlled later.
