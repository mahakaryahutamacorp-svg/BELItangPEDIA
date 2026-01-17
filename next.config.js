/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
}

module.exports = nextConfig
