/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@vercel/analytics']
  }
}

module.exports = nextConfig 