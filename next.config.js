/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import ("./src/env.js");


/** @type {import("next").NextConfig} */

const config = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
          },
          {
            protocol: 'https',
            hostname: 'unpkg.com',
          },
          {
            protocol: 'https',
            hostname: 'utfs.io',
          },
          {
            protocol: 'https',
            hostname: 'qh0hg1d52r.ufs.sh',
          },
          {
            protocol: 'http',
            hostname: 'www.bakonykuti.hu',
          }
        ]

    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Enable standalone output for Docker deployment
    // output: 'standalone', // Commented out to allow regular next start

    // Experimental features to help with auth() static generation issues
    experimental: {
        // Force dynamic rendering for pages that use auth()
        dynamicIO: false,
    },

    // Skip certain static generation failures
    onDemandEntries: {
        // Don't try to regenerate pages too often
        maxInactiveAge: 60 * 60 * 1000, // 1 hour
    },
    // Disable static optimization for problematic pages
    serverExternalPackages: ['mysql2'],
};

export default config;
