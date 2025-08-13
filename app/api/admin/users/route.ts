import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get the current user's session to verify they're an admin
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's role from the database
    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", session.user.id)
      .single()

    if (userError) {
      console.error("User role error:", userError)
      return NextResponse.json({ error: "Failed to verify user role" }, { status: 500 })
    }

    if (!currentUser || currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Super admin access required" }, { status: 403 })
    }

    // Create admin client for fetching all users
    const adminSupabase = createClient()

    // Fetch all users with their tenant information
    const { data: users, error } = await adminSupabase
      .from("users")
      .select(`
        id,
        auth_id,
        email,
        first_name,
        last_name,
        role,
        created_at,
        tenants (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { email, firstName, lastName, role, tenantId } = body

    // Get the current user's session to verify they're an admin
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's role from the database
    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", session.user.id)
      .single()

    if (userError || !currentUser || currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Super admin access required" }, { status: 403 })
    }

    // Create the user in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-8), // Temporary password
      email_confirm: true,
    })

    if (authError) {
      console.error("Auth user creation error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Create the user in the database
    const { data: dbUser, error: dbError } = await supabase
      .from("users")
      .insert({
        auth_id: authUser.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        tenant_id: tenantId,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database user creation error:", dbError)
      // Clean up auth user if database insert fails
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error("Create user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
