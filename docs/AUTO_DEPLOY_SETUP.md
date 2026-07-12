# Production Auto-Deploy Setup

This repository deploys `main` to `/var/www/pm.crm24uz.com` after the CI workflow succeeds for a push to `main`.

## Server prerequisites

Run once on the production server:

```bash
cd /var/www/pm.crm24uz.com

git remote -v
git fetch origin
git checkout main
git reset --hard origin/main

chmod +x scripts/deploy-production.sh
```

The deployment user must be able to:

- read and update `/var/www/pm.crm24uz.com`;
- run `git fetch`, `git checkout`, and `git reset`;
- run Docker Compose commands;
- write to `/var/www/pm.crm24uz.com/backups`;
- create `/var/lock/power-automation-deploy.lock`.

Prefer a dedicated non-root user such as `deploy-agent`. Grant only the Docker and project permissions it needs.

## SSH key

Generate a dedicated deployment key on a trusted machine:

```bash
ssh-keygen -t ed25519 -C 'github-actions-power-automation' -f power_automation_deploy
```

Append the public key to the deployment user's `~/.ssh/authorized_keys` on the server.

Store the private key in GitHub Actions secrets.

## Required GitHub Actions secrets

Repository → Settings → Secrets and variables → Actions:

- `PROD_HOST`: production server IP or hostname;
- `PROD_PORT`: SSH port, usually `22`;
- `PROD_USER`: SSH deployment user;
- `PROD_SSH_KEY`: full private Ed25519 key including BEGIN/END lines.

Use the GitHub `production` environment for approval rules and secret isolation when desired.

## Deployment behavior

The server script:

1. prevents concurrent deployments;
2. refuses to deploy over uncommitted server changes;
3. creates a PostgreSQL backup;
4. fetches and checks out the exact CI-tested commit;
5. validates Docker Compose;
6. rebuilds application services;
7. starts services and removes obsolete containers;
8. checks the API health endpoint;
9. detects restarting containers;
10. rolls back application code and containers on failure;
11. retains database backups for 14 days.

## Manual deployment

GitHub → Actions → Deploy Production → Run workflow.

An optional commit SHA may be supplied. Without one, the server deploys `origin/main`.

## First-run validation

Before enabling automatic deployment, run on the server:

```bash
cd /var/www/pm.crm24uz.com
chmod +x scripts/deploy-production.sh
TARGET_COMMIT=origin/main ./scripts/deploy-production.sh
```

Confirm:

```bash
docker compose ps
curl -f http://127.0.0.1:3001/api/health
cat .deployed-commit
```

Do not enable deployment until Prisma baseline migration files are committed to `main` and the API starts without P3005/P3017 errors.
