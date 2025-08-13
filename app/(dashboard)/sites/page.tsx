import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Globe, ExternalLink, Settings } from "lucide-react"

export default async function SitesPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Mock data for now - replace with actual queries
  const sites = [
    {
      id: 1,
      name: "TechDeals Pro",
      domain: "techdeals.example.com",
      network: "E-commerce Network",
      status: "active",
      visitors: 12500,
      revenue: 3200,
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Fitness Gear Hub",
      domain: "fitnessgear.example.com",
      network: "Health & Wellness",
      status: "active",
      visitors: 8900,
      revenue: 2100,
      lastUpdated: "5 hours ago",
    },
    {
      id: 3,
      name: "Smart Home Reviews",
      domain: "smarthome.example.com",
      network: "Tech Reviews Network",
      status: "maintenance",
      visitors: 6700,
      revenue: 1800,
      lastUpdated: "1 day ago",
    },
    {
      id: 4,
      name: "Fashion Trends",
      domain: "fashiontrends.example.com",
      network: "E-commerce Network",
      status: "active",
      visitors: 15200,
      revenue: 4500,
      lastUpdated: "30 minutes ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">Manage your affiliate sites and monitor their performance.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Site
        </Button>
      </div>

      <div className="grid gap-6">
        {sites.map((site) => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{site.domain}</span>
                      <ExternalLink className="h-3 w-3" />
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-sm text-muted-foreground">Network</div>
                  <div className="font-medium">{site.network}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Visitors</div>
                  <div className="font-medium">{site.visitors.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                  <div className="font-medium">${site.revenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="font-medium">{site.lastUpdated}</div>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  View Analytics
                </Button>
                <Button variant="outline" size="sm">
                  Edit Content
                </Button>
                <Button variant="outline" size="sm">
                  Manage Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Performance Summary</CardTitle>
          <CardDescription>Overview of all your affiliate sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{sites.length}</div>
              <div className="text-sm text-muted-foreground">Total Sites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {sites.reduce((acc, site) => acc + site.visitors, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${sites.reduce((acc, site) => acc + site.revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{sites.filter((site) => site.status === "active").length}</div>
              <div className="text-sm text-muted-foreground">Active Sites</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
