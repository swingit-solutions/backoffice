import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Mail, MoreHorizontal } from "lucide-react"

export default async function UsersPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Mock data for now - replace with actual queries
  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2 hours ago",
      sites: 3,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "editor",
      status: "active",
      lastLogin: "1 day ago",
      sites: 2,
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@example.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "1 week ago",
      sites: 1,
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily@example.com",
      role: "editor",
      status: "active",
      lastLogin: "5 hours ago",
      sites: 4,
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions for your affiliate network.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground">Sites Managed</div>
                  <div className="font-medium">{user.sites}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Login</div>
                  <div className="font-medium">{user.lastLogin}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="font-medium capitalize">{user.role}</div>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  Edit Permissions
                </Button>
                <Button variant="outline" size="sm">
                  View Activity
                </Button>
                <Button variant="outline" size="sm">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Overview of user roles and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
              <div className="text-sm text-muted-foreground">Administrators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{users.reduce((acc, u) => acc + u.sites, 0)}</div>
              <div className="text-sm text-muted-foreground">Sites Managed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
