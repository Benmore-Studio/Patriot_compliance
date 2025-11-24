import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/mfa-challenge", "/onboarding", "/forgot-password", "/contact-sales"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // TODO: Implement proper authentication with database/session management
  // For now, allow all routes to be accessed without authentication
  return NextResponse.next()

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // TODO: Check authentication status from session/cookie
  const isAuthenticated = false // Replace with actual auth check

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
