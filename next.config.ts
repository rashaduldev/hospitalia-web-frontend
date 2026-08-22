import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // trailingSlash: true,
  compress: true,
  cacheComponents: true,

  compiler: {
    removeConsole: false,
  },
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [],
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  allowedDevOrigins: [
    "localhost:5001",
    "localhost:8081",
    "https://hospitalia-web-backend.vercel.app",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:5001",
        "localhost:8081",
        "https://hospitalia-web-backend.vercel.app",
      ],
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
