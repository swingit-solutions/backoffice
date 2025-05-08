const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  experimental: {
    // Remove these problematic options
    // parallelServerBuildTraces: true,
    // parallelServerCompiles: true,
  },
  // Force server-side rendering for all pages
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
