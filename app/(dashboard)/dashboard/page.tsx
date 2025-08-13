import Link from "next/link"
import { ArrowRight, BarChart3, Users, Globe } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/client"

// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

async function getNetworkCount(tenantId: string) {
  const { count, error } = await supabase
    .from("affiliate_networks")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)

  if (error) {
    console.error("Error fetching network count:", error)
    return 0
  }

  return count || 0
}

async function getSiteCount(tenantId: string) {
  // Get all network IDs for this tenant
  const { data: networks, error: networkError } = await supabase
    .from("affiliate_networks")
    .select("id")
    .eq("tenant_id", tenantId)

  if (networkError) {
    console.error("Error fetching networks:", networkError)
    return 0
  }

  // If no networks, return 0
  if (!networks || networks.length === 0) {
    return 0
  }

  // Get network IDs as an array
  const networkIds = networks.map((network) => network.id)

  // Count sites for these networks
  const { count, error } = await supabase
    .from("affiliate_sites")
    .select("*", { count: "exact", head: true })
    .in("network_id", networkIds)

  if (error) {
    console.error("Error fetching site count:", error)
    return 0
  }

  return count || 0
}

async function getUserCount(tenantId: string) {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)

  if (error) {
    console.error("Error fetching user count:", error)
    return 0
  }

  return count || 0
}

export default async function DashboardPage() {
  // Get the current user's tenant ID
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return <div>Please log in to view this page.</div>
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("auth_id", session.user.id)
    .single()

  if (userError || !userData) {
    console.error("Error fetching user data:", userError)
    return <div>Error loading dashboard data. Please try again later.</div>
  }

  const tenantId = userData.tenant_id

  // Get counts
  const networkCount = await getNetworkCount(tenantId)
  const siteCount = await getSiteCount(tenantId)
  const userCount = await getUserCount(tenantId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your affiliate networks and sites</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Networks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkCount}</div>
            <p className="text-xs text-muted-foreground">Total affiliate networks</p>
          </CardContent>
          <CardFooter>
            <Link href="/networks" className="text-xs text-blue-500 flex items-center">
              View all networks
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteCount}</div>
            <p className="text-xs text-muted-foreground">Total affiliate sites</p>
          </CardContent>
          <CardFooter>
            <Link href="/sites" className="text-xs text-blue-500 flex items-center">
              View all sites
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Total users in your tenant</p>
          </CardContent>
          <CardFooter>
            <Link href="/users" className="text-xs text-blue-500 flex items-center">
              View all users
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
