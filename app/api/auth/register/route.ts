import { createServiceClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, email, firstName, lastName, organizationName } = await request.json()

    if (!userId || !email || !firstName || !lastName || !organizationName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get the free tier ID
    const { data: freeTier, error: tierError } = await supabase
      .from("subscription_tiers")
      .select("id")
      .eq("name", "Free")
      .single()

    if (tierError) {
      console.error("Error fetching free tier:", tierError)
    }

    // Create tenant
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
      console.error("Error creating tenant:", tenantError)
      throw new Error("Failed to create organization")
    }

    // Create user record
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        auth_id: userId,
        tenant_id: tenant.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: "admin",
        is_active: true,
      })
      .select()
      .single()

    if (userError) {
      console.error("Error creating user:", userError)
      throw new Error("Failed to create user record")
    }

    return NextResponse.json({
      success: true,
      tenant: tenant,
      user: user,
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
