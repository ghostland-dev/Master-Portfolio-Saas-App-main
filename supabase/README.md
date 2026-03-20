# Supabase SQL (local Docker)

## Init order (`docker-entrypoint-initdb.d`)

| File | Stack | Role |
|------|--------|------|
| `000-roles.sql` | `supabase/postgres` + deploy | Early `auth.jwt()` / `auth.uid()` from `request.jwt.claims` (before image `migrate.sh`); `CREATE SCHEMA auth` only — **no** `CREATE ROLE` (migrations own roles) |
| `001-plain-postgres-auth-stubs.sql` | **Only** vanilla `postgres:*` (`docker-compose.prod.yml`) | Roles, schema grants, null JWT stubs for RLS without PostgREST |
| `002-seed.sql` | All | App enums/tables, demo rows, RLS (`user_metadata.role` via `is_app_admin()`), optional trigger on `auth.users` |

**Do not** mount `001-*` when using `supabase/postgres` (real JWT helpers already exist).

Legacy SQL under `migrations/` is not executed by Compose; this folder is the single source for local schema + seed.

## Local URLs (default ports)

| Service | URL |
|---------|-----|
| Next.js app (Compose) | http://localhost:3000 |
| Kong (Supabase API, host → container 8000) | http://localhost:8001 |
| Supabase Studio | http://localhost:3001 |
| MailHog UI | http://localhost:8025 |
| Postgres (host) | `localhost:54322` (user `postgres`, password from `supabase.env`) |

Use `NEXT_PUBLIC_SUPABASE_URL=http://localhost:8001` on the host browser. Inside the Compose `app` service, set `SUPABASE_SERVER_URL=http://kong:8000` for server-side calls.
