"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Globe } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Get the site URL for redirects
const getSiteUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://backoffice.swingit.solutions"
}

// Form schema
const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ResetFormValues) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Get the current site URL
      const siteUrl = getSiteUrl()
      console.log("Using site URL for password reset:", siteUrl)

      // Use Supabase's password reset functionality with explicit site URL
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${siteUrl}/update-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
        setErrorMessage(error.message)
        throw error
      }

      // Show success message
      setEmailSent(true)
      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link",
      })
    } catch (error: any) {
      console.error("Password reset error details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Globe className="h-12 w-12 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Affiliate Hub</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {emailSent ? "Check your email for a reset link" : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          {!emailSent ? (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {errorMessage && (
                  <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm text-destructive">{errorMessage}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                We've sent a password reset link to your email. Please check your inbox and follow the instructions.
              </p>
              <p className="text-center text-sm text-muted-foreground">The link will expire in 24 hours.</p>
            </CardContent>
          )}
        </Card>

        <div className="mt-4 text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
