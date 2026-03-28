import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "@ion/database", "@ion/auth"],
};

export default nextConfig;
