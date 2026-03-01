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
  allowedDevOrigins: ["localhost:3000", "hospitalia-api.dhrubok.xyz"],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://localhost:3000",
        "https://hospitalia-api.dhrubok.xyz",
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
