import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The selected HTML prototype takes precedence over the earlier dashboard.
      beforeFiles: [{ source: '/', destination: '/index.html' }],
    };
  },
};

export default nextConfig;
