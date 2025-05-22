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
    serverComponentsExternalPackages: ['@supabase/ssr @supabase/supabase-js'],
  },
  // Add environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_APP_URL: 'https://backoffice.swingit.solutions',
  },
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig
