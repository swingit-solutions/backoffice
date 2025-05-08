import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import TenantManagement from "@/components/super-admin/tenant-management"

export default async function TenantsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated and is a super admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

  if (!user || user.role !== "super_admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tenant Management</h1>
      <TenantManagement />
    </div>
  )
}
