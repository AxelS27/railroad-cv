/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/utils'],
};

export default nextConfig;
