import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Empty Turbopack config to silence Turbopack error
  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '**.coingecko.com',
      },
    ],
  },

  // Webpack alias for @/ imports
  webpack(config) {
    config.resolve.alias['@'] = require('path').resolve(__dirname, 'src');
    return config;
  },
};

export default nextConfig;
