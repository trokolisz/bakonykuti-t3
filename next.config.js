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
};

export default config;
