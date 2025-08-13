// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { UserPlus } from "lucide-react"

import { formatDate, formatRole } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function UsersPage() {
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

  // Get users based on user role
  let usersQuery = supabase.from("users").select("*, tenants(name)").order("created_at", { ascending: false })

  // If not super admin, filter by tenant
  if (userData.role !== "super_admin") {
    usersQuery = usersQuery.eq("tenant_id", userData.tenant_id)
  }

  const { data: users, error } = await usersQuery

  if (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage users and permissions</p>
        </div>

        <Button asChild>
          <Link href="/users/invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Link>
        </Button>
      </div>

      {users && users.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.first_name && user.last_name
                        ? `${user.first_name[0]}${user.last_name[0]}`
                        : user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Role</div>
                  <div className="font-medium">{formatRole(user.role)}</div>

                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium">{user.is_active ? "Active" : "Inactive"}</div>

                  {userData.role === "super_admin" && (
                    <>
                      <div className="text-muted-foreground">Organization</div>
                      <div className="font-medium">{user.tenants?.name || "N/A"}</div>
                    </>
                  )}

                  <div className="text-muted-foreground">Joined</div>
                  <div className="font-medium">{formatDate(user.created_at)}</div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/users/${user.id}`}>Manage User</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No users found</CardTitle>
            <CardDescription>Get started by inviting users to your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Invite team members to collaborate on your affiliate networks and sites.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/users/invite">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
