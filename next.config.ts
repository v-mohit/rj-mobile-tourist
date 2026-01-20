import type { NextConfig } from 'next';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {}, // 👈 IMPORTANT: disables Turbopack

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.70.235.180',
        port: '30203',
      },
      {
        protocol: 'https',
        hostname: 'content-tourist.rajasthan.gov.in',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['react-hot-toast'],
  },
};

export default withPWA(nextConfig);
