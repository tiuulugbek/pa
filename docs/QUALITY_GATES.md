# Quality Gates

A change is ready for merge only when:

- CI installation succeeds with the lockfile.
- Prisma client generation succeeds.
- TypeScript and lint checks pass.
- Every workspace builds successfully.
- Docker Compose configuration validates.
- Dependency Review reports no unacceptable new risk.
- CodeQL reports no new high-severity issue.
- Required environment variables and migration impact are documented.
- No secret, personal data, or production dump is included.

Application behavior changes should also include automated tests. Until coverage is established, the pull request must document manual smoke-test evidence for web, API, admin, bot, search, and uploads.
