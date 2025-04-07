"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Globe, FileText, Image, Settings, Key, Menu, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Sites",
      icon: Globe,
      href: "/sites",
      active: pathname === "/sites" || pathname.startsWith("/sites/"),
    },
    {
      label: "Content",
      icon: FileText,
      href: "/content",
      active: pathname === "/content" || pathname.startsWith("/content/"),
    },
    {
      label: "Banners",
      icon: Image,
      href: "/banners",
      active: pathname === "/banners" || pathname.startsWith("/banners/"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "API Keys",
      icon: Key,
      href: "/api-keys",
      active: pathname === "/api-keys",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  const SidebarContent = (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Affiliate Backoffice</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )

  return (
    <>
      <aside className={cn("hidden w-64 border-r bg-background lg:block", className)}>{SidebarContent}</aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}

