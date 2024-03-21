/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://api.dicebear.com"],
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
      },
    ],
  },
};

module.exports = nextConfig;
