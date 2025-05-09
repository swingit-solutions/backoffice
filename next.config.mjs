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
  // Remove optimizeCss option that's causing the deployment error
  experimental: {
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
    // optimizeCss: true, // Remove this line
  },
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig
