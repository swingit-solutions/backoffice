"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { getExpiringApiKeys } from "@/lib/api-client"

interface ApiKey {
  id: string
  name: string
  expiration_date: string // Updated from expires_at to expiration_date
  provider: string
}

export function ApiExpirationAlert() {
  const [expiringKeys, setExpiringKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExpiringKeys() {
      try {
        const result = await getExpiringApiKeys()
        if (result.success) {
          setExpiringKeys(result.data)
        }
      } catch (error) {
        console.error("Error fetching expiring API keys:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpiringKeys()
  }, [])

  if (loading || expiringKeys.length === 0) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>API Keys Expiring Soon</AlertTitle>
      <AlertDescription>
        <p className="mb-2">The following API keys will expire within the next 14 days:</p>
        <ul className="list-disc pl-5 space-y-1">
          {expiringKeys.map((key) => {
            const expiryDate = new Date(key.expiration_date).toLocaleDateString()
            return (
              <li key={key.id}>
                <strong>{key.name}</strong> ({key.provider}) - Expires on {expiryDate}
              </li>
            )
          })}
        </ul>
        <div className="mt-3">
          <Link href="/settings/api-keys" className="text-blue-600 hover:underline">
            Manage API Keys
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  )
}

