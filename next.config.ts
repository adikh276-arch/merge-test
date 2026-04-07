import type { NextConfig } from "next";

const nextConfig: any = {
  output: 'standalone',
  basePath: '/therapy',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};



export default nextConfig;

