/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adn.nestortech.io',
      },
    ],
  },
};

export default nextConfig;
