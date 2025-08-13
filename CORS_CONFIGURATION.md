# CORS Configuration Guide

This document explains how CORS (Cross-Origin Resource Sharing) is configured in our application to work with Supabase.

## Overview

As of 2025, Supabase no longer allows CORS configuration through their dashboard. Instead, we need to handle CORS in our application code.

## Implementation Details

We've implemented CORS handling in several ways:

1. **Custom Fetch Function**: We've created a custom fetch function in our Supabase client that adds necessary headers.

2. **API Route for CORS Preflight**: We've added a dedicated API route at `/api/cors` that handles OPTIONS requests and returns appropriate CORS headers.

3. **Middleware Headers**: Our Next.js middleware adds CORS headers to responses.

## Configuration Files

The CORS configuration is implemented in these files:

- `lib/supabase/client.ts` - Client-side Supabase client with custom fetch
- `lib/supabase/server.ts` - Server-side Supabase client with custom fetch
- `app/api/cors/route.ts` - API route for handling CORS preflight requests
- `middleware.ts` - Next.js middleware that adds CORS headers

## Allowed Origins

The following origins are allowed to make cross-origin requests:

- `http://localhost:3000` (local development)
- `https://backoffice.swingit.solutions` (production)
- Any additional origins specified in the `NEXT_PUBLIC_APP_URL` environment variable

## Troubleshooting

If you encounter CORS errors:

1. Check the browser console for specific CORS error messages
2. Verify that the origin making the request is in the allowed origins list
3. Ensure the custom fetch function is being used by the Supabase client
4. Check that the API route is correctly handling OPTIONS requests

## References

- [Supabase CORS Documentation](https://supabase.com/docs/guides/functions/cors)
- [Next.js API Routes CORS](https://nextjs.org/docs/api-routes/introduction#cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
