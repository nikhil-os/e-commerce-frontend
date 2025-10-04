/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    forceSwcTransforms: true,
  },
  // Prevent hanging during build
  staticPageGenerationTimeout: 60,
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  webpack: (config, { isServer, dev }) => {
    // Fix for chunk loading issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Optimize chunks only in production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxSize: 200000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              maxSize: 200000,
            },
          },
        },
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://e-commerce-backend-1-if2s.onrender.com/api/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
