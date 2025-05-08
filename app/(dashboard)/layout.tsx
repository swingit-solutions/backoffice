"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { redirect } from "next/navigation"

import { supabase } from "@/lib/supabase/client"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function getUser() {
      try {
        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // Not logged in, redirect to login page
          if (pathname !== "/login" && pathname !== "/register") {
            redirect("/login")
          }
          setIsLoading(false)
          return
        }

        // Get the user details from our users table
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", session.user.id)
          .single()

        if (error || !userData) {
          console.error("Error fetching user data:", error)
          setIsLoading(false)
          return
        }

        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : undefined,
          role: userData.role,
        })

        setIsSuperAdmin(userData.role === "super_admin")
        setIsLoading(false)
      } catch (error) {
        console.error("Error in auth flow:", error)
        setIsLoading(false)
      }
    }

    getUser()
  }, [pathname])

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isSuperAdmin={isSuperAdmin} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Header user={user} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
