import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client for client components
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
)

// Export a function to get a fresh client if needed
export const getSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  )
}
