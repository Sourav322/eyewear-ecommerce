/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "via.placeholder.com",
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
