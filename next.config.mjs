/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adn.umbercloud.io',
      },
      {
        protocol: 'https',
        hostname: 'harbour-wren-3226.umberadn.com',
      },
      {
        protocol: 'https',
        hostname: '*.umberadn.com',
      },
    ],
  },
};

export default nextConfig;
