# Power Automation Platform

Production-oriented monorepo for the Power Automation MCHJ corporate website and B2B industrial equipment catalog.

The platform is catalog-only: it does not expose prices, cart, checkout, or online payments. Product enquiries are converted through Telegram.

## Architecture

| Component | Technology | Default port |
| --- | --- | --- |
| `apps/web` | Next.js 14 App Router | 3000 |
| `apps/api` | NestJS | 3001 |
| `apps/bot` | Telegraf | — |
| `apps/admin` | Next.js 14 | 3003 |
| `packages/db` | Prisma + PostgreSQL | — |
| `packages/ui` | Shared UI tokens and helpers | — |
| `packages/types` | Shared TypeScript types | — |

Supporting services: PostgreSQL 15, Redis 7, Meilisearch 1.10, Docker Compose, Turborepo, and pnpm.

## Requirements

- Node.js 20+
- pnpm 9.15+
- Docker with Compose v2

## Local development

```bash
cp .env.example .env
# Replace every CHANGE_ME value.

pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

`db:push` and `db:seed` are development commands. Production uses committed Prisma migrations through `prisma migrate deploy`.

## Quality checks

```bash
pnpm lint
pnpm build

docker compose config --quiet
```

The GitHub Actions workflow runs dependency installation, Prisma generation, lint/type-checking, the complete monorepo build, and Docker Compose validation on every pull request to `main`.

## Production deployment

1. Copy `.env.example` to `.env`.
2. Generate unique secrets for `DB_PASSWORD`, `MEILI_KEY`, and `JWT_SECRET`.
3. Set the real Telegram token, admin chat ID, public API URL, and bot username.
4. Ensure Prisma migrations are committed before deployment.
5. Build and start services:

```bash
docker compose config --quiet
docker compose build --pull
docker compose up -d
```

The database, Redis, and Meilisearch are available only inside the Docker network. Application ports bind to localhost and should be exposed through an HTTPS reverse proxy.

## Security rules

- Never commit `.env`, database dumps, API tokens, or private keys.
- Never use credentials from `.env.example` in production.
- Do not run `prisma db push --accept-data-loss` in production.
- Do not seed production automatically during container startup.
- Rotate any secret that has appeared in terminal history, logs, screenshots, or Git history.
- Create the first administrator with a one-time secure bootstrap process; do not rely on a documented default password.

See [SECURITY.md](./SECURITY.md) and [DEPLOYMENT.md](./DEPLOYMENT.md).

## Product rules

- No prices, free offers, discounts, cart, checkout, or payment flow.
- Every product page must contain at least two Telegram calls to action.
- TypeScript strict mode is expected; avoid `any`.
- Mobile-first interface.
- Uzbek is the default language; Russian is supported through `next-intl`.

## Repository naming

Recommended GitHub repository name: `power-automation-platform`.
