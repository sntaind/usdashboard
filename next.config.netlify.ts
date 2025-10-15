import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enabled for Netlify deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  },
};

export default nextConfig;
