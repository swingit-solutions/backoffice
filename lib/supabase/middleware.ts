import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Add export for dynamic middleware
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function middleware(req: NextRequest) {
  // Create a response object that we'll modify and return
  const res = NextResponse.next()

  try {
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            req.cookies.set({
              name,
              value: "",
              ...options,
            })
            res.cookies.set({
              name,
              value: "",
              ...options,
            })
          },
        },
      },
    )

    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the request is for the login page
    const isLoginPage = req.nextUrl.pathname === "/"
    const isRegisterPage = req.nextUrl.pathname === "/register"
    const isAuthPage = isLoginPage || isRegisterPage

    // Define protected routes
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/api-keys") ||
      req.nextUrl.pathname.startsWith("/sites") ||
      req.nextUrl.pathname.startsWith("/networks") ||
      req.nextUrl.pathname.startsWith("/users") ||
      req.nextUrl.pathname.startsWith("/admin")

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!session && isProtectedRoute) {
      console.log("No session, redirecting to login page")
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access login page, redirect to dashboard
    if (session && isAuthPage) {
      console.log("Session exists, redirecting to dashboard")
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // For all other cases, continue with the request
    const { pathname } = req.nextUrl

    // Add the site URL to the request headers if it's not already there
    const requestHeaders = new Headers(req.headers)
    if (!requestHeaders.has("x-site-url")) {
      requestHeaders.set("x-site-url", process.env.NEXT_PUBLIC_APP_URL || "https://backoffice.swingit.solutions")
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
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
