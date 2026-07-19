import type { NextConfig } from "next";

const websiteUrl = process.env.WEBSITE_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${websiteUrl}/images/:path*`
      }
    ];
  }
};

export default nextConfig;
