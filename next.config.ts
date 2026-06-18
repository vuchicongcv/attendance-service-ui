import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://courageous-playfulness-production-6a79.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
