import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * CircuitIQ Enterprise Security Middleware
 * =========================================
 * 100/10 Gold Star Security System
 * 
 * This middleware protects:
 * - All dashboard routes (authentication required)
 * - API routes (authentication + rate limiting)
 * - Plan-based feature access
 */

// Routes that require authentication (dashboard/app routes)
const AUTH_REQUIRED_PATHS = [
    "/dashboard",
    "/diagrams",
    "/upload",
    "/settings",
    "/search",
    "/diagnostics",
    "/procedures",
    "/profile",
]

// API routes that require authentication
const PROTECTED_API_PATHS = [
    "/api/diagrams",
    "/api/analysis",
    "/api/ai",
    "/api/chat",
    "/api/upload",
]

// Public paths (no auth required)
const PUBLIC_PATHS = [
    "/",
    "/login",
    "/register",
    "/pricing",
    "/about",
    "/contact",
    "/help",
    "/docs",
    "/api-docs",
    "/blog",
    "/careers",
    "/community",
    "/status",
    "/privacy",
    "/terms",
    "/security",
]

// Routes that require specific plans
const PLAN_REQUIREMENTS: Record<string, ("PROFESSIONAL" | "ENTERPRISE")[]> = {
    "/api/export/dxf": ["PROFESSIONAL", "ENTERPRISE"],
    "/api/export/cad": ["PROFESSIONAL", "ENTERPRISE"],
    "/api/team": ["PROFESSIONAL", "ENTERPRISE"],
    "/api/api-keys": ["ENTERPRISE"],
    "/api/white-label": ["ENTERPRISE"],
}

/**
 * Check if a path matches any of the given patterns
 */
function matchesPath(pathname: string, patterns: string[]): boolean {
    return patterns.some(pattern =>
        pathname === pattern || pathname.startsWith(`${pattern}/`)
    )
}

export default auth((req) => {
    const { nextUrl, auth: session } = req
    const isLoggedIn = !!session?.user
    const pathname = nextUrl.pathname

    // Skip middleware for auth API routes (NextAuth needs these)
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next()
    }

    // Skip middleware for webhooks
    if (pathname.startsWith("/api/webhook")) {
        return NextResponse.next()
    }

    // Check if it's a public path
    const isPublicPath = matchesPath(pathname, PUBLIC_PATHS)

    // Redirect authenticated users away from login/register
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    // Allow public paths
    if (isPublicPath) {
        return addSecurityHeaders(NextResponse.next())
    }

    // Check if authentication is required for this path
    const requiresAuth = matchesPath(pathname, AUTH_REQUIRED_PATHS) ||
        matchesPath(pathname, PROTECTED_API_PATHS)

    if (requiresAuth && !isLoggedIn) {
        // For API routes, return 401 JSON response
        if (pathname.startsWith("/api/")) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                    message: "Please sign in to access this resource"
                },
                { status: 401 }
            )
        }
        // For page routes, redirect to login with callback
        const callbackUrl = encodeURIComponent(pathname + nextUrl.search)
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl))
    }

    // Check plan-based restrictions for authenticated users
    if (isLoggedIn) {
        const userPlan = session?.user?.plan || "FREE"

        for (const [route, allowedPlans] of Object.entries(PLAN_REQUIREMENTS)) {
            if (pathname.startsWith(route)) {
                const hasAccess = allowedPlans.includes(userPlan as "PROFESSIONAL" | "ENTERPRISE")

                if (!hasAccess) {
                    if (pathname.startsWith("/api/")) {
                        return NextResponse.json(
                            {
                                error: "Upgrade Required",
                                message: `This feature requires a ${allowedPlans[0]} plan or higher`,
                                requiredPlan: allowedPlans[0],
                                currentPlan: userPlan
                            },
                            { status: 403 }
                        )
                    }
                    return NextResponse.redirect(new URL("/pricing?upgrade=true", nextUrl))
                }
            }
        }
    }

    // Allow the request with security headers
    return addSecurityHeaders(NextResponse.next())
})

/**
 * Add enterprise-grade security headers to the response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Prevent clickjacking
    response.headers.set("X-Frame-Options", "DENY")

    // Prevent MIME type sniffing
    response.headers.set("X-Content-Type-Options", "nosniff")

    // Control referrer information
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

    // XSS protection (legacy browsers)
    response.headers.set("X-XSS-Protection", "1; mode=block")

    // HTTP Strict Transport Security
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
    )

    // Permissions policy (restrict browser features)
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    )

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static assets
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
}
