import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const type = searchParams.get("type")

  console.log("Auth callback received:", { code: !!code, type, next })

  if (code) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        console.log("User authenticated successfully:", data.user.id)

        // Handle different confirmation types
        if (type === "signup" || type === "email") {
          // For email confirmations, redirect to a success page first
          return NextResponse.redirect(`${origin}/auth/confirmed?next=${encodeURIComponent(next)}`)
        }

        // For other auth flows, redirect directly
        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalEnv = process.env.NODE_ENV === "development"

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      }
    } catch (err) {
      console.error("Unexpected auth callback error:", err)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected_error`)
    }
  }

  console.log("No code provided in auth callback")
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}
