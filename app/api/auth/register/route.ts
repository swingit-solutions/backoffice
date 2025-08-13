import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, email, firstName, lastName, organizationName } = await request.json()

    const supabase = createServiceClient()

    // Get the free tier ID
    const { data: freeTier, error: tierError } = await supabase
      .from("subscription_tiers")
      .select("id")
      .eq("name", "Free")
      .single()

    if (tierError) {
      console.error("Error fetching free tier:", tierError)
      // Continue with null tier ID instead of throwing
    }

    console.log("Free tier fetched:", freeTier?.id)

    // Create a tenant for the organization
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: organizationName,
        subscription_status: "trial",
        subscription_tier_id: freeTier?.id || null,
      })
      .select()
      .single()

    if (tenantError) {
      console.error("Tenant creation error:", tenantError)
      throw new Error("Failed to create tenant")
    }

    console.log("Tenant created:", tenant.id)

    // Create user record
    const { error: userError } = await supabase.from("users").insert({
      auth_id: userId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: "admin", // First user becomes admin
      tenant_id: tenant.id,
    })

    if (userError) {
      console.error("User creation error:", userError)
      throw new Error("Failed to create user record")
    }

    console.log("User record created successfully")

    return NextResponse.json({ success: true, tenantId: tenant.id })
  } catch (error: any) {
    console.error("Registration API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
