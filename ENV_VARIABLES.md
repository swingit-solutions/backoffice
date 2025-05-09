# Environment Variables Guide

This document provides information about the environment variables used in the Affiliate Network Backoffice application.

## Required Environment Variables

### Supabase Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project | `https://abcdefghijklm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anonymous key for your Supabase project | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | The service role key for admin operations | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Application Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | The URL where your application is hosted | `http://localhost:3000` or `https://backoffice.swingit.solutions` |
| `ALLOWED_ORIGIN` | The origin allowed for CORS requests | `http://localhost:3000` or `https://backoffice.swingit.solutions` |

## Optional Environment Variables

### Stripe Integration (if using payment features)

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook signing secret | `whsec_...` |

## How to Set Up Environment Variables

### Local Development

1. Copy the `.env.local.example` file to `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Fill in the values in `.env.local` with your actual credentials.

### Vercel Deployment

1. Go to your project settings in the Vercel dashboard.
2. Navigate to the "Environment Variables" section.
3. Add each variable and its value.
4. Redeploy your application for the changes to take effect.

## Security Considerations

- Never commit your `.env.local` file or any file containing actual credentials to version control.
- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges. Only use it in secure server contexts, never in client-side code.
- Variables prefixed with `NEXT_PUBLIC_` will be exposed to the browser. Do not prefix sensitive variables with `NEXT_PUBLIC_`.

## Troubleshooting

If you encounter issues related to environment variables:

1. Verify that all required variables are set correctly.
2. For local development, ensure your `.env.local` file is in the root directory of your project.
3. For Vercel deployments, check that the variables are set in the Vercel dashboard and that you've redeployed after adding them.
4. Check for typos in variable names.

## References

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
