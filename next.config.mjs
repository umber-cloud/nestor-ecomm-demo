/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adn.umbercloud.io',
      },
    ],
  },
};

export default nextConfig;
