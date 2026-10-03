import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root; a lockfile in a parent directory otherwise confuses inference.
  turbopack: { root: __dirname },
  poweredByHeader: false,
};

export default nextConfig;
