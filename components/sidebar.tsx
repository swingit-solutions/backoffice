"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Building, Globe, Home, LayoutDashboard, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  isSuperAdmin?: boolean
}

export function Sidebar({ isSuperAdmin = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-background">
      <div className="flex h-14 items-center px-4 py-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Globe className="h-6 w-6" />
          <span className="text-lg">Affiliate Hub</span>
        </Link>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Button asChild variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="justify-start">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>

          <Button asChild variant={pathname.startsWith("/networks") ? "secondary" : "ghost"} className="justify-start">
            <Link href="/networks">
              <Globe className="mr-2 h-4 w-4" />
              Networks
            </Link>
          </Button>

          <Button asChild variant={pathname.startsWith("/sites") ? "secondary" : "ghost"} className="justify-start">
            <Link href="/sites">
              <Home className="mr-2 h-4 w-4" />
              Sites
            </Link>
          </Button>

          <Button asChild variant={pathname.startsWith("/users") ? "secondary" : "ghost"} className="justify-start">
            <Link href="/users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Link>
          </Button>

          <Button asChild variant={pathname.startsWith("/analytics") ? "secondary" : "ghost"} className="justify-start">
            <Link href="/analytics">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>

          {isSuperAdmin && (
            <>
              <Separator className="my-2" />
              <div className="px-2 py-1">
                <h4 className="mb-1 text-xs font-semibold text-muted-foreground">Admin</h4>
              </div>
              <Button
                asChild
                variant={pathname.startsWith("/admin/tenants") ? "secondary" : "ghost"}
                className="justify-start"
              >
                <Link href="/admin/tenants">
                  <Building className="mr-2 h-4 w-4" />
                  Tenants
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname.startsWith("/admin/settings") ? "secondary" : "ghost"}
                className="justify-start"
              >
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
      <Separator />
      <div className="p-4">
        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  )
}
