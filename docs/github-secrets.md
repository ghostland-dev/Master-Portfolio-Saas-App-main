## SSH & Server Access (Shared for all environments)
Since you are using the same server for Prod, Staging, and Dev, you only need to configure these 3 secrets:

- `SERVER_HOST`: Your server's IP address or domain.
- `SERVER_USERNAME`: Your SSH username (e.g., `nomadops`).
- `SERVER_PASSWORD`: Your SSH password.

The deployment script will automatically isolate each environment in its own folder (e.g., `~/Apps/portfolio-saas/main`, `~/Apps/portfolio-saas/staging`).

## Production Credentials (Shared/Env-dependent)
The following secrets are used during the deployment phase:
- `DOMAIN`: Your production/target domain.
- `POSTGRES_PASSWORD`: Production database password.
- `JWT_SECRET`: Secure random string for JWT.
- `ANON_KEY` / `SERVICE_ROLE_KEY`: Supabase keys.
- `REALTIME_SECRET_KEY_BASE`: Secret for the Realtime service.

## Build Configuration (Build-time)
- `NEXT_PUBLIC_SUPABASE_URL`: Target Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Same as `ANON_KEY`.

## Optional (For Email)
- `SMTP_HOST`: Your SMTP server (e.g., `smtp.gmail.com`).
- `SMTP_PORT`: Port (e.g., `587`).
- `SMTP_USER`: SMTP username.
- `SMTP_PASS`: SMTP password.

---

### Deployment Flow (Single Workflow)
1. **Trigger**: Pushing to the `main` branch.
2. **Phase 1: CI**: Runs tests (unit, lint, e2e) and builds the frontend image.
3. **Phase 2: Build & Push**: Pushes the production-ready image to **GitHub Container Registry (GHCR)**.
4. **Phase 3: CD**: Connects to your server via SSH, syncs configuration files, and restarts your stack with the latest image.

All these steps are now contained in a single file: `.github/workflows/ci.yml`.
