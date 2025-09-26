// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ❗ allows production build to succeed even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❗ skip ESLint during builds
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
};

module.exports = nextConfig;
