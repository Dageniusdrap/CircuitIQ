"use client"

/**
 * CircuitIQ Upgrade Prompts
 * ==========================
 * Premium upgrade UI components for plan-gated features
 */

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    Lock,
    Sparkles,
    Crown,
    Rocket,
    Zap,
    ChevronRight,
    Check
} from "lucide-react"
import Link from "next/link"
import { SubscriptionPlan } from "@prisma/client"

// ============================================
// UPGRADE BANNER
// ============================================

interface UpgradeBannerProps {
    feature: string
    requiredPlan: SubscriptionPlan
    className?: string
}

export function UpgradeBanner({ feature, requiredPlan, className }: UpgradeBannerProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-orange-500/10 p-4",
            className
        )}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                        <Crown className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            Upgrade to unlock {feature}
                        </p>
                        <p className="text-sm text-slate-400">
                            This feature requires a {requiredPlan.toLowerCase()} plan
                        </p>
                    </div>
                </div>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950">
                    <Link href={`/pricing?required=${requiredPlan}`}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Upgrade Now
                    </Link>
                </Button>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-orange-500/10 blur-xl" />
        </div>
    )
}

// ============================================
// LOCKED FEATURE OVERLAY
// ============================================

interface LockedFeatureOverlayProps {
    feature: string
    requiredPlan: SubscriptionPlan
    children: React.ReactNode
    className?: string
}

export function LockedFeatureOverlay({
    feature,
    requiredPlan,
    children,
    className
}: LockedFeatureOverlayProps) {
    return (
        <div className={cn("relative", className)}>
            {/* Blurred content */}
            <div className="pointer-events-none relative blur-sm opacity-50">
                {children}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-lg">
                <Card className="max-w-sm border-amber-500/30 bg-slate-900/90 backdrop-blur-md">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                            <Lock className="h-7 w-7 text-amber-400" />
                        </div>
                        <CardTitle className="text-xl text-white">
                            {feature} is Locked
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Upgrade to {requiredPlan.toLowerCase()} to unlock this feature
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center pt-2">
                        <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950">
                            <Link href={`/pricing?required=${requiredPlan}`}>
                                <Crown className="h-4 w-4 mr-2" />
                                Upgrade to {requiredPlan}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

// ============================================
// UPGRADE REQUIRED CARD
// ============================================

interface UpgradeRequiredCardProps {
    title?: string
    description?: string
    features?: string[]
    requiredPlan: SubscriptionPlan
    className?: string
}

export function UpgradeRequiredCard({
    title = "Upgrade Required",
    description = "This feature is not available on your current plan",
    features = [],
    requiredPlan,
    className
}: UpgradeRequiredCardProps) {
    const planConfig = {
        PROFESSIONAL: {
            icon: Rocket,
            color: "from-blue-500 to-cyan-500",
            badge: "Professional",
        },
        ENTERPRISE: {
            icon: Crown,
            color: "from-amber-500 to-orange-500",
            badge: "Enterprise",
        },
        FREE: {
            icon: Zap,
            color: "from-slate-500 to-slate-600",
            badge: "Free",
        },
    }

    const config = planConfig[requiredPlan]
    const Icon = config.icon

    return (
        <Card className={cn(
            "relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-sm",
            className
        )}>
            <CardHeader className="text-center">
                <div className={cn(
                    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br",
                    config.color,
                    "p-0.5"
                )}>
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900">
                        <Icon className="h-8 w-8 text-white" />
                    </div>
                </div>
                <Badge className={cn(
                    "mx-auto mb-2 bg-gradient-to-r",
                    config.color,
                    "text-white border-0"
                )}>
                    {config.badge} Required
                </Badge>
                <CardTitle className="text-2xl text-white">{title}</CardTitle>
                <CardDescription className="text-slate-400">{description}</CardDescription>
            </CardHeader>

            {features.length > 0 && (
                <CardContent className="pt-0">
                    <div className="rounded-lg bg-slate-800/50 p-4">
                        <p className="mb-3 text-sm font-medium text-slate-300">
                            What you'll unlock:
                        </p>
                        <ul className="space-y-2">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-slate-400">
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            )}

            <CardFooter className="flex-col gap-3">
                <Button asChild className={cn(
                    "w-full bg-gradient-to-r",
                    config.color,
                    "hover:opacity-90 text-white"
                )} size="lg">
                    <Link href={`/pricing?required=${requiredPlan}`}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Upgrade to {config.badge}
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full text-slate-400 hover:text-white">
                    <Link href="/pricing">
                        Compare all plans
                    </Link>
                </Button>
            </CardFooter>

            {/* Background decoration */}
            <div className={cn(
                "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-10 blur-3xl",
                config.color
            )} />
        </Card>
    )
}

// ============================================
// INLINE UPGRADE PROMPT
// ============================================

interface InlineUpgradePromptProps {
    feature: string
    requiredPlan: SubscriptionPlan
    compact?: boolean
}

export function InlineUpgradePrompt({
    feature,
    requiredPlan,
    compact = false
}: InlineUpgradePromptProps) {
    if (compact) {
        return (
            <Button
                variant="outline"
                size="sm"
                asChild
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
            >
                <Link href={`/pricing?required=${requiredPlan}`}>
                    <Lock className="h-3 w-3 mr-1" />
                    Upgrade
                </Link>
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
            <Lock className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-300">
                {feature} requires {requiredPlan.toLowerCase()}
            </span>
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="ml-auto text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-7 px-2"
            >
                <Link href={`/pricing?required=${requiredPlan}`}>
                    Upgrade
                    <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
            </Button>
        </div>
    )
}

// ============================================
// USAGE LIMIT WARNING
// ============================================

interface UsageLimitWarningProps {
    used: number
    limit: number
    type: "diagrams" | "analyses" | "AI queries"
    className?: string
}

export function UsageLimitWarning({ used, limit, type, className }: UsageLimitWarningProps) {
    const percentage = Math.round((used / limit) * 100)
    const isNearLimit = percentage >= 80
    const isAtLimit = percentage >= 100

    if (percentage < 80) return null

    return (
        <div className={cn(
            "rounded-lg border p-3",
            isAtLimit
                ? "border-red-500/30 bg-red-500/10"
                : "border-amber-500/30 bg-amber-500/10",
            className
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className={cn(
                        "h-4 w-4",
                        isAtLimit ? "text-red-400" : "text-amber-400"
                    )} />
                    <span className="text-sm text-slate-300">
                        {isAtLimit
                            ? `You've reached your ${type} limit`
                            : `${percentage}% of ${type} used`
                        }
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn(
                        "h-7 px-2",
                        isAtLimit
                            ? "text-red-400 hover:text-red-300"
                            : "text-amber-400 hover:text-amber-300"
                    )}
                >
                    <Link href="/pricing">
                        Upgrade
                    </Link>
                </Button>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-700">
                <div
                    className={cn(
                        "h-full rounded-full transition-all",
                        isAtLimit
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-amber-500 to-amber-600"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            <p className="mt-1 text-xs text-slate-500">
                {used} / {limit} {type} used this month
            </p>
        </div>
    )
}
