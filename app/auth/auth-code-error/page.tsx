import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
          <CardDescription>There was an error processing your authentication request.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">This could happen if:</p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>The authentication link has expired</li>
            <li>The link has already been used</li>
            <li>There was a network error</li>
          </ul>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/login">Try Logging In Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Create New Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
