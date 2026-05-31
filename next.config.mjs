/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Removes X-Powered-By header
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Caches static assets at the edge for 1 year
  },
  experimental: {
    optimizeCss: true, // Requires Critters: npm install critters
    scrollRestoration: true,
  },
};

export default nextConfig;
