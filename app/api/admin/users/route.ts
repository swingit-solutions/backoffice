import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Create a Supabase client with the service role key for admin operations
    const supabase = createRouteHandlerClient<Database>({
      cookies,
      options: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    // Get the current user's session to verify they're an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
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

    // Fetch all users with their tenant information
    const { data: users, error } = await supabase
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
