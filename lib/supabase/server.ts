import { createServerClient as createServerClientSupabase } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"
import type { Database } from "@/types/supabase"

// Create a cached version of the Supabase client for server components
export const createServerClient = cache(() => {
  const cookieStore = cookies()

  return createServerClientSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )
})
