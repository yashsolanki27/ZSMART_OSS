# Skill: Docker + CI + DB + Render + Vercel Deploy for ZSMART OSS

## Problem
Ship the full-stack ZSMART OSS project to production: containerized backend, CI pipeline, remote database, hosted backend, hosted frontend.

## Files Created

| File | Purpose |
|------|---------|
| `server/Dockerfile` | Multi-stage Node 20 Alpine build. Runs `prisma generate`, copies only prod deps |
| `server/.dockerignore` | Excludes node_modules, .env, .git from build context |
| `docker-compose.yml` | Postgres 16 + API service with health check, migrate+seed on startup |
| `.github/workflows/ci.yml` | On push/PR: install deps, generate Prisma, migrate, seed, build frontend |
| `scripts/deploy-db.ps1` | One-command remote DB deploy: `.\scripts\deploy-db.ps1 "postgresql://..."` |
| `render.yaml` | Render Blueprint — defines API service + Postgres DB, one-click deploy |
| `client/vercel.json` | Vercel config — SPA rewrites, build output dir |

## Commands

```bash
# Local Docker
docker compose up -d          # Start both DB + API
docker compose down           # Stop + remove containers
docker compose down -v        # + wipe volume (fresh DB)

# CI — Push to main → GitHub Actions runs full pipeline automatically

# Remote DB (Neon/Render/any Postgres)
.\scripts\deploy-db.ps1 "postgresql://user:pass@host:5432/db?schema=public"
```

## Render Deploy (backend)
1. Push repo to GitHub
2. Go to https://dashboard.render.com → Blueprint → connect repo
3. Render auto-detects `render.yaml` → creates API service + Postgres DB
4. Set env vars: `CLIENT_ORIGIN` = Vercel URL after frontend deploy

## Vercel Deploy (frontend)
1. Go to https://vercel.com → Import repo → select `client/` as root
2. Set env var: `VITE_API_URL` = Render API URL (e.g. `https://zsmart-oss-api.onrender.com/api`)
3. Deploy — Vercel auto-detects `vercel.json` and `vite.config.js`

## Gotchas
- `docker-compose.yml` uses `prisma migrate deploy` (not `dev`) — CI-safe, no shadow DB needed
- Seed runs every container start via `sh -c` chain — safe for idempotent upserts
- For Render/Neon, set `JWT_SECRET` to a strong random string — never reuse dev secret
- `DATABASE_URL` format: `postgresql://` not `postgres://` (Prisma 5+ requirement)
- Render Blueprint auto-generates `DATABASE_URL` — no manual entry needed
- Vercel SPA rewrites required: `vercel.json` with catch-all `/*` → `/index.html`
