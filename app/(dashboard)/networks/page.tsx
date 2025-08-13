// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"

import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NetworksPage() {
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

  if (!userData) {
    redirect("/login")
  }

  // Get networks based on user role
  let networksQuery = supabase.from("affiliate_networks").select("*").order("created_at", { ascending: false })

  // If not super admin, filter by tenant
  if (userData.role !== "super_admin") {
    networksQuery = networksQuery.eq("tenant_id", userData.tenant_id)
  }

  const { data: networks, error } = await networksQuery

  if (error) {
    console.error("Error fetching networks:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Networks</h1>
          <p className="text-muted-foreground">Manage your affiliate networks</p>
        </div>

        <Button asChild>
          <Link href="/networks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Network
          </Link>
        </Button>
      </div>

      {networks && networks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {networks.map((network) => (
            <Card key={network.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{network.name}</CardTitle>
                <CardDescription>Created {formatDate(network.created_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {network.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/networks/${network.id}`}>Manage Network</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No networks found</CardTitle>
            <CardDescription>Get started by creating your first affiliate network</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Affiliate networks help you organize your affiliate sites and track their performance.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/networks/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Network
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
