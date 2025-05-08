# Build Guide for Affiliate Network Backoffice

This document provides instructions for building and deploying the Affiliate Network Backoffice application.

## Local Development

### Prerequisites

- Node.js 18+ installed
- pnpm installed
- Supabase project set up with the schema applied

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ALLOWED_ORIGIN=http://localhost:3000
\`\`\`

### Development Server

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

## Building for Production

### Standard Build

\`\`\`bash
# Clean cache (recommended before builds)
pnpm dlx rimraf .next node_modules/.cache

# Install dependencies
pnpm install

# Build the application
pnpm build
\`\`\`

### Windows-Specific Build Instructions

When building on Windows, you may encounter permission errors related to symbolic links. There are two ways to address this:

#### Option 1: Run as Administrator

Run your command prompt or PowerShell as Administrator when executing the build command.

#### Option 2: Enable Developer Mode

1. Go to Windows Settings > Update & Security > For developers
2. Enable "Developer Mode"
3. Restart your computer
4. Try building again with regular user permissions

### Troubleshooting Build Issues

#### Dynamic Server Usage Errors

If you encounter errors like:
\`\`\`
Dynamic server usage: Page couldn't be rendered statically because it used `cookies`
\`\`\`

This is because pages using cookies must be rendered dynamically. We've already added `export const dynamic = "force-dynamic"` to all necessary files, but if you create new pages that use authentication or cookies, remember to add this export.

#### Symlink Permission Errors

If you see errors like:
\`\`\`
EPERM: operation not permitted, symlink
\`\`\`

This is a Windows-specific issue related to symbolic links. Use one of the Windows-specific build instructions above.

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)
   - `ALLOWED_ORIGIN` (your Vercel deployment URL)

3. Deploy using the Vercel dashboard or by pushing to your connected branch

## Maintenance Notes

- Always run `pnpm build` locally before deploying to catch any build-time errors
- Keep dependencies updated regularly using `pnpm update`
- When adding new pages that use authentication or cookies, add `export const dynamic = "force-dynamic"` at the top of the file
