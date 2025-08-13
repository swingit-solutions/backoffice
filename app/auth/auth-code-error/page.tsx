"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Globe, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "no_code":
        return "No authentication code was provided in the URL."
      case "unexpected_error":
        return "An unexpected error occurred during authentication."
      default:
        return error || "There was an error processing your authentication request."
    }
  }

  const getErrorTitle = (errorCode: string | null) => {
    switch (errorCode) {
      case "no_code":
        return "Invalid Authentication Link"
      case "unexpected_error":
        return "Authentication Error"
      default:
        return "Authentication Failed"
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Globe className="h-12 w-12 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Affiliate Hub</h1>
          <p className="text-muted-foreground">Authentication Error</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">{getErrorTitle(error)}</CardTitle>
            <CardDescription>{getErrorMessage(error)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This could be due to an expired or invalid authentication link. Please try one of the options below.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/login">Back to Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Create New Account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/reset-password">Reset Password</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
