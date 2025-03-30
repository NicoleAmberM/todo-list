import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tasks",
        permanent: true,
      },
    ];
  },
}
