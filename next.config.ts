import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*",
    "*.replit.dev",
    "*.repl.co",
    "*.spock.replit.dev",
    "621ab8aa-4288-4fe2-9b58-afbd1abb3138-00-1wyi1sxj68mc2.spock.replit.dev",
  ],
};

export default nextConfig;
