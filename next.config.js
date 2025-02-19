const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    HOME_PAGE_DATA: process.env.HOME_PAGE_DATA,
    HOME_NAME: process.env.HOME_NAME,
    NEXT_PUBLIC_MY_VARIABLE: 'Hello from Next.js config!',
  },
};

module.exports = nextConfig;
