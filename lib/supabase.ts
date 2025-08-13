import { createClient } from "@/lib/supabase/client"

// This file is deprecated - use lib/supabase/client.ts instead
// Keeping for backward compatibility during migration
console.warn("lib/supabase.ts is deprecated. Use lib/supabase/client.ts instead.")

export const supabase = createClient()

// Re-export the new function for compatibility
export { createClient } from "@/lib/supabase/client"
export default createClient()
