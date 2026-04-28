import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'www.fragrancewholesale.ng' },
      { protocol: 'https', hostname: 'fragrances.com.ng' },
      { protocol: 'https', hostname: 'fragrancewholesale.ng' },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
