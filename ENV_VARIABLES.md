# Environment Variables Guide

This document outlines all the environment variables required for the Affiliate Hub Backoffice application.

## Required Variables

### Supabase Configuration

\`\`\`env
# Supabase URL - Get this from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key - Public key for client-side operations
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role Key - Private key for server-side admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

### Application Configuration

\`\`\`env
# Application URL - Used for redirects and email links
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Allowed Origins for CORS (if needed)
ALLOWED_ORIGIN=https://your-domain.com
\`\`\`

### GitHub Integration (Optional)

\`\`\`env
# GitHub token for repository synchronization
GITHUB_TOKEN=your-github-token
\`\`\`

## Environment-Specific Settings

### Development (.env.local)

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Production (Vercel)

Set the same variables in your Vercel project settings, but with production URLs:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
\`\`\`

## Security Notes

1. **Never commit sensitive keys**: The `.env.local` file should never be committed to version control
2. **Service Role Key**: This key has admin privileges - keep it secure and only use server-side
3. **Public Keys**: The anon key and URL are safe to expose client-side
4. **Production URLs**: Ensure production URLs use HTTPS

## Getting Supabase Keys

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. For the service role key, copy the service_role key (keep this secret!)

## Vercel Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add each variable with the appropriate value
4. Make sure to set the correct environment (Production, Preview, Development)

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
2. **Redirects failing**: Verify NEXT_PUBLIC_APP_URL matches your actual domain
3. **Admin operations failing**: Ensure SUPABASE_SERVICE_ROLE_KEY is set correctly
4. **CORS errors**: Check ALLOWED_ORIGIN if you're having cross-origin issues

### Validation

You can validate your environment variables by checking:

1. The Supabase project dashboard shows the correct URL and keys
2. The application loads without console errors
3. Authentication flows work correctly
4. Database operations succeed

## Example .env.local File

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: GitHub Integration
GITHUB_TOKEN=ghp_...
\`\`\`

Remember to replace the example values with your actual Supabase project credentials.
\`\`\`
