/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://api.dicebear.com", "avatar.vercel.sh", "randomuser.me"],
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
      },
    ],
  },
};

module.exports = nextConfig;
