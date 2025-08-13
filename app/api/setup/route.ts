import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Update the user's role to super_admin
    const { error } = await supabase.from("users").update({ role: "super_admin" }).eq("auth_id", userId)

    if (error) {
      console.error("Error updating user role:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User role updated to super_admin",
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    // Check if any super admin exists
    const { data: superAdmins, error } = await supabase.from("users").select("id").eq("role", "super_admin").limit(1)

    if (error) {
      console.error("Error checking super admin:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      needsSetup: !superAdmins || superAdmins.length === 0,
    })
  } catch (error) {
    console.error("Setup check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
