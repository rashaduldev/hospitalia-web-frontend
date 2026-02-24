import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // trailingSlash: true,
  compress: true,

  compiler: {
    // removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["http://localhost:3000","https://hospitalia-api.dhrubok.xyz"],
    },
    serverComponentsHmrCache: true,
    // viewTransition: true,
  },

  serverExternalPackages: ["pino", "pino-pretty"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      },
    ];
  },
};

export default nextConfig;