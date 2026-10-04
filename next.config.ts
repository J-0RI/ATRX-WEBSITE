import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root; a lockfile in a parent directory otherwise confuses inference.
  turbopack: { root: __dirname },
  poweredByHeader: false,
  async redirects() {
    // Founder biography is no longer part of the ATRX product site; keep the old public URL resolving.
    return [{ source: "/founder", destination: "/", permanent: true }];
  },
};

export default nextConfig;
