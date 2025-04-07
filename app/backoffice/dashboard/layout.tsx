import type React from "react"
import { ApiExpirationAlert } from "@/components/api-expiration-alert"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ApiExpirationAlert />
        {children}
      </div>
    </div>
  )
}

