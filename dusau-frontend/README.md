# DUSAU First Stage: Auth + Organization + Database Foundation

This package contains the first-stage implementation for converting the hardcoded DUSAU site into a dynamic Supabase-backed admin site.

## What is included

- Complete Supabase SQL schema for:
  - `organizations`
  - `admin_sessions`
  - `committees`
  - `committee_members`
  - `alumni`
  - `advisors`
  - `gallery_items`
  - `events`
  - `event_images`
  - `event_videos`
- Fixed enum list from `2001-02` to `2049-50`.
- `from_year`, `to_year`, and `session` use this enum.
- Auth endpoints:
  - `POST /api/admin/auth/login`
  - `GET /api/admin/auth/me`
  - `POST /api/admin/auth/logout`
  - `POST /api/admin/auth/logout-all`
  - `PATCH /api/admin/auth/change-password`
  - `PATCH /api/admin/auth/change-email`
- Organization endpoints:
  - `GET /api/admin/organization`
  - `PATCH /api/admin/organization`
  - `GET /api/public/organization`
- Frontend pages:
  - `/login`
  - `/dashboard`

## Copying files

Copy the folders in this package into your Next.js project root.

Expected project structure after copying:

```txt
src/lib/api/...
src/app/api/admin/...
src/app/api/public/...
src/app/login/page.tsx
src/app/dashboard/page.tsx
supabase/schema.sql
scripts/hash-admin-password.mjs
```

## Required environment variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_service_role_key
JWT_SECRET=use_a_long_random_secret_here
SUPABASE_STORAGE_BUCKET=media
```

`SUPABASE_SECRET_KEY` must be your service role key because backend admin routes need to read/write protected tables.

## Database setup

1. Open Supabase dashboard.
2. Go to SQL Editor.
3. Paste and run `supabase/schema.sql`.

## Create the first admin password hash

Run:

```bash
node scripts/hash-admin-password.mjs "YourStrongPasswordHere"
```

Copy the generated hash.

Then insert/update your single organization row:

```sql
insert into organizations (
  id,
  public_email,
  public_phone,
  cover_image_path,
  cover_title,
  cover_description,
  admin_email,
  admin_password_hash
)
values (
  1,
  'public@example.com',
  '+8801000000000',
  'media/cover.jpg',
  'DUSAU',
  'Dhaka University Statistics Alumni Association',
  'admin@example.com',
  'PASTE_HASH_HERE'
)
on conflict (id) do update set
  public_email = excluded.public_email,
  public_phone = excluded.public_phone,
  cover_image_path = excluded.cover_image_path,
  cover_title = excluded.cover_title,
  cover_description = excluded.cover_description,
  admin_email = excluded.admin_email,
  admin_password_hash = excluded.admin_password_hash;
```

## Run locally

```bash
npm run dev
```

Then visit:

```txt
/login
```

After login, you will be redirected to:

```txt
/dashboard
```

## Auth behavior

- No registration.
- Login only.
- Password is stored as `admin_password_hash`, never plain text.
- Login creates an `admin_sessions` row.
- JWT is stored in an HttpOnly cookie.
- JWT/session expiry is 3 hours.
- No refresh token.
- Hard reload does not log out the admin while the session is valid because `/dashboard` calls `/api/admin/auth/me`.
- Logout revokes only the current session.
- Logout all revokes every active session.
- Changing password/email revokes every active session and forces login again.

## Important notes for later stages

The schema already supports:

- One pinned committee only.
- Pinned and normal ordering via `sort_order` and `pinned_sort_order`.
- Maximum pinned count rules should be enforced in API logic later.
- "At least one pinned item" rules should be enforced in API logic later.
- Event images are mandatory logically, but that should be enforced in the create/update event API later because child rows are inserted separately.
