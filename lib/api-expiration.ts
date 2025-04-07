import { createSupabaseServerClient } from "./supabase"

// Interface for API keys with expiration
export interface ApiKey {
  id: string
  name: string
  expiration_date: string | null // Updated from expires_at to expiration_date
  provider: string // 'github', 'vercel', etc.
}

// Check if an API key is expiring soon (within 14 days)
export function isExpiringSoon(expirationDate: string | null): boolean {
  if (!expirationDate) return false

  const expiryDate = new Date(expirationDate)
  const now = new Date()
  const daysUntilExpiration = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return daysUntilExpiration <= 14 && daysUntilExpiration >= 0
}

// Get all API keys that are expiring soon
export async function getExpiringApiKeys(): Promise<ApiKey[]> {
  const supabase = createSupabaseServerClient()

  // Fetch API keys from your database
  const { data, error } = await supabase.from("api_keys").select("*")

  if (error || !data) {
    console.error("Error fetching API keys:", error)
    return []
  }

  // Filter for keys expiring within 14 days
  return data.filter((key) => isExpiringSoon(key.expiration_date))
}

