# Operations Guide

## Service status

```bash
docker compose ps
```

## Recent logs

```bash
docker compose logs --tail=200 api
docker compose logs --tail=200 web
docker compose logs --tail=200 admin
docker compose logs --tail=200 bot
```

## Restart one service

```bash
docker compose restart api
```

## Rebuild one service

```bash
docker compose build api
docker compose up -d api
```

## Database connectivity

```bash
docker compose exec postgres pg_isready -U pa_user -d power_automation_db
```

## Resource checks

```bash
docker stats --no-stream
df -h
du -sh apps/api/uploads
```

## Incident priorities

1. Preserve data and take a backup when possible.
2. Stop repeated destructive operations.
3. Restore public availability with the smallest safe change.
4. Record timestamps, symptoms, and commands used.
5. Rotate secrets when exposure is suspected.
6. Document the root cause and prevention action after recovery.
