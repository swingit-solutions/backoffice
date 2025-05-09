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

export const createClient = cache(() => {
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
