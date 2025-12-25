import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login", // Error code passed in query string as ?error=
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/diagrams") ||
                nextUrl.pathname.startsWith("/upload") ||
                nextUrl.pathname.startsWith("/settings") ||
                nextUrl.pathname.startsWith("/search")

            // Redirect unauthenticated users to login page
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            // Redirect authenticated users away from login/register
            else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }

            return true
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
