/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@vercel/analytics']
  }
}

module.exports = nextConfig 