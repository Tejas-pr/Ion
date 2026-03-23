import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@ion/database", "@ion/auth"],
};

export default nextConfig;
