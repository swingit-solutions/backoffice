/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "/:path*",
        },
      ]
    },
    // Add this section for domain configuration
    images: {
      domains: ["backoffice.swingit.solutions"],
    },
  }
  
  export default nextConfig
  