# Deployment Guidelines

This document provides guidelines to prevent common deployment issues with our Next.js application on Vercel.

## Common Issues and Prevention

### 1. Dynamic Server Usage Errors

**Issue**: `Dynamic server usage: Page couldn't be rendered statically because it used 'cookies'`

**Prevention**:
- Always add `export const dynamic = 'force-dynamic'` to:
  - All API routes (`app/api/**/*.ts`)
  - Any page that uses cookies, authentication, or server-side data fetching
  - Any layout that includes authentication components

**Example**:
\`\`\`typescript
// app/api/example/route.ts
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Your code here
}
\`\`\`

### 2. Outdated Lock File Errors

**Issue**: `ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date`

**Prevention**:
- Always run `pnpm install` after modifying `package.json`
- Use the pre-commit hook script provided below
- For manual fixes, run: `pnpm install --no-frozen-lockfile`

**Automated Solution**:
1. Add this script to `package.json`:
\`\`\`json
"scripts": {
  "precommit": "node scripts/check-lockfile.js",
  "predeploy": "node scripts/check-lockfile.js"
}
\`\`\`

2. Create the script file:

## Pre-Commit Hook Setup

1. Create a file at `.husky/pre-commit`:
\`\`\`bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run precommit
\`\`\`

2. Make it executable:
\`\`\`bash
chmod +x .husky/pre-commit
\`\`\`

3. Install husky:
\`\`\`bash
pnpm add -D husky
pnpm husky install
\`\`\`

## Vercel Deployment Configuration

1. Set the following in your Vercel project settings:
   - Build Command: `pnpm run predeploy && pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install --no-frozen-lockfile`

2. Add the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `ALLOWED_ORIGIN`

## Code Review Checklist

Before submitting code for review, ensure:

1. All API routes have `export const dynamic = 'force-dynamic'`
2. The lock file is up to date with `package.json`
3. All environment variables are properly referenced
4. No custom webpack configuration that might conflict with Vercel
