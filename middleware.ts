import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  // Create a response object that we'll modify and return
  const res = NextResponse.next()

  try {
    // Create a Supabase client
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the request is for the login page
    const isLoginPage = req.nextUrl.pathname === "/"

    // Define protected routes
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/api-keys") ||
      req.nextUrl.pathname.startsWith("/sites")

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!session && isProtectedRoute) {
      console.log("No session, redirecting to login page")
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access login page, redirect to dashboard
    if (session && isLoginPage) {
      console.log("Session exists, redirecting to dashboard")
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // For all other cases, continue with the request
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, just continue with the request to avoid breaking the app
    return res
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
