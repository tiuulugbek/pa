# Production Deployment Runbook

## 1. Pre-deployment

```bash
git pull --ff-only
pnpm install --frozen-lockfile
pnpm db:generate
pnpm lint
pnpm build
docker compose config --quiet
```

Confirm that:

- `.env` contains no `CHANGE_ME` values;
- a recent PostgreSQL backup exists;
- uploaded media is backed up;
- the Prisma migration set matches the intended release;
- disk space and memory are sufficient.

## 2. Backup

```bash
mkdir -p backups

docker compose exec -T postgres \
  pg_dump -U pa_user -d power_automation_db -Fc \
  > "backups/power_automation_$(date +%Y%m%d_%H%M%S).dump"

tar -czf "backups/uploads_$(date +%Y%m%d_%H%M%S).tar.gz" apps/api/uploads
```

Copy backups away from the application server.

## 3. Build and deploy

```bash
docker compose build --pull
docker compose up -d
```

The API container runs `prisma migrate deploy` before starting. It must never use `db push --accept-data-loss` in production.

## 4. Verification

```bash
docker compose ps
docker compose logs --tail=100 api
docker compose logs --tail=100 web
docker compose logs --tail=100 admin
docker compose logs --tail=100 bot
```

Verify:

- public website loads through HTTPS;
- API responds through the configured domain;
- admin authentication works;
- Telegram bot receives and processes a test request;
- product search works;
- uploaded media is accessible;
- no container is restarting repeatedly.

## 5. Rollback

Application rollback:

```bash
git checkout <previous-known-good-commit>
docker compose build
docker compose up -d
```

Database restoration is destructive and should only be used after confirming the migration cannot be safely reversed:

```bash
docker compose stop api bot web admin
cat backups/<backup-file>.dump | docker compose exec -T postgres \
  pg_restore --clean --if-exists -U pa_user -d power_automation_db

docker compose up -d
```

## 6. Routine operations

Daily:

- check service status and restart loops;
- check disk usage;
- inspect API errors and Telegram bot delivery failures.

Weekly:

- test that backups can be read;
- review dependency and container image updates;
- inspect failed authentication attempts.

Monthly:

- perform a restore rehearsal in a non-production environment;
- rotate high-impact secrets when required;
- review administrator access.
