# Environments

## Development

- Local services and disposable data.
- `prisma db push` and seed data are allowed.
- Test credentials only.

## Staging

- Production-like topology with isolated data and secrets.
- Run migrations exactly as production.
- Use it for smoke tests, restore rehearsals, and deployment validation.

## Production

- Real customer and catalog data.
- Only reviewed migrations with `prisma migrate deploy`.
- No automatic seed, no default credentials, and no publicly exposed data services.
- Backups are mandatory before migration or infrastructure changes.

Never reuse database passwords, JWT secrets, Telegram tokens, or Meilisearch keys between environments.
