import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Get user details from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json({ error: "Error fetching user data" }, { status: 500 })
    }

    // Check if user exists and has a valid role
    if (!userData) {
      console.error("User not found in users table")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return success with user data
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        firstName: userData.first_name,
        lastName: userData.last_name,
        tenantId: userData.tenant_id,
      },
    })
  } catch (error: any) {
    console.error("Unexpected error during login:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
