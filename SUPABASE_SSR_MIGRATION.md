# Supabase SSR Migration Guide

This document outlines the migration from `@supabase/auth-helpers-nextjs` to the new `@supabase/ssr` package.

## Overview

The Supabase Auth Helpers package has been deprecated in favor of the new SSR package, which provides better performance, improved type safety, and more reliable session management.

## Key Changes

### 1. Package Dependencies

**Before:**
\`\`\`json
"@supabase/auth-helpers-nextjs": "^0.8.7"
\`\`\`

**After:**
\`\`\`json
"@supabase/ssr": "^0.5.1"
\`\`\`

### 2. Client Creation

**Before:**
\`\`\`typescript
// Client components
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createClientComponentClient()

// Server components
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
const supabase = createServerComponentClient({ cookies })

// Route handlers
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
const supabase = createRouteHandlerClient({ cookies })

// Middleware
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
const supabase = createMiddlewareClient(req, res)
\`\`\`

**After:**
\`\`\`typescript
// Client components
import { createBrowserClient } from '@supabase/ssr'
const supabase = createBrowserClient(url, anonKey)

// Server components & Route handlers
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
const supabase = createServerClient(url, anonKey, {
  cookies: {
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options)
      )
    },
  },
})

// Middleware
import { createServerClient } from '@supabase/ssr'
const supabase = createServerClient(url, anonKey, {
  cookies: {
    getAll() {
      return request.cookies.getAll()
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options)
      )
    },
  },
})
\`\`\`

### 3. Middleware Implementation

The new middleware implementation is more explicit about cookie handling and session management:

\`\`\`typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection logic here...

  return supabaseResponse
}
\`\`\`

### 4. Authentication Flow

The new package requires explicit handling of the OAuth callback:

\`\`\`typescript
// app/api/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
\`\`\`

## Benefits of Migration

1. **Better Performance**: Optimized for server-side rendering
2. **Improved Type Safety**: Better TypeScript integration
3. **Simplified Cookie Management**: More reliable session handling
4. **Future-Proof**: Actively maintained and updated
5. **Cleaner Architecture**: Removed unnecessary provider components

## Breaking Changes

1. **Provider Components Removed**: No longer need `SupabaseProvider` or `AuthProvider`
2. **Client Creation**: Must explicitly create clients with environment variables
3. **Middleware**: Completely rewritten with explicit cookie handling
4. **Route Handlers**: Updated client creation method

## Migration Checklist

- [x] Update package.json dependencies
- [x] Create new client utility functions
- [x] Update middleware implementation
- [x] Update all authentication pages
- [x] Update dashboard layout and components
- [x] Remove old provider components
- [x] Update API routes
- [x] Test authentication flows
- [x] Update documentation

## Testing

After migration, test these critical flows:

1. **User Registration**: Email verification and account creation
2. **Login/Logout**: Standard authentication flow
3. **Password Reset**: Email-based password reset
4. **Protected Routes**: Middleware route protection
5. **Session Persistence**: Cross-page navigation
6. **Role-based Access**: Different user permission levels

## Troubleshooting

### Common Issues

1. **Session Not Persisting**: Ensure middleware is properly configured
2. **Cookie Errors**: Check cookie handling in server client creation
3. **Redirect Loops**: Verify route protection logic in middleware
4. **Type Errors**: Update imports to use new package

### Debug Steps

1. Check browser console for client-side errors
2. Review server logs for authentication errors
3. Verify environment variables are set correctly
4. Test with different browsers and incognito mode
5. Check Supabase dashboard for authentication logs

## Environment Variables

Ensure these environment variables are set:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Support

For additional help:
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Migration Guide](https://supabase.com/docs/guides/troubleshooting/how-to-migrate-from-supabase-auth-helpers-to-ssr-package-5NRunM)
- [GitHub Issues](https://github.com/supabase/ssr)
