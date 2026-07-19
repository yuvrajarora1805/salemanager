import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.nayaraenergy.com",
      },
      {
        protocol: "https",
        hostname: "nayaraenergy.com",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
