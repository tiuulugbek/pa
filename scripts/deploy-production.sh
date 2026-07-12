#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/pm.crm24uz.com}"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3001/api/health}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups}"
LOCK_FILE="${LOCK_FILE:-/var/lock/power-automation-deploy.lock}"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another deployment is already running"
  exit 1
fi

cd "$APP_DIR"

if [[ ! -d .git ]]; then
  echo "ERROR: $APP_DIR is not a Git repository"
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "ERROR: $APP_DIR/.env is missing"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
PREVIOUS_COMMIT="$(git rev-parse HEAD)"
TARGET_COMMIT="${TARGET_COMMIT:-origin/$BRANCH}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/power_automation_${TIMESTAMP}.dump"

rollback() {
  local exit_code=$?
  echo "Deployment failed; rolling back to $PREVIOUS_COMMIT"
  git reset --hard "$PREVIOUS_COMMIT"
  docker compose build api web admin bot
  docker compose up -d
  docker compose ps
  exit "$exit_code"
}
trap rollback ERR

echo "Fetching $BRANCH"
git fetch --prune origin "$BRANCH"

git diff --quiet && git diff --cached --quiet || {
  echo "ERROR: uncommitted server-side changes detected"
  git status --short
  exit 1
}

echo "Creating PostgreSQL backup: $BACKUP_FILE"
docker compose exec -T postgres \
  pg_dump -U pa_user -d power_automation_db -Fc > "$BACKUP_FILE"

test -s "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"

echo "Updating code to $TARGET_COMMIT"
git checkout "$BRANCH"
git reset --hard "$TARGET_COMMIT"

echo "Validating Compose configuration"
docker compose config --quiet

echo "Building changed application images"
docker compose build api web admin bot

echo "Starting services"
docker compose up -d --remove-orphans

echo "Waiting for API readiness"
for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 5 "$HEALTH_URL" >/dev/null; then
    echo "API health check passed"
    break
  fi
  if [[ "$attempt" -eq 30 ]]; then
    echo "ERROR: API health check failed after 30 attempts"
    docker compose logs --tail=200 api
    false
  fi
  sleep 4
done

echo "Checking container state"
docker compose ps

if docker compose ps --status restarting --services | grep -q .; then
  echo "ERROR: one or more containers are restarting"
  docker compose ps
  false
fi

CURRENT_COMMIT="$(git rev-parse HEAD)"
echo "$CURRENT_COMMIT" > .deployed-commit
chmod 600 .deployed-commit

find "$BACKUP_DIR" -type f -name 'power_automation_*.dump' -mtime +14 -delete

trap - ERR
echo "Deployment completed successfully: $CURRENT_COMMIT"
