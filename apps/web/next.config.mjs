/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  },
  output: 'export',
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/utils'],
};

export default nextConfig;
