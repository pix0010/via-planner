import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  // Silence monorepo root inference warning by pinning tracing root
  outputFileTracingRoot: process.cwd(),
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'zustand',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-progress'
    ]
  }
};

export default nextConfig;
