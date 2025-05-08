"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      organizationName: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)

    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Get the free tier ID
        const { data: freeTier, error: tierError } = await supabase
          .from("subscription_tiers")
          .select("id")
          .eq("name", "Free")
          .single()

        if (tierError) {
          console.error("Error fetching free tier:", tierError)
        }

        // 2. Create a tenant for the organization
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .insert([
            {
              name: data.organizationName,
              subscription_status: "trial",
              subscription_tier_id: freeTier?.id || null,
            },
          ])
          .select()

        if (tenantError) {
          console.error("Tenant creation error:", tenantError)
          throw tenantError
        }

        // 3. Create a user record linked to the tenant
        const { error: userError } = await supabase.from("users").insert([
          {
            auth_id: authData.user.id,
            tenant_id: tenantData[0].id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: "admin", // First user is the admin
          },
        ])

        if (userError) {
          console.error("User creation error:", userError)
          throw userError
        }

        // 4. Create a default affiliate network
        const { error: networkError } = await supabase.from("affiliate_networks").insert([
          {
            tenant_id: tenantData[0].id,
            name: `${data.organizationName} Network`,
            description: "Default affiliate network",
          },
        ])

        if (networkError) {
          console.error("Network creation error:", networkError)
          throw networkError
        }

        toast({
          title: "Registration successful",
          description: "Your account has been created. Please check your email to verify your account.",
        })

        // Redirect to login page
        router.push("/login")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account",
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
          <p className="text-muted-foreground">Create your affiliate network</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create an account to get started</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...form.register("firstName")} />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...form.register("lastName")} />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...form.register("password")} />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input id="organizationName" {...form.register("organizationName")} />
                {form.formState.errors.organizationName && (
                  <p className="text-sm text-destructive">{form.formState.errors.organizationName.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
