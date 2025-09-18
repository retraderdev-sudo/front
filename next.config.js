const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/((?!auth).*)/:path*',
        destination: 'http://backend:4000/$1/:path*', // redirect API calls to Nest.js, except /api/auth/*
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
