import { createClient } from "@/lib/supabase/server"

// This file is deprecated - use lib/supabase/server.ts instead
// Keeping for backward compatibility during migration
export async function createSupabaseServerClient() {
  console.warn("lib/supabase-server.ts is deprecated. Use lib/supabase/server.ts instead.")
  return await createClient()
}

// Re-export the new function for compatibility
export { createClient as createServerClient } from "@/lib/supabase/server"
