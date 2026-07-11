const { spawnSync } = require('node:child_process');

const environment = process.env.NODE_ENV || 'development';
const allowed = process.env.ALLOW_DATABASE_RESET === 'true';

if (environment === 'production') {
  console.error('Refusing to seed: database reset is disabled in production.');
  process.exit(1);
}

if (!allowed) {
  console.error('Refusing to seed: set ALLOW_DATABASE_RESET=true to confirm destructive reset.');
  process.exit(1);
}

const executable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const result = spawnSync(
  executable,
  ['exec', 'ts-node', '--compiler-options', '{"module":"commonjs"}', 'prisma/seed.ts'],
  { stdio: 'inherit', env: process.env },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
