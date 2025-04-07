import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Client-side Supabase client (for browser usage)
export function createSupabaseClient() {
  // Use the NEXT_PUBLIC_ prefixed variables for client-side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (for API routes and server components)
export function createSupabaseServerClient() {
  // For server-side, we can use either the service role key or direct Postgres connection
  // Service role has admin privileges, so use with caution
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Direct database client (for advanced database operations)
// This is optional and only needed if you want to use Postgres directly
export async function createDirectDbClient() {
  // This would require additional setup with a Postgres client library
  // Example with 'pg' library:
  // const { Pool } = require('pg');
  // return new Pool({
  //   connectionString: process.env.POSTGRES_URL,
  // });
}

