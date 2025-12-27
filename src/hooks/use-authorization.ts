"use client"

/**
 * CircuitIQ Client Authorization Hook
 * =====================================
 * Enterprise Security System - Client-side Feature Gating
 * 
 * Use this hook in client components to check feature access
 * and show appropriate upgrade prompts.
 */

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useMemo, useCallback } from "react"
import { toast } from "sonner"
import { SubscriptionPlan } from "@prisma/client"

// Plan limits (mirrored from server for client-side checks)
export interface ClientPlanLimits {
    diagramsPerMonth: number
    maxFileSize: number
    analysesPerMonth: number
    aiQueriesPerDay: number
    pdfExport: boolean
    dxfExport: boolean
    cadExport: boolean
    teamMembers: number
    apiAccess: boolean
    priorityProcessing: boolean
}

const PLAN_LIMITS: Record<SubscriptionPlan, ClientPlanLimits> = {
    FREE: {
        diagramsPerMonth: 5,
        maxFileSize: 10,
        analysesPerMonth: 3,
        aiQueriesPerDay: 10,
        pdfExport: false,
        dxfExport: false,
        cadExport: false,
        teamMembers: 1,
        apiAccess: false,
        priorityProcessing: false,
    },
    PROFESSIONAL: {
        diagramsPerMonth: -1,
        maxFileSize: 50,
        analysesPerMonth: 100,
        aiQueriesPerDay: 100,
        pdfExport: true,
        dxfExport: true,
        cadExport: false,
        teamMembers: 5,
        apiAccess: false,
        priorityProcessing: true,
    },
    ENTERPRISE: {
        diagramsPerMonth: -1,
        maxFileSize: 200,
        analysesPerMonth: -1,
        aiQueriesPerDay: -1,
        pdfExport: true,
        dxfExport: true,
        cadExport: true,
        teamMembers: -1,
        apiAccess: true,
        priorityProcessing: true,
    },
}

// Feature definitions
type Feature =
    | "upload_diagram"
    | "ai_analysis"
    | "export_pdf"
    | "export_dxf"
    | "export_cad"
    | "team_members"
    | "api_access"
    | "priority_processing"

const FEATURE_PLANS: Record<Feature, SubscriptionPlan[]> = {
    upload_diagram: ["FREE", "PROFESSIONAL", "ENTERPRISE"],
    ai_analysis: ["FREE", "PROFESSIONAL", "ENTERPRISE"],
    export_pdf: ["PROFESSIONAL", "ENTERPRISE"],
    export_dxf: ["PROFESSIONAL", "ENTERPRISE"],
    export_cad: ["ENTERPRISE"],
    team_members: ["PROFESSIONAL", "ENTERPRISE"],
    api_access: ["ENTERPRISE"],
    priority_processing: ["PROFESSIONAL", "ENTERPRISE"],
}

const FEATURE_NAMES: Record<Feature, string> = {
    upload_diagram: "Diagram Upload",
    ai_analysis: "AI Analysis",
    export_pdf: "PDF Export",
    export_dxf: "DXF Export",
    export_cad: "CAD Export",
    team_members: "Team Collaboration",
    api_access: "API Access",
    priority_processing: "Priority Processing",
}

export function useAuthorization() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const userPlan = useMemo(() => {
        return (session?.user?.plan as SubscriptionPlan) || "FREE"
    }, [session])

    const isAuthenticated = useMemo(() => {
        return status === "authenticated" && !!session?.user
    }, [status, session])

    const isLoading = useMemo(() => {
        return status === "loading"
    }, [status])

    const planLimits = useMemo(() => {
        return PLAN_LIMITS[userPlan]
    }, [userPlan])

    /**
     * Check if user has access to a feature
     */
    const hasAccess = useCallback((feature: Feature): boolean => {
        return FEATURE_PLANS[feature].includes(userPlan)
    }, [userPlan])

    /**
     * Get minimum plan required for a feature
     */
    const getRequiredPlan = useCallback((feature: Feature): SubscriptionPlan => {
        const plans = FEATURE_PLANS[feature]
        if (plans.includes("FREE")) return "FREE"
        if (plans.includes("PROFESSIONAL")) return "PROFESSIONAL"
        return "ENTERPRISE"
    }, [])

    /**
     * Check access and show upgrade toast if needed
     */
    const checkAccessWithPrompt = useCallback((feature: Feature): boolean => {
        if (!isAuthenticated) {
            toast.error("Please sign in to use this feature")
            router.push("/login")
            return false
        }

        if (!hasAccess(feature)) {
            const requiredPlan = getRequiredPlan(feature)
            const featureName = FEATURE_NAMES[feature]

            toast.error(`${featureName} requires ${requiredPlan} plan`, {
                description: "Upgrade your plan to unlock this feature",
                action: {
                    label: "Upgrade",
                    onClick: () => router.push(`/pricing?feature=${feature}`),
                },
                duration: 5000,
            })
            return false
        }

        return true
    }, [isAuthenticated, hasAccess, getRequiredPlan, router])

    /**
     * Require authentication, redirect if not authenticated
     */
    const requireAuth = useCallback(() => {
        if (!isAuthenticated) {
            router.push("/login")
            return false
        }
        return true
    }, [isAuthenticated, router])

    /**
     * Require specific plan, show upgrade prompt if not met
     */
    const requirePlan = useCallback((minimumPlan: SubscriptionPlan): boolean => {
        if (!isAuthenticated) {
            router.push("/login")
            return false
        }

        const planOrder: SubscriptionPlan[] = ["FREE", "PROFESSIONAL", "ENTERPRISE"]
        const userIndex = planOrder.indexOf(userPlan)
        const requiredIndex = planOrder.indexOf(minimumPlan)

        if (userIndex < requiredIndex) {
            toast.error(`This feature requires ${minimumPlan} plan`, {
                description: "Upgrade your plan to continue",
                action: {
                    label: "Upgrade",
                    onClick: () => router.push(`/pricing?required=${minimumPlan}`),
                },
                duration: 5000,
            })
            return false
        }

        return true
    }, [isAuthenticated, userPlan, router])

    /**
     * Get upgrade CTA for a feature
     */
    const getUpgradeCTA = useCallback((feature: Feature) => {
        const requiredPlan = getRequiredPlan(feature)
        const featureName = FEATURE_NAMES[feature]

        return {
            title: `Unlock ${featureName}`,
            description: `Upgrade to ${requiredPlan} to access this feature`,
            buttonText: `Upgrade to ${requiredPlan}`,
            onClick: () => router.push(`/pricing?feature=${feature}`),
        }
    }, [getRequiredPlan, router])

    /**
     * Check if user is on free plan
     */
    const isFreePlan = useMemo(() => {
        return userPlan === "FREE"
    }, [userPlan])

    /**
     * Check if user is on paid plan
     */
    const isPaidPlan = useMemo(() => {
        return userPlan === "PROFESSIONAL" || userPlan === "ENTERPRISE"
    }, [userPlan])

    /**
     * Check if user is enterprise
     */
    const isEnterprise = useMemo(() => {
        return userPlan === "ENTERPRISE"
    }, [userPlan])

    return {
        // State
        session,
        userPlan,
        isAuthenticated,
        isLoading,
        planLimits,
        isFreePlan,
        isPaidPlan,
        isEnterprise,

        // Feature checks
        hasAccess,
        checkAccessWithPrompt,
        getRequiredPlan,
        getUpgradeCTA,

        // Auth helpers
        requireAuth,
        requirePlan,
    }
}

// Export types for external use
export type { Feature, SubscriptionPlan }
