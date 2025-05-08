export const dynamic = "force-dynamic"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * This route is used to set up the initial admin user after registration
 * It should be called after the user has registered and verified their email
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email)

    if (authError || !authUser?.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the user already exists in our users table
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      // Update the user to be a super admin
      const { error: updateError } = await supabase
        .from("users")
        .update({
          role: "super_admin",
          tenant_id: null,
          auth_id: authUser.user.id,
        })
        .eq("email", email)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    } else {
      // Create a new super admin user
      const { error: insertError } = await supabase.from("users").insert({
        email,
        role: "super_admin",
        auth_id: authUser.user.id,
        first_name: "Super",
        last_name: "Admin",
      })

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
