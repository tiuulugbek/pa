# Backup Policy

Back up both PostgreSQL and `apps/api/uploads`.

- Frequency: daily automated backup and manual backup before every migration.
- Retention: at least 7 daily, 4 weekly, and 3 monthly restore points.
- Location: keep at least one encrypted copy outside the application server.
- Verification: test restoration regularly in a non-production environment.
- Access: restrict backup access to authorized administrators.
- Monitoring: alert when a scheduled backup fails or produces an unexpectedly small file.

A backup is not considered valid until it has been successfully restored and verified.
