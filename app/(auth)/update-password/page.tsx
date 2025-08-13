"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Globe } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Form schema with password confirmation
const updatePasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>

export default function UpdatePasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    // Check if user is authenticated via reset token
    const checkSession = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error("No valid session for password update:", error)
        setError("Your password reset link has expired or is invalid. Please request a new one.")
      } else {
        setIsAuthenticated(true)
      }
    }

    checkSession()
  }, [])

  async function onSubmit(data: UpdatePasswordFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting to update password")

      const supabase = createClient()

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        console.error("Password update error:", error)
        throw error
      }

      // Show success message
      setIsSuccess(true)
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      })

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: any) {
      console.error("Password update error details:", error)
      setError(error.message || "Failed to update password")
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-md text-center">
          <Globe className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Verifying...</h1>
          <p className="mt-2 text-muted-foreground">Please wait while we verify your reset link.</p>
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
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
      </div>
    </div>
  )
}
