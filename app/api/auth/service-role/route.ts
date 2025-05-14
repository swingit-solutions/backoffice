import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "create_tenant") {
      // 1. Create a tenant
      const { data: tenantData, error: tenantError } = await supabaseAdmin
        .from("tenants")
        .insert([
          {
            name: data.name,
            subscription_status: data.subscription_status,
            subscription_tier_id: data.subscription_tier_id,
          },
        ])
        .select()
        .single()

      if (tenantError) {
        console.error("Tenant creation error:", tenantError)
        return NextResponse.json({ error: tenantError.message }, { status: 500 })
      }

      // 2. Create a user record linked to the tenant
      const { error: userError } = await supabaseAdmin.from("users").insert([
        {
          auth_id: data.user_id,
          tenant_id: tenantData.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: "admin", // First user is the admin
        },
      ])

      if (userError) {
        console.error("User creation error:", userError)
        return NextResponse.json({ error: userError.message }, { status: 500 })
      }

      // 3. Create a default affiliate network
      const { error: networkError } = await supabaseAdmin.from("affiliate_networks").insert([
        {
          tenant_id: tenantData.id,
          name: `${data.name} Network`,
          description: "Default affiliate network",
        },
      ])

      if (networkError) {
        console.error("Network creation error:", networkError)
        return NextResponse.json({ error: networkError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Registration completed successfully",
        tenantId: tenantData.id,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Service role API error:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}
