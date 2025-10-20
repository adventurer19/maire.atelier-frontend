// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'maire.atelier.test',
            },
            {
                protocol: 'http',
                hostname: 'host.docker.internal',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;