// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['laravel.test', 'localhost'],
        deviceSizes: [375, 640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'maire.atelier.test',
            },
            {
                protocol: 'http',
                hostname: 'laravel.test',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;