/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
  // Updated to production backend
  destination: 'https://e-commerce-backend-1-if2s.onrender.com/api/:path*', // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;