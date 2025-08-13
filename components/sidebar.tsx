"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Globe, Home, Settings, Users, Building, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarProps {
  isSuperAdmin?: boolean
  isAdmin?: boolean
}

export function Sidebar({ isSuperAdmin = false, isAdmin = false }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      title: "Networks",
      href: "/networks",
      icon: Globe,
      active: pathname.startsWith("/networks"),
    },
    {
      title: "Sites",
      href: "/sites",
      icon: Globe,
      active: pathname.startsWith("/sites"),
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/analytics"),
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      active: pathname.startsWith("/users"),
      show: isAdmin, // Show for both admin and super_admin
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
    // Super admin only sections
    {
      title: "Organizations",
      href: "/admin/tenants",
      icon: Building,
      active: pathname.startsWith("/admin/tenants"),
      show: isSuperAdmin,
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
      show: isSuperAdmin,
    },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Globe className="h-5 w-5" />
          <span>Affiliate Hub</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems
            .filter((item) => item.show !== false)
            .map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  item.active ? "bg-muted text-foreground" : "transparent",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Link href="/api/auth/signout" className="flex w-full items-center gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Link>
      </div>
    </div>
  )
}
