# Incident Response

## Severity

- Critical: data loss, credential exposure, or complete production outage.
- High: major feature unavailable or unauthorized access suspected.
- Medium: degraded behavior with a safe workaround.
- Low: minor defect without operational impact.

## Response

1. Identify the affected systems and preserve logs.
2. Stop destructive or unauthorized activity.
3. Back up recoverable data.
4. Restore service with the smallest safe change.
5. Rotate exposed credentials.
6. Verify web, API, admin, bot, search, database, and uploads.
7. Document the timeline, root cause, and prevention action.

Never publish production secrets, personal data, infrastructure credentials, or exploit details in a public issue.
