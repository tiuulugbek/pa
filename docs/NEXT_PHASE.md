# Next Hardening Phase

The next pull request should focus on application code rather than repository policy:

1. Inspect NestJS bootstrap, CORS, validation pipes, exception filters, authentication guards, upload handling, and rate limiting.
2. Add API health/readiness endpoints and structured logging.
3. Add API unit and integration tests.
4. Inspect admin authentication, role enforcement, token storage, and session expiry.
5. Add Playwright smoke tests for public web and admin.
6. Audit database indexes, migrations, seeds, and high-cost queries.
7. Audit Telegram retry, deduplication, and failure handling.
8. Add monitoring and external uptime checks.
9. Add performance budgets and image optimization.
10. Verify deployment on staging before production rollout.
