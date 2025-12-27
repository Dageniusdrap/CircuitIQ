/**
 * CircuitIQ Authorization & Plan Limits
 * ======================================
 * Enterprise Security System - Feature Gating
 * 
 * This module defines plan limits and provides utilities
 * for checking user permissions and feature access.
 */

import { SubscriptionPlan } from "@prisma/client"

// ============================================
// PLAN LIMITS CONFIGURATION
// ============================================

export interface PlanLimits {
    // Upload limits
    diagramsPerMonth: number
    maxFileSize: number // in MB
    allowedFormats: string[]

    // AI Analysis limits
    analysesPerMonth: number
    aiQueriesPerDay: number
    maxChatHistory: number

    // Export features
    pdfExport: boolean
    dxfExport: boolean
    cadExport: boolean
    bulkExport: boolean

    // Team features
    maxTeamMembers: number
    teamCollaboration: boolean

    // Advanced features
    apiAccess: boolean
    apiCallsPerMonth: number
    webhooks: boolean
    customProcedures: boolean
    whiteLabeling: boolean
    priorityProcessing: boolean
    customAITraining: boolean

    // Support
    supportLevel: "community" | "email" | "priority" | "dedicated"
    responseTime: string
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
    FREE: {
        diagramsPerMonth: 5,
        maxFileSize: 10, // 10MB
        allowedFormats: ["pdf", "png", "jpg", "jpeg"],

        analysesPerMonth: 3,
        aiQueriesPerDay: 10,
        maxChatHistory: 5,

        pdfExport: false,
        dxfExport: false,
        cadExport: false,
        bulkExport: false,

        maxTeamMembers: 1,
        teamCollaboration: false,

        apiAccess: false,
        apiCallsPerMonth: 0,
        webhooks: false,
        customProcedures: false,
        whiteLabeling: false,
        priorityProcessing: false,
        customAITraining: false,

        supportLevel: "community",
        responseTime: "48-72 hours",
    },

    PROFESSIONAL: {
        diagramsPerMonth: -1, // unlimited
        maxFileSize: 50, // 50MB
        allowedFormats: ["pdf", "png", "jpg", "jpeg", "dwg", "dxf"],

        analysesPerMonth: 100,
        aiQueriesPerDay: 100,
        maxChatHistory: 50,

        pdfExport: true,
        dxfExport: true,
        cadExport: false,
        bulkExport: true,

        maxTeamMembers: 5,
        teamCollaboration: true,

        apiAccess: false,
        apiCallsPerMonth: 0,
        webhooks: false,
        customProcedures: true,
        whiteLabeling: false,
        priorityProcessing: true,
        customAITraining: false,

        supportLevel: "email",
        responseTime: "24 hours",
    },

    ENTERPRISE: {
        diagramsPerMonth: -1, // unlimited
        maxFileSize: 200, // 200MB
        allowedFormats: ["pdf", "png", "jpg", "jpeg", "dwg", "dxf", "step", "iges"],

        analysesPerMonth: -1, // unlimited
        aiQueriesPerDay: -1, // unlimited
        maxChatHistory: -1, // unlimited

        pdfExport: true,
        dxfExport: true,
        cadExport: true,
        bulkExport: true,

        maxTeamMembers: -1, // unlimited
        teamCollaboration: true,

        apiAccess: true,
        apiCallsPerMonth: -1, // unlimited
        webhooks: true,
        customProcedures: true,
        whiteLabeling: true,
        priorityProcessing: true,
        customAITraining: true,

        supportLevel: "dedicated",
        responseTime: "1 hour",
    },
}

// ============================================
// FEATURE FLAGS
// ============================================

export type FeatureFlag =
    | "upload_diagram"
    | "ai_analysis"
    | "ai_chat"
    | "export_pdf"
    | "export_dxf"
    | "export_cad"
    | "bulk_export"
    | "team_members"
    | "api_access"
    | "webhooks"
    | "custom_procedures"
    | "white_labeling"
    | "priority_processing"
    | "custom_ai_training"

export const FEATURE_REQUIREMENTS: Record<FeatureFlag, SubscriptionPlan[]> = {
    upload_diagram: ["FREE", "PROFESSIONAL", "ENTERPRISE"],
    ai_analysis: ["FREE", "PROFESSIONAL", "ENTERPRISE"],
    ai_chat: ["FREE", "PROFESSIONAL", "ENTERPRISE"],
    export_pdf: ["PROFESSIONAL", "ENTERPRISE"],
    export_dxf: ["PROFESSIONAL", "ENTERPRISE"],
    export_cad: ["ENTERPRISE"],
    bulk_export: ["PROFESSIONAL", "ENTERPRISE"],
    team_members: ["PROFESSIONAL", "ENTERPRISE"],
    api_access: ["ENTERPRISE"],
    webhooks: ["ENTERPRISE"],
    custom_procedures: ["PROFESSIONAL", "ENTERPRISE"],
    white_labeling: ["ENTERPRISE"],
    priority_processing: ["PROFESSIONAL", "ENTERPRISE"],
    custom_ai_training: ["ENTERPRISE"],
}

// ============================================
// AUTHORIZATION UTILITIES
// ============================================

/**
 * Check if a user has access to a specific feature
 */
export function hasFeatureAccess(
    userPlan: SubscriptionPlan | undefined,
    feature: FeatureFlag
): boolean {
    const plan = userPlan || "FREE"
    return FEATURE_REQUIREMENTS[feature].includes(plan)
}

