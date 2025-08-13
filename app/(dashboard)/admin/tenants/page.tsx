// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Building, Plus, Users } from "lucide-react"

import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TenantsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get the user details
  const { data: userData } = await supabase.from("users").select("*").eq("auth_id", session.user.id).single()

  if (!userData || userData.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Get all tenants
  const { data: tenants, error } = await supabase
    .from("tenants")
    .select(`
      *,
      subscription_tiers(*),
      users:users(count),
      networks:affiliate_networks(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tenants:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage all organizations on the platform</p>
        </div>

        <Button asChild>
          <Link href="/admin/tenants/new">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Link>
        </Button>
      </div>

      {tenants && tenants.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{tenant.name}</CardTitle>
                <CardDescription>Created {formatDate(tenant.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium capitalize">{tenant.subscription_status}</div>

                  <div className="text-muted-foreground">Plan</div>
                  <div className="font-medium">{tenant.subscription_tiers?.name || "Free"}</div>

                  <div className="text-muted-foreground">Users</div>
                  <div className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{tenant.users?.[0]?.count || 0}</span>
                  </div>

                  <div className="text-muted-foreground">Networks</div>
                  <div className="font-medium flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{tenant.networks?.[0]?.count || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/admin/tenants/${tenant.id}`}>Manage Organization</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No organizations found</CardTitle>
            <CardDescription>Get started by creating your first organization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Organizations represent your customers who use the platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/tenants/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
