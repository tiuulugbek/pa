import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(process.cwd(), '../../'),
  reactStrictMode: true,
  transpilePackages: ['@pa/types', '@pa/ui'],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
