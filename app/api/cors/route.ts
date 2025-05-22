import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get("origin") || ""

  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:3000",
    "https://backoffice.swingit.solutions",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean)

  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Create response headers
  const headers = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  }

  // Return the response with CORS headers
  return NextResponse.json({ status: "CORS enabled" }, { headers })
}
