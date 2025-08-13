import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Globe, Users, TrendingUp } from "lucide-react"

export default async function NetworksPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Mock data for now - replace with actual queries
  const networks = [
    {
      id: 1,
      name: "E-commerce Network",
      description: "Network focused on e-commerce affiliate sites",
      sites: 12,
      users: 45,
      revenue: 15000,
      status: "active",
    },
    {
      id: 2,
      name: "Tech Reviews Network",
      description: "Technology product reviews and comparisons",
      sites: 8,
      users: 23,
      revenue: 8500,
      status: "active",
    },
    {
      id: 3,
      name: "Health & Wellness",
      description: "Health, fitness, and wellness affiliate sites",
      sites: 5,
      users: 18,
      revenue: 6200,
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Networks</h1>
          <p className="text-muted-foreground">Manage your affiliate networks and their performance.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Network
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {networks.map((network) => (
          <Card key={network.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{network.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground capitalize">{network.status}</span>
                </div>
              </div>
              <CardDescription>{network.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{network.sites}</div>
                    <div className="text-xs text-muted-foreground">Sites</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{network.users}</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">${network.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Performance</CardTitle>
          <CardDescription>Overview of all network performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">25</div>
              <div className="text-sm text-muted-foreground">Total Sites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">86</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$29,700</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12.5%</div>
              <div className="text-sm text-muted-foreground">Avg. Commission</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
