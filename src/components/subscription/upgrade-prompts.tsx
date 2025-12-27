"use client";

import { useState } from "react";
import { Zap, Crown, Lock, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Plan feature limits
const PLAN_LIMITS = {
    FREE: {
        diagrams: 3,
        analyses: 5,
        aiQueries: 10,
        exportFormats: ["PDF"],
    },
    PROFESSIONAL: {
        diagrams: 50,
        analyses: 100,
        aiQueries: 500,
        exportFormats: ["PDF", "PNG", "SVG", "DXF"],
    },
    ENTERPRISE: {
        diagrams: Infinity,
        analyses: Infinity,
        aiQueries: Infinity,
        exportFormats: ["PDF", "PNG", "SVG", "DXF", "AutoCAD"],
    },
};

interface UpgradeBannerProps {
    feature?: string;
    currentPlan?: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
    className?: string;
}

/**
 * A dismissible banner that encourages free users to upgrade
 */
export function UpgradeBanner({
    feature = "this feature",
    currentPlan = "FREE",
    className
}: UpgradeBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || currentPlan !== "FREE") return null;

    return (
        <div className={cn(
            "relative bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 overflow-hidden",
            className
        )}>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/10 to-blue-500/5" />

            {/* Dismiss Button */}
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="relative flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-white">Unlock {feature}</h4>
                    <p className="text-sm text-slate-400">
                        Upgrade to Pro to access advanced features and higher limits
                    </p>
                </div>
                <Button asChild size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <Link href="/pricing?upgrade=true" className="flex items-center gap-2">
                        Upgrade Now
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

interface FeatureLockedProps {
    feature: string;
    requiredPlan?: "PROFESSIONAL" | "ENTERPRISE";
    description?: string;
    className?: string;
}

/**
 * A card that displays when a feature is locked for the user's current plan
 */
export function FeatureLocked({
    feature,
    requiredPlan = "PROFESSIONAL",
    description,
    className
}: FeatureLockedProps) {
    const planLabel = requiredPlan === "ENTERPRISE" ? "Enterprise" : "Pro";
    const planIcon = requiredPlan === "ENTERPRISE" ? Crown : Zap;
    const PlanIcon = planIcon;

    return (
        <div className={cn(
            "relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 overflow-hidden",
            className
        )}>
            {/* Lock Icon Overlay */}
            <div className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50">
                <Lock className="h-5 w-5 text-slate-400" />
            </div>

            <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 mb-4">
                    <PlanIcon className={cn(
                        "h-10 w-10",
                        requiredPlan === "ENTERPRISE" ? "text-amber-400" : "text-cyan-400"
                    )} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{feature}</h3>
                <p className="text-slate-400 mb-6 max-w-sm">
                    {description || `This feature is available on the ${planLabel} plan. Upgrade to unlock advanced capabilities.`}
                </p>

                <Button asChild className={cn(
                    "w-full max-w-xs",
                    requiredPlan === "ENTERPRISE"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                )}>
                    <Link href="/pricing?upgrade=true" className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Upgrade to {planLabel}
                    </Link>
                </Button>
            </div>
        </div>
    );
}

interface PlanComparisonPopupProps {
    feature: string;
    currentPlan: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
    isOpen: boolean;
    onClose: () => void;
}

/**
 * A popup that shows a comparison of what's included in each plan for a specific feature
 */
export function PlanComparisonPopup({
    feature,
    currentPlan,
    isOpen,
    onClose
}: PlanComparisonPopupProps) {
    if (!isOpen) return null;

    const plans = [
        {
            name: "Free",
            key: "FREE" as const,
            icon: null,
            color: "text-slate-400",
            features: [
                "3 diagrams",
                "5 analyses per month",
                "Basic AI queries",
                "PDF export only",
            ],
        },
        {
            name: "Professional",
            key: "PROFESSIONAL" as const,
            icon: Zap,
            color: "text-cyan-400",
            features: [
                "50 diagrams",
                "100 analyses per month",
                "500 AI queries",
                "All export formats",
                "Priority support",
                "Advanced diagnostics",
            ],
        },
        {
            name: "Enterprise",
            key: "ENTERPRISE" as const,
            icon: Crown,
            color: "text-amber-400",
            features: [
                "Unlimited diagrams",
                "Unlimited analyses",
                "Unlimited AI queries",
                "All export formats",
                "24/7 support",
                "Custom integrations",
                "API access",
                "Team management",
            ],
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Unlock {feature}</h2>
                    <p className="text-slate-400">Compare plans to find the best fit for your needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrent = plan.key === currentPlan;

                        return (
                            <div
                                key={plan.key}
                                className={cn(
                                    "relative p-4 rounded-xl border transition-all",
                                    isCurrent
                                        ? "bg-slate-800/80 border-cyan-500/50"
                                        : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                                )}
                            >
                                {isCurrent && (
                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full font-medium">
                                        Current
                                    </span>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    {Icon && <Icon className={cn("h-5 w-5", plan.color)} />}
                                    <h3 className={cn("font-semibold", plan.color)}>{plan.name}</h3>
                                </div>

                                <ul className="space-y-2">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                            <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                {!isCurrent && plan.key !== "FREE" && (
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn(
                                            "w-full mt-4",
                                            plan.key === "ENTERPRISE"
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                        )}
                                    >
                                        <Link href={`/pricing?plan=${plan.key.toLowerCase()}`}>
                                            Upgrade
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/pricing"
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                    >
                        View full pricing details →
                    </Link>
                </div>
            </div>
        </div>
    );
}

interface UsageLimitWarningProps {
    resourceType: "diagrams" | "analyses" | "aiQueries";
    currentUsage: number;
    currentPlan: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
    className?: string;
}

/**
 * Shows a warning when the user is approaching their usage limit
 */
export function UsageLimitWarning({
    resourceType,
    currentUsage,
    currentPlan,
    className
}: UsageLimitWarningProps) {
    const limit = PLAN_LIMITS[currentPlan][resourceType];

    // Don't show for unlimited plans
    if (limit === Infinity) return null;

    const percentage = (currentUsage / limit) * 100;
    const isNearLimit = percentage >= 80;
    const isAtLimit = currentUsage >= limit;

    if (!isNearLimit) return null;

    const labels = {
        diagrams: "diagrams",
        analyses: "analyses",
        aiQueries: "AI queries",
    };

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border",
            isAtLimit
                ? "bg-red-500/10 border-red-500/30"
                : "bg-amber-500/10 border-amber-500/30",
            className
        )}>
            <div className={cn(
                "p-1.5 rounded-lg",
                isAtLimit ? "bg-red-500/20" : "bg-amber-500/20"
            )}>
                <Zap className={cn(
                    "h-4 w-4",
                    isAtLimit ? "text-red-400" : "text-amber-400"
                )} />
            </div>
            <div className="flex-1">
                <p className={cn(
                    "text-sm font-medium",
                    isAtLimit ? "text-red-400" : "text-amber-400"
                )}>
                    {isAtLimit
                        ? `You've reached your ${labels[resourceType]} limit`
                        : `${limit - currentUsage} ${labels[resourceType]} remaining`
                    }
                </p>
            </div>
            <Button
                asChild
                size="sm"
                variant="ghost"
                className={cn(
                    "shrink-0",
                    isAtLimit
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        : "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                )}
            >
                <Link href="/pricing?upgrade=true">
                    Upgrade
                </Link>
            </Button>
        </div>
    );
}
