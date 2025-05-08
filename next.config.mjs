const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Remove standalone output to avoid symlink issues on Windows
  // output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly set the export condition to ensure proper handling of dynamic routes
  experimental: {
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
    // Add optimizeCss for production
    optimizeCss: true,
  },
  // Ensure CSS is properly processed in production
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig
