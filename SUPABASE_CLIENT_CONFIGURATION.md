# Supabase Client Configuration Guide

This document explains how to properly configure the Supabase client in our application.

## Basic Configuration

The Supabase client is configured in `lib/supabase/client.ts`. We use the `createClientComponentClient` function from `@supabase/auth-helpers-nextjs` to create a client for use in client components.

\`\`\`typescript
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    global: {
      headers: {
        "X-Client-Info": "supabase-js/2.38.4",
      },
    },
  },
})
\`\`\`

## Authentication Configuration

Authentication options should be specified in the individual auth method calls, not in the client configuration. For example:

\`\`\`typescript
// For sign in
await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password",
  options: {
    redirectTo: getSiteUrl() + "/dashboard",
  },
})

// For password reset
await supabase.auth.resetPasswordForEmail("user@example.com", {
  redirectTo: `${siteUrl}/update-password`,
})
\`\`\`

## Redirect URLs

Redirect URLs should be specified in the individual auth method calls, not in the client configuration. This ensures that the correct URL is used for each operation.

We use a helper function to get the current site URL:

\`\`\`typescript
const getSiteUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://backoffice.swingit.solutions"
}
\`\`\`

## Common Issues

### TypeScript Errors

The `createClientComponentClient` function does not accept an `auth` property directly in the `options` object. Authentication options should be specified in the individual auth method calls.

### Redirect Issues

If redirects are not working correctly, ensure that:
1. The redirect URL is specified in the individual auth method call
2. The redirect URL is a full URL (including protocol and host)
3. The redirect URL is allowed in the Supabase project settings

## References

- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase Auth API Reference](https://supabase.com/docs/reference/javascript/auth-signin)
