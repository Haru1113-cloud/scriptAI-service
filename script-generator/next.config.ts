import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/scriptAI-service",
  assetPrefix: "/scriptAI-service/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;