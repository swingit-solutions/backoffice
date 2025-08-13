import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Building, Users, Globe } from "lucide-react"

export default async function TenantsPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Mock data for now - replace with actual queries
  const tenants = [
    {
      id: 1,
      name: "TechCorp Solutions",
      domain: "techcorp.example.com",
      plan: "enterprise",
      status: "active",
      users: 25,
      sites: 12,
      revenue: 15000,
      createdAt: "2023-01-15",
    },
    {
      id: 2,
      name: "Digital Marketing Pro",
      domain: "digitalmarketing.example.com",
      plan: "professional",
      status: "active",
      users: 8,
      sites: 5,
      revenue: 3200,
      createdAt: "2023-03-22",
    },
    {
      id: 3,
      name: "E-commerce Hub",
      domain: "ecommercehub.example.com",
      plan: "starter",
      status: "trial",
      users: 3,
      sites: 2,
      revenue: 0,
      createdAt: "2023-11-01",
    },
  ]

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-800"
      case "professional":
        return "bg-blue-100 text-blue-800"
      case "starter":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trial":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage tenant organizations and their subscriptions.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="grid gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                    <CardDescription>{tenant.domain}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPlanColor(tenant.plan)}>{tenant.plan}</Badge>
                  <Badge className={getStatusColor(tenant.status)}>{tenant.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <div className="text-sm text-muted-foreground">Users</div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tenant.users}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sites</div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tenant.sites}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                  <div className="font-medium">${tenant.revenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">{new Date(tenant.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Plan</div>
                  <div className="font-medium capitalize">{tenant.plan}</div>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Manage Users
                </Button>
                <Button variant="outline" size="sm">
                  Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Overview</CardTitle>
          <CardDescription>Summary of all tenant organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{tenants.length}</div>
              <div className="text-sm text-muted-foreground">Total Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{tenants.filter((t) => t.status === "active").length}</div>
              <div className="text-sm text-muted-foreground">Active Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{tenants.reduce((acc, t) => acc + t.users, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${tenants.reduce((acc, t) => acc + t.revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
