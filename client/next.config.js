/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:1209480394,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "05a678517d10105c2974c64215f00add",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
