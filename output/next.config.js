/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true // Required for static exports
  },
  experimental: {
    // AWS Amplify specific optimizations
    optimizeCss: true,
    optimizePackageImports: ['@vercel/analytics']
  }
}

module.exports = nextConfig 