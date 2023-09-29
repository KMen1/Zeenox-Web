/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    NEXTAUTH_SECRET: "+i4hEu0lZvUM/8UkRHRXPx5O2DgB87OHuByNIBKJEvc=",
    NEXTAUTH_URL: "http://localhost:3000",
    DISCORD_CLIENT_ID: "925393895410532373",
    DISCORD_CLIENT_SECRET: "xMCnfOiV6leX9pE24pG4lR7QHuKqeaOp",
    //BOT_URL: "http://213.181.206.83",
    BOT_URL: "http://localhost:5225",
  },
  reactStrictMode: false,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/icons/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/avatars/**",
      },
    ],
  },
};

module.exports = nextConfig;
