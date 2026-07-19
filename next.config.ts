import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'http://localhost:3001/images/:path*' // Proxy images from website
      }
    ];
  }
};

export default nextConfig;
