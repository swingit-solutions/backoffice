/**
 * Environment Variables Guide
 *
 * This file explains the environment variables used in the application.
 * Add these to your .env.local file.
 */

// NEXT_PUBLIC_APP_URL
// The URL where your application is hosted
// For local development: http://localhost:3000
// For production: https://your-domain.com
const NEXT_PUBLIC_APP_URL = "http://localhost:3000"

// ALLOWED_ORIGIN
// The origin allowed for CORS
// Usually the same as NEXT_PUBLIC_APP_URL
// For local development: http://localhost:3000
// For production: https://your-domain.com
const ALLOWED_ORIGIN = "http://localhost:3000"

// STRIPE_WEBHOOK_SECRET
// Only needed if you're integrating with Stripe for payments
// You can get this from your Stripe Dashboard > Developers > Webhooks
// For testing, you can use the CLI to generate a webhook secret:
// stripe listen --forward-to localhost:3000/api/webhooks
const STRIPE_WEBHOOK_SECRET = "whsec_..."

// Note: This file is for documentation purposes only.
// Do not use this file in your application.
