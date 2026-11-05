import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/docs/**': ['./docs/**/*'],
  },
};

export default nextConfig;
