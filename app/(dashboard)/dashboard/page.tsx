import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { BarChart, Globe, Plus, Settings, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get the user details
  const { data: userData } = await supabase
    .from("users")
    .select("*, tenants(*)")
    .eq("auth_id", session.user.id)
    .single()

  if (!userData) {
    redirect("/login")
  }

  // Get stats based on user role
  let networkCount = 0
  let siteCount = 0
  let userCount = 0

  if (userData.role === "super_admin") {
    // Super admin sees global stats
    const [networksResponse, sitesResponse, usersResponse] = await Promise.all([
      supabase.from("affiliate_networks").select("count"),
      supabase.from("affiliate_sites").select("count"),
      supabase.from("users").select("count").neq("role", "super_admin"),
    ])

    networkCount = networksResponse.count || 0
    siteCount = sitesResponse.count || 0
    userCount = usersResponse.count || 0
  } else {
    // Regular user sees tenant stats
    const tenantId = userData.tenant_id

    // Get network IDs first, then use them in the sites query
    const { data: networkIds } = await supabase.from("affiliate_networks").select("id").eq("tenant_id", tenantId)

    const networkIdsArray = networkIds?.map((network) => network.id) || []

    const [networksResponse, sitesResponse, usersResponse] = await Promise.all([
      supabase.from("affiliate_networks").select("count").eq("tenant_id", tenantId),
      supabase.from("affiliate_sites").select("count").in("network_id", networkIdsArray),
      supabase.from("users").select("count").eq("tenant_id", tenantId),
    ])

    networkCount = networksResponse.count || 0
    siteCount = sitesResponse.count || 0
    userCount = usersResponse.count || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userData.first_name || userData.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/networks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Network
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Networks</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkCount}</div>
            <p className="text-xs text-muted-foreground">Affiliate networks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteCount}</div>
            <p className="text-xs text-muted-foreground">Affiliate sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {userData.role === "super_admin" ? "Admin" : userData.tenants?.subscription_status || "Trial"}
            </div>
            <p className="text-xs text-muted-foreground">
              {userData.role === "super_admin" ? "Super admin account" : "Current plan"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">Activity data will be displayed here</div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/networks/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Network
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/sites/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Site
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/users/invite">
                <Plus className="mr-2 h-4 w-4" />
                Invite User
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/analytics">
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
