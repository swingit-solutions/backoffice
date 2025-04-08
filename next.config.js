/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverActions: true,
    },
    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "/:path*",
        },
      ]
    },
    images: {
      domains: ["backoffice.swingit.solutions"],
    },
  }
  
  export default nextConfig
  