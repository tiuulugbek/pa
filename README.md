# Power Automation MCHJ — B2B Industrial Catalog

Monorepo for the Power Automation corporate website. Catalog-only (no prices,
no cart, no checkout). **Telegram is the sole conversion channel.**

## Stack

| App            | Tech                    | Port |
| -------------- | ----------------------- | ---- |
| `apps/web`     | Next.js 14 (App Router) | 3000 |
| `apps/api`     | NestJS                  | 3001 |
| `apps/bot`     | Telegraf                | —    |
| `apps/admin`   | Next.js 14              | 3003 |
| `packages/db`  | Prisma + PostgreSQL     | —    |
| `packages/ui`  | Shared tokens/helpers   | —    |
| `packages/types` | Shared TS types       | —    |

Search: Meilisearch. Build orchestration: Turborepo + pnpm.

## Local development

```bash
cp .env.example .env          # fill TELEGRAM_BOT_TOKEN, ADMIN_CHAT_ID, etc.
pnpm install
pnpm db:generate
pnpm db:push                  # create schema
pnpm db:seed                  # realistic seed data
pnpm dev                      # runs all apps via turbo
```

Admin login (from seed): **admin / admin123**

## Docker

```bash
docker compose build          # verify all images compile
docker compose up -d          # postgres, meilisearch, api, web, bot, admin
```

The `api` service pushes the Prisma schema and seeds on first start.

## Deploy

Nginx config in `deploy/nginx/`. SSL via Certbot. See `docker-compose.yml`
for service topology.

## Key rules

- No prices / "free" / "discount" anywhere.
- No cart / checkout / payment.
- Every product page has at least two Telegram CTAs.
- TypeScript strict mode, no `any`.
- Mobile-first, UZ (default) + RU via `next-intl`.
