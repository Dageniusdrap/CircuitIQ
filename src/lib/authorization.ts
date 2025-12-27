/**
 * CircuitIQ Server Authorization
 * ================================
 * Enterprise Security System - Server-side Auth Helpers
 * 
 * Use these utilities in API routes and server components
 * to enforce authentication and authorization.
 */

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SubscriptionPlan } from "@prisma/client"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import {
    hasFeatureAccess,
    hasReachedLimit,
    getPlanLimits,
    FeatureFlag
} from "./plans"

// Error types for better error handling
export class AuthorizationError extends Error {
    constructor(
        message: string,
        public code: "UNAUTHORIZED" | "FORBIDDEN" | "LIMIT_EXCEEDED" | "PLAN_REQUIRED",
        public requiredPlan?: SubscriptionPlan
    ) {
        super(message)
        this.name = "AuthorizationError"
    }
}

// ============================================
// SERVER COMPONENT HELPERS
// ============================================

/**
 * Get the current session (for server components)
 * Returns null if not authenticated
 */
export async function getSession() {
    return await auth()
}

/**
 * Require authentication in server component
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return session
}

/**
 * Require a specific plan in server component
 * Redirects to pricing if plan doesn't meet requirements
 */
export async function requirePlan(minimumPlan: SubscriptionPlan) {
    const session = await requireAuth()
    const userPlan = session.user.plan || "FREE"

    const planOrder: SubscriptionPlan[] = ["FREE", "PROFESSIONAL", "ENTERPRISE"]
    const userPlanIndex = planOrder.indexOf(userPlan)
    const requiredPlanIndex = planOrder.indexOf(minimumPlan)

    if (userPlanIndex < requiredPlanIndex) {
        redirect(`/pricing?upgrade=true&required=${minimumPlan}`)
    }

    return session
}

/**
 * Require a specific feature in server component
 */
export async function requireFeature(feature: FeatureFlag) {
    const session = await requireAuth()
    const userPlan = session.user.plan || "FREE"

    if (!hasFeatureAccess(userPlan, feature)) {
        redirect(`/pricing?feature=${feature}`)
    }

    return session
}

// ============================================
// API ROUTE HELPERS
// ============================================

/**
 * Protect an API route with authentication
 * Returns JSON error response if not authenticated
 */
export async function protectApiRoute() {
    const session = await auth()

    if (!session?.user) {
        throw new AuthorizationError(
            "Please sign in to access this resource",
            "UNAUTHORIZED"
        )
    }

    return session
}

/**
 * Protect an API route with plan requirements
 */
export async function protectApiRouteWithPlan(minimumPlan: SubscriptionPlan) {
    const session = await protectApiRoute()
    const userPlan = session.user.plan || "FREE"

    const planOrder: SubscriptionPlan[] = ["FREE", "PROFESSIONAL", "ENTERPRISE"]
    const userPlanIndex = planOrder.indexOf(userPlan)
    const requiredPlanIndex = planOrder.indexOf(minimumPlan)

    if (userPlanIndex < requiredPlanIndex) {
        throw new AuthorizationError(
            `This feature requires a ${minimumPlan} plan or higher`,
            "PLAN_REQUIRED",
            minimumPlan
        )
    }

    return session
}

/**
 * Protect an API route with feature requirements
 */
export async function protectApiRouteWithFeature(feature: FeatureFlag) {
    const session = await protectApiRoute()
    const userPlan = session.user.plan || "FREE"

    if (!hasFeatureAccess(userPlan, feature)) {
        throw new AuthorizationError(
            `This feature requires an upgraded plan`,
            "FORBIDDEN"
        )
    }

    return session
}

/**
 * Check usage limits before performing an action
 */
export async function checkUsageLimit(
    userId: string,
    limitType: "diagrams" | "analyses" | "aiQueries"
) {
    // Get user with subscription
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
    })

    if (!user) {
        throw new AuthorizationError(
            "User not found",
            "UNAUTHORIZED"
        )
    }

    const plan = user.plan || "FREE"
    const subscription = user.subscription

    let currentUsage = 0
    switch (limitType) {
        case "diagrams":
            currentUsage = subscription?.diagramsUsed || 0
            break
        case "analyses":
            currentUsage = subscription?.analysesUsed || 0
            break
        case "aiQueries":
            currentUsage = subscription?.aiQueriesUsed || 0
            break
    }

    if (hasReachedLimit(plan, limitType, currentUsage)) {
        const limits = getPlanLimits(plan)
        let limitValue: number
        switch (limitType) {
            case "diagrams":
                limitValue = limits.diagramsPerMonth
                break
            case "analyses":
                limitValue = limits.analysesPerMonth
                break
            case "aiQueries":
                limitValue = limits.aiQueriesPerDay
                break
        }

        throw new AuthorizationError(
            `You've reached your ${limitType} limit (${currentUsage}/${limitValue}). Please upgrade your plan.`,
            "LIMIT_EXCEEDED",
            plan === "FREE" ? "PROFESSIONAL" : "ENTERPRISE"
        )
    }

    return {
        user,
        subscription,
        currentUsage,
    }
}

/**
 * Increment usage counter after successful operation
 */
export async function incrementUsage(
    userId: string,
    field: "diagramsUsed" | "analysesUsed" | "aiQueriesUsed"
) {
    // Get or create subscription record
    let subscription = await prisma.subscription.findUnique({
        where: { userId },
    })

    if (!subscription) {
        // Create subscription record if it doesn't exist
        subscription = await prisma.subscription.create({
            data: {
                userId,
                plan: "FREE",
                status: "ACTIVE",
                [field]: 1,
            },
        })
    } else {
        // Increment the usage counter
        subscription = await prisma.subscription.update({
            where: { userId },
            data: {
                [field]: { increment: 1 },
            },
        })
    }

    return subscription
}

/**
 * Reset usage limits (called by cron job at beginning of billing cycle)
 */
export async function resetUsageLimits(userId: string) {
    return await prisma.subscription.update({
        where: { userId },
        data: {
            diagramsUsed: 0,
            analysesUsed: 0,
            aiQueriesUsed: 0,
        },
    })
}

// ============================================
// API ERROR RESPONSE HELPERS
// ============================================

/**
 * Create a standard error response for API routes
 */
export function createErrorResponse(error: AuthorizationError) {
    const statusMap: Record<AuthorizationError["code"], number> = {
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        LIMIT_EXCEEDED: 429,
        PLAN_REQUIRED: 403,
    }

    return NextResponse.json(
        {
            error: error.code,
            message: error.message,
            requiredPlan: error.requiredPlan,
        },
        { status: statusMap[error.code] }
    )
}

/**
 * Handle authorization errors in API routes
 * Usage: catch (error) { return handleAuthError(error) }
 */
export function handleAuthError(error: unknown) {
    if (error instanceof AuthorizationError) {
        return createErrorResponse(error)
    }
    throw error
}

// ============================================
// ACTIVITY LOGGING
// ============================================

/**
 * Log user activity for audit trail
 */
export async function logActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: Record<string, unknown>,
    request?: Request
) {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action,
                entityType,
                entityId,
                details: (details || {}) as Prisma.InputJsonValue,
                ipAddress: request?.headers.get("x-forwarded-for") ||
                    request?.headers.get("x-real-ip") ||
                    undefined,
                userAgent: request?.headers.get("user-agent") || undefined,
            },
        })
    } catch (error) {
        // Don't fail the request if logging fails
        console.error("Failed to log activity:", error)
    }
}
