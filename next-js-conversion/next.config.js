/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Required for Docker deployment
  output: 'standalone',
  // Required for API routes to work with proxy in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*' // Proxy to Express API
      }
    ]
  }
}

module.exports = nextConfig