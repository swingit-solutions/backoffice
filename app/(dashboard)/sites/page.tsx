// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Globe, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SitesPage() {
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

  // Get sites based on user role
  let sitesQuery = supabase
    .from("affiliate_sites")
    .select("*, affiliate_networks(name, tenant_id)")
    .order("created_at", { ascending: false })

  // If not super admin, filter by tenant
  if (userData.role !== "super_admin") {
    sitesQuery = sitesQuery.in(
      "network_id",
      supabase.from("affiliate_networks").select("id").eq("tenant_id", userData.tenant_id),
    )
  }

  const { data: sites, error } = await sitesQuery

  if (error) {
    console.error("Error fetching sites:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Sites</h1>
          <p className="text-muted-foreground">Manage your affiliate sites</p>
        </div>

        <Button asChild>
          <Link href="/sites/new">
            <Plus className="mr-2 h-4 w-4" />
            New Site
          </Link>
        </Button>
      </div>

      {sites && sites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>Network: {site.affiliate_networks?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{site.domain || "No domain set"}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      site.status === "published" ? "bg-green-500" : "bg-amber-500"
                    }`}
                  />
                  <span className="text-xs capitalize">{site.status}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/sites/${site.id}`}>Manage Site</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No sites found</CardTitle>
            <CardDescription>Get started by creating your first affiliate site</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Affiliate sites are where you'll publish content and track affiliate links.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/sites/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Site
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
