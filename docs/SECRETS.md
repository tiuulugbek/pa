# Secrets Management

Generate secrets on a trusted machine and place them only in the production environment.

Examples:

```bash
openssl rand -base64 48   # JWT secret
openssl rand -hex 32      # database or Meilisearch secret
```

Required secrets:

- `DB_PASSWORD`
- `JWT_SECRET`
- `MEILI_KEY`
- `TELEGRAM_BOT_TOKEN`
- `ADMIN_CHAT_ID`

Rotation procedure:

1. Create the replacement secret.
2. Update the deployment environment.
3. Restart only affected services.
4. Verify authentication, search, database access, and Telegram delivery.
5. Revoke the old secret.
6. Record the rotation date without recording the secret value.

Never paste production secrets into issues, pull requests, screenshots, chat messages, or CI logs.
