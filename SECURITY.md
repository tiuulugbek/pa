# Security Policy

## Supported version

Only the current `main` branch is supported with security fixes.

## Reporting a vulnerability

Do not open a public issue containing credentials, exploit steps, customer data, or infrastructure details.

Report the problem privately to the repository owner with:

- affected component and version or commit;
- clear reproduction steps;
- expected and actual behavior;
- potential impact;
- suggested remediation, when available.

## Secret handling

- Production secrets belong in the deployment environment, not Git.
- `.env` files, database backups, SSH keys, TLS private keys, Telegram tokens, JWT secrets, and Meilisearch master keys must not be committed.
- Rotate a secret immediately when exposure is suspected.
- Use unique secrets per environment.
- `JWT_SECRET` should contain at least 64 random characters.

## Production baseline

- Terminate TLS at Nginx or another trusted reverse proxy.
- Keep PostgreSQL, Redis, and Meilisearch inaccessible from the public internet.
- Run Prisma migrations with `prisma migrate deploy`.
- Back up PostgreSQL and uploaded media before deployments.
- Use least-privilege accounts and restrict server SSH access.
- Keep dependencies and container images patched.
