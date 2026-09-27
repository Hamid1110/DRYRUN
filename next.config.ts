import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.trycloudflare.com', 'localhost:3001', '127.0.0.1:3001'],
};

export default nextConfig;
