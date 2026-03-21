# Supabase SQL (local Docker)

## Init order (`docker-entrypoint-initdb.d`)

| File | Stack | Role |
|------|--------|------|
| `000-roles.sql` | `supabase/postgres` + deploy | Early `auth.jwt()` / `auth.uid()` from `request.jwt.claims` (before image `migrate.sh`); `CREATE SCHEMA auth` only — **no** `CREATE ROLE` (migrations own roles) |
| `001-plain-postgres-auth-stubs.sql` | **Only** vanilla `postgres:*` (`docker-compose.prod.yml`) | Roles, schema grants, null JWT stubs for RLS without PostgREST |
| `002-seed.sql` | All | App enums/tables, demo rows, RLS (`user_metadata.role` via `is_app_admin()`), optional trigger on `auth.users` |
| `003-site-content.sql` | All | **Site public** : portfolio, services, ressources, grilles techno, compétences accueil (`site_*` tables + RLS lecture anonyme) |
| `z-seed-auth-users.sql` | **Supabase** (`docker-compose.yml`, `deploy/docker-compose.prod.yml`) | Comptes GoTrue `auth.users` (email / mot de passe) après les migrations internes (`z-` pour s’exécuter **après** `migrations/`) ; aligné sur `public.users` + admin démo ; **non** monté sur `docker-compose.prod.yml` (Postgres vanilla) |

**Do not** mount `001-*` when using `supabase/postgres` (real JWT helpers already exist).

**Base déjà initialisée** : si le volume Postgres existait avant l’ajout de `003-site-content.sql`, exécuter ce fichier une fois à la main (psql ou SQL Editor dans Studio) pour créer les tables `site_*` et les données. Idem pour `z-seed-auth-users.sql` si la base existait déjà (exécuter une fois à la main pour peupler `auth.users`, sinon la connexion par email échoue).

### Comptes démo (connexion app / GoTrue)

Mot de passe unique : **`Demo123!`**

| Rôle | Email |
|------|--------|
| Admin | `ismail@mouyahada.fr`, `admin@portfolio.demo` |
| Client | `marie.dupont@retailtech.com`, `jean.martin@globalservices.com`, `sophie.legrand@techstart.fr`, `thomas.bernard@innovatecorp.com`, `camille.petit@digitalwave.fr` |

Le déclencheur `handle_new_user()` met à jour `public.users` à partir de `raw_user_meta_data.role` (`admin` si la métadonnée vaut `admin`, sinon `client`). Comme `002-seed.sql` s’exécute avant la création de `auth.users` par les migrations de l’image, le trigger y est souvent absent : `z-seed-auth-users.sql` recrée `on_auth_user_created` avant d’insérer les comptes, pour que l’admin supplémentaire `admin@portfolio.demo` (et les futurs inscrits) soient bien reflétés dans `public.users`.

## Identifiants / variables (local)

Les valeurs par défaut du stack Docker sont dans `supabase.env` (à copier vers `.env` à la racine du projet ou à charger avec Compose).

| Rôle | Variable | Exemple local (démo) |
|------|-----------|-------------------------|
| API Supabase (navigateur) | `NEXT_PUBLIC_SUPABASE_URL` | `http://localhost:8001` |
| Clé anonyme (pages + RLS) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | = `ANON_KEY` dans `supabase.env` (JWT rôle `anon`) |
| App Next (serveur → Kong dans Compose) | `SUPABASE_SERVER_URL` | `http://kong:8000` |
| Postgres (hôte) | `POSTGRES_PASSWORD`, port | mot de passe = `POSTGRES_PASSWORD` ; port hôte souvent `54322` |
| **Service role** (bypass RLS — admin backend uniquement) | `SUPABASE_SERVICE_ROLE_KEY` / `SERVICE_ROLE_KEY` | Ne jamais exposer au client ; réservé scripts serveur / Studio |

**JWT démo** (`ANON_KEY` / `SERVICE_ROLE_KEY`) : ce sont les jetons standards **Supabase local demo** (même secret que les images officielles). En production, régénérez `JWT_SECRET` et toutes les clés via le dashboard du projet Supabase.

**Où éditer le contenu du site** : tables `site_portfolio`, `site_services`, `site_service_tools`, `site_resources`, `site_tech_stack`, `site_home_skills` (Supabase Studio → Table Editor). Les politiques RLS permettent la **lecture publique** des lignes `published = true` pour `anon`.

**Contact** : la table `contact_messages` (dans `003-site-content.sql`) enregistre les soumissions du formulaire. Politiques : **INSERT** autorisé pour `anon` et `authenticated` ; **SELECT** uniquement si `is_app_admin()` (JWT utilisateur admin). La route `POST /api/contact` utilise le client Supabase avec la clé anon.

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
