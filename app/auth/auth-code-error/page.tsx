import Link from "next/link"
import { Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Globe className="h-12 w-12 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Affiliate Hub</h1>
          <p className="text-muted-foreground">Authentication Error</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Failed</CardTitle>
            <CardDescription>There was an error processing your authentication request.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This could be due to an expired or invalid authentication link. Please try logging in again.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/reset-password">Reset Password</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
