import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      // Supabase Storage (production)
      {
        protocol: 'https',
        hostname: 'teyloksuvmmhqixjqoch.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Development/placeholder images (conditionally include based on env)
      ...(process.env.NODE_ENV === 'development' ? [
        {
          protocol: 'https' as const,
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https' as const,
          hostname: 'picsum.photos',
        },
        {
          protocol: 'https' as const,
          hostname: 'placehold.co',
        },
        {
          protocol: 'https' as const,
          hostname: 'via.placeholder.com',
        },
      ] : []),
    ],
  },
};

export default nextConfig;