/**
 * Get the minimum plan required for a feature
 */
export function getMinimumPlan(feature: FeatureFlag): SubscriptionPlan {
    const requiredPlans = FEATURE_REQUIREMENTS[feature]
    if (requiredPlans.includes("FREE")) return "FREE"
    if (requiredPlans.includes("PROFESSIONAL")) return "PROFESSIONAL"
    return "ENTERPRISE"
}

/**
 * Get plan limits for a user
 */
export function getPlanLimits(plan: SubscriptionPlan | undefined): PlanLimits {
    return PLAN_LIMITS[plan || "FREE"]
}

/**
 * Check if a user has reached their usage limit
 */
export function hasReachedLimit(
    plan: SubscriptionPlan | undefined,
    limitType: "diagrams" | "analyses" | "aiQueries",
    currentUsage: number
): boolean {
    const limits = getPlanLimits(plan)

    switch (limitType) {
        case "diagrams":
            return limits.diagramsPerMonth !== -1 && currentUsage >= limits.diagramsPerMonth
        case "analyses":
            return limits.analysesPerMonth !== -1 && currentUsage >= limits.analysesPerMonth
        case "aiQueries":
            return limits.aiQueriesPerDay !== -1 && currentUsage >= limits.aiQueriesPerDay
        default:
            return false
    }
}

/**
 * Get remaining usage for a limit
 */
export function getRemainingUsage(
    plan: SubscriptionPlan | undefined,
    limitType: "diagrams" | "analyses" | "aiQueries",
    currentUsage: number
): number | "unlimited" {
    const limits = getPlanLimits(plan)

    let limit: number
    switch (limitType) {
        case "diagrams":
            limit = limits.diagramsPerMonth
            break
        case "analyses":
            limit = limits.analysesPerMonth
            break
        case "aiQueries":
            limit = limits.aiQueriesPerDay
            break
        default:
            return 0
    }

    if (limit === -1) return "unlimited"
    return Math.max(0, limit - currentUsage)
}

/**
 * Compare plans (returns -1, 0, or 1)
 */
export function comparePlans(a: SubscriptionPlan, b: SubscriptionPlan): number {
    const order: SubscriptionPlan[] = ["FREE", "PROFESSIONAL", "ENTERPRISE"]
    return order.indexOf(a) - order.indexOf(b)
}

/**
 * Check if user can upgrade to a plan
 */
export function canUpgradeTo(
    currentPlan: SubscriptionPlan,
    targetPlan: SubscriptionPlan
): boolean {
    return comparePlans(currentPlan, targetPlan) < 0
}

/**
 * Get upgrade suggestion based on feature needed
 */
export function getUpgradeSuggestion(feature: FeatureFlag): {
    requiredPlan: SubscriptionPlan
    message: string
} {
    const requiredPlan = getMinimumPlan(feature)

    const messages: Record<FeatureFlag, string> = {
        upload_diagram: "Upload wiring diagrams for AI analysis",
        ai_analysis: "Get AI-powered diagnostic insights",
        ai_chat: "Chat with AI about your diagrams",
        export_pdf: "Export your analyses as PDF documents",
        export_dxf: "Export diagrams in DXF format for CAD software",
        export_cad: "Export in advanced CAD formats (STEP, IGES)",
        bulk_export: "Export multiple diagrams at once",
        team_members: "Collaborate with team members",
        api_access: "Access the CircuitIQ API for integrations",
        webhooks: "Set up webhooks for real-time notifications",
        custom_procedures: "Create custom diagnostic procedures",
        white_labeling: "White-label the platform with your branding",
        priority_processing: "Get faster AI processing times",
        custom_ai_training: "Train AI on your specific diagrams",
    }

    return {
        requiredPlan,
        message: messages[feature],
    }
}

// ============================================
// USAGE TRACKING HELPERS
// ============================================

export interface UsageStats {
    diagramsUsed: number
    diagramsLimit: number | "unlimited"
    analysesUsed: number
    analysesLimit: number | "unlimited"
    aiQueriesUsed: number
    aiQueriesLimit: number | "unlimited"
    percentageUsed: {
        diagrams: number
        analyses: number
        aiQueries: number
    }
}

export function calculateUsageStats(
    plan: SubscriptionPlan,
    usage: {
        diagramsUsed: number
        analysesUsed: number
        aiQueriesUsed: number
    }
): UsageStats {
    const limits = getPlanLimits(plan)

    const calculatePercentage = (used: number, limit: number): number => {
        if (limit === -1) return 0
        if (limit === 0) return 100
        return Math.min(100, Math.round((used / limit) * 100))
    }

    return {
        diagramsUsed: usage.diagramsUsed,
        diagramsLimit: limits.diagramsPerMonth === -1 ? "unlimited" : limits.diagramsPerMonth,
        analysesUsed: usage.analysesUsed,
        analysesLimit: limits.analysesPerMonth === -1 ? "unlimited" : limits.analysesPerMonth,
        aiQueriesUsed: usage.aiQueriesUsed,
        aiQueriesLimit: limits.aiQueriesPerDay === -1 ? "unlimited" : limits.aiQueriesPerDay,
        percentageUsed: {
            diagrams: calculatePercentage(usage.diagramsUsed, limits.diagramsPerMonth),
            analyses: calculatePercentage(usage.analysesUsed, limits.analysesPerMonth),
            aiQueries: calculatePercentage(usage.aiQueriesUsed, limits.aiQueriesPerDay),
        },
    }
}
