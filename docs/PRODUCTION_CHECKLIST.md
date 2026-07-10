# Production Readiness Checklist

## Required before merge

- [ ] CI passes on Node.js 20 and pnpm 9.15.
- [ ] All Prisma migrations are committed and reviewed.
- [ ] `.env` contains unique production secrets.
- [ ] No default administrator password is enabled.
- [ ] PostgreSQL, Redis, and Meilisearch are not publicly exposed.
- [ ] Nginx routes only HTTPS traffic to localhost-bound application ports.
- [ ] PostgreSQL and uploaded media backups are verified.
- [ ] Telegram bot token and admin chat ID are valid.
- [ ] API, web, admin, bot, search, and uploads are smoke-tested.

## Recommended next engineering phase

- [ ] Add API unit and integration tests.
- [ ] Add web/admin end-to-end tests with Playwright.
- [ ] Add structured JSON logging and request correlation IDs.
- [ ] Add error monitoring and uptime checks.
- [ ] Add rate limiting, Helmet security headers, and strict CORS configuration.
- [ ] Add database backup automation with off-server retention.
- [ ] Add a non-production staging environment.
- [ ] Add image optimization and Lighthouse performance budgets.
- [ ] Add role-based administrator access and audit logs.
- [ ] Add restore drills and incident response procedures.
