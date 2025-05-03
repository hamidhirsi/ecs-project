import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // This is to handle Node.js native modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      aws4: false,
      "aws-sdk": false,
      "mock-aws-s3": false,
      nock: false,
    };
    
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["mongodb", "bcryptjs"],
  },
};

export default nextConfig;
