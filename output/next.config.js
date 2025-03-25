/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  outputFileTracing: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@vercel/analytics']
  }
}

module.exports = nextConfig 