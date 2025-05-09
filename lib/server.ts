import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { cache } from "react"

// Create a custom fetch function that includes CORS headers
const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      "X-Client-Info": "supabase-js/2.38.4",
    },
  })
}

// Create a cached version of the Supabase client for server components
export const createServerClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    options: {
      global: {
        fetch: customFetch,
      },
    },
  })
})

// For API routes and server actions that need the service role
export const createServiceClient = () => {
  return createServerComponentClient<Database>({
    cookies: () => cookies(),
    options: {
      global: {
        fetch: customFetch,
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  })
}
