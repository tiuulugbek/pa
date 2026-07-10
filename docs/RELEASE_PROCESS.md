# Release Process

1. Open a pull request from a short-lived branch.
2. Confirm all quality and security workflows pass.
3. Review database migration and environment changes.
4. Create and verify backups before production deployment.
5. Merge through GitHub after approval.
6. Deploy the exact merged commit.
7. Run the deployment verification checklist.
8. Record the deployed commit and any migration applied.

Do not deploy uncommitted server-side edits. Emergency fixes must be committed back to Git immediately after service restoration.
