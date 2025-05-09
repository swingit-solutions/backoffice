import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

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

// Create a singleton instance of the Supabase client for client components
export const supabase = createClientComponentClient<Database>({
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: customFetch,
    },
  },
})

// Export a function to get a fresh client if needed
export const getSupabaseClient = () => {
  return createClientComponentClient<Database>({
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: customFetch,
      },
    },
  })
}
