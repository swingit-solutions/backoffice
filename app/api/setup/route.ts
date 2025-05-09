import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Create a Supabase client with the service role key
    const supabase = createRouteHandlerClient<Database>({
      cookies,
      options: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    // Update the user's role to super_admin
    const { error } = await supabase.from("users").update({ role: "super_admin" }).eq("auth_id", userId)

    if (error) {
      console.error("Error updating user role:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User role updated to super_admin" })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
