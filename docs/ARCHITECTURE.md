# Architecture

## Runtime components

- `web`: public multilingual industrial catalog.
- `admin`: authenticated content and catalog administration.
- `api`: business logic, authentication, catalog data, uploads, search integration, and document generation.
- `bot`: Telegram enquiry and notification channel.
- `postgres`: source of truth for structured business data.
- `meilisearch`: product search index.
- `redis`: cache and transient coordination layer.

## Trust boundaries

Internet traffic must terminate at the HTTPS reverse proxy. Only the proxy should reach the localhost-bound web, API, and admin ports. PostgreSQL, Redis, and Meilisearch must remain isolated inside the Docker network.

## Data ownership

- PostgreSQL owns catalog, account, and enquiry data.
- Uploaded files live in `apps/api/uploads` and require independent backups.
- Meilisearch is derived data and should be rebuildable from PostgreSQL.
- Redis contains disposable transient state and must not be treated as the system of record.

## Deployment principles

- Use immutable application builds.
- Apply reviewed Prisma migrations with `prisma migrate deploy`.
- Back up before migrations.
- Do not seed automatically in production.
- Keep environment-specific secrets outside Git.
- Roll back application code independently from database restoration whenever possible.
