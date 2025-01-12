/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // For Google profile images
      },
    ],
  },
}

module.exports = nextConfig 