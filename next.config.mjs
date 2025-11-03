/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
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

