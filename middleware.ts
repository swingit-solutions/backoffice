import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the request is for the login page
    const isLoginPage = req.nextUrl.pathname === "/"

    // Protected routes that require authentication
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/api-keys") ||
      req.nextUrl.pathname.startsWith("/sites")

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access login page, redirect to dashboard
    if (session && isLoginPage) {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // Return the original response if there's an error to prevent breaking the app
    return res
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
