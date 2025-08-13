"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Key, Globe, Menu, X, PlusCircle } from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "API Keys",
      href: "/api-keys",
      icon: Key,
    },
    {
      name: "Sites",
      href: "/sites",
      icon: Globe,
    },
  ]

  return (
    <>
      <div className="md:hidden flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className={cn("fixed inset-0 z-50 bg-background md:static md:z-auto", isOpen ? "flex" : "hidden md:flex")}>
        <div className="flex w-full max-w-xs flex-col border-r bg-background p-4 md:w-64">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Backoffice</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="mt-8 flex flex-1 flex-col">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4">
              <Link href="/sites/new">
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
