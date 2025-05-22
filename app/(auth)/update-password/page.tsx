"use client"

import { useState, useEffect } from "react"
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

// Form schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function UpdatePasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSessionLoaded, setIsSessionLoaded] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Check if user is authenticated with a recovery token
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
        setErrorMessage("Unable to verify your session. Please try the reset password process again.")
        return
      }

      setIsSessionLoaded(true)

      // If no session or no access token, redirect to login
      if (!data.session) {
        toast({
          title: "Session expired",
          description: "Your password reset session has expired. Please try again.",
          variant: "destructive",
        })
        router.push("/reset-password")
      }
    }

    checkSession()
  }, [router, toast])

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        console.error("Password update error:", error)
        setErrorMessage(error.message)
        throw error
      }

      // Show success message
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })

      // Redirect to login page
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      console.error("Password update error details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSessionLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <Globe className="h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-bold">Affiliate Hub</h1>
            <p className="text-muted-foreground">Verifying your session...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Globe className="h-12 w-12 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Affiliate Hub</h1>
          <p className="text-muted-foreground">Update your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>Please enter and confirm your new password</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-md bg-destructive/15 p-3">
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" {...form.register("password")} />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
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
