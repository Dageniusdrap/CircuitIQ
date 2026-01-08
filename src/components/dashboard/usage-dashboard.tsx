"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Upload,
    Brain,
    BookOpen,
    FileText,
    TrendingUp,
    AlertCircle,
    Crown,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface UsageData {
    current: {
        diagramUploads: number
        aiAnalyses: number
        procedureViews: number
        pdfExports: number
        dxfExports: number
        apiCalls: number
    }
    limits: {
        diagramUploads: number | null
        aiAnalyses: number | null
        procedureViews: number | null
        pdfExports: number | null
        dxfExports: number | null
        apiCalls: number | null
    }
}

interface UsageDashboardProps {
    userPlan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE'
}

export function UsageDashboard({ userPlan }: UsageDashboardProps) {
    const [usage, setUsage] = useState<UsageData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsage()
    }, [])

    const fetchUsage = async () => {
        try {
            const response = await fetch('/api/usage')
            if (response.ok) {
                const data = await response.json()
                setUsage(data)
            }
        } catch (error) {
            console.error('Failed to fetch usage:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Usage Overview</CardTitle>
                    <CardDescription>Loading your usage data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!usage) {
        return null
    }

    const usageMetrics = [
        {
            name: 'Diagram Uploads',
            current: usage.current.diagramUploads,
            limit: usage.limits.diagramUploads,
            icon: Upload,
            color: 'blue',
        },
        {
            name: 'AI Analyses',
            current: usage.current.aiAnalyses,
            limit: usage.limits.aiAnalyses,
            icon: Brain,
            color: 'purple',
        },
        {
            name: 'Procedure Views',
            current: usage.current.procedureViews,
            limit: usage.limits.procedureViews,
            icon: BookOpen,
            color: 'green',
        },
        {
            name: 'PDF Exports',
            current: usage.current.pdfExports,
            limit: usage.limits.pdfExports,
            icon: FileText,
            color: 'orange',
        },
    ]

    const calculatePercentage = (current: number, limit: number | null) => {
        if (limit === null || limit === 0) return 0
        return Math.min((current / limit) * 100, 100)
    }

    const getStatusColor = (percentage: number) => {
        if (percentage >= 100) return 'text-red-500'
        if (percentage >= 80) return 'text-amber-500'
        return 'text-emerald-500'
    }

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'bg-red-500'
        if (percentage >= 80) return 'bg-amber-500'
        return 'bg-emerald-500'
    }

    const hasLimitWarning = usageMetrics.some(metric => {
        if (metric.limit === null) return false
        const percentage = calculatePercentage(metric.current, metric.limit)
        return percentage >= 80
    })

    return (
        <div className="space-y-6">
            {/* Plan Badge & Upgrade Banner */}
            <Card className={cn(
                "border-white/5 backdrop-blur-sm",
                userPlan === 'FREE' && "bg-gradient-to-br from-slate-900/60 to-slate-800/60",
                userPlan === 'PROFESSIONAL' && "bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-500/20",
                userPlan === 'ENTERPRISE' && "bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/20"
            )}>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {userPlan === 'ENTERPRISE' && <Crown className="h-5 w-5 text-purple-400" />}
                            {userPlan === 'PROFESSIONAL' && <TrendingUp className="h-5 w-5 text-amber-400" />}
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{userPlan} Plan</h3>
                                    {hasLimitWarning && userPlan === 'FREE' && (
                                        <Badge variant="destructive" className="text-xs">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Approaching Limit
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {userPlan === 'FREE' && 'Limited access - Upgrade for more features'}
                                    {userPlan === 'PROFESSIONAL' && 'Professional features enabled'}
                                    {userPlan === 'ENTERPRISE' && 'Unlimited access to all features'}
                                </p>
                            </div>
                        </div>
                        {userPlan !== 'ENTERPRISE' && (
                            <Link href="/pricing">
                                <Button
                                    variant={userPlan === 'FREE' ? 'default' : 'outline'}
                                    className={cn(
                                        userPlan === 'FREE' && "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500"
                                    )}
                                >
                                    {userPlan === 'FREE' ? 'Upgrade Now' : 'View Plans'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Usage Metrics */}
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Usage This Month</CardTitle>
                    <CardDescription>
                        Track your monthly usage across all features
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {usageMetrics.map((metric) => {
                            const percentage = calculatePercentage(metric.current, metric.limit)
                            const Icon = metric.icon
                            const isUnlimited = metric.limit === null
                            const isNearLimit = percentage >= 80 && !isUnlimited
                            const isAtLimit = percentage >= 100

                            return (
                                <div key={metric.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={cn(
                                                "h-4 w-4",
                                                isAtLimit ? "text-red-400" :
                                                    isNearLimit ? "text-amber-400" :
                                                        "text-slate-400"
                                            )} />
                                            <span className="text-sm font-medium">{metric.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-sm font-mono",
                                                getStatusColor(percentage)
                                            )}>
                                                {metric.current}
                                                {!isUnlimited && ` / ${metric.limit}`}
                                                {isUnlimited && ' (unlimited)'}
                                            </span>
                                            {!isUnlimited && (
                                                <span className="text-xs text-muted-foreground">
                                                    {Math.round(percentage)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {!isUnlimited && (
                                        <div className={cn("w-full bg-secondary/20 rounded-full h-2 overflow-hidden")}>
                                            <div
                                                className={cn("h-full transition-all", getProgressColor(percentage))}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    )}
                                    {isAtLimit && (
                                        <p className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            Limit reached - Upgrade to continue using this feature
                                        </p>
                                    )}
                                    {isNearLimit && !isAtLimit && (
                                        <p className="text-xs text-amber-400 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {metric.limit && metric.limit - metric.current} remaining this month
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade CTA for FREE users */}
            {userPlan === 'FREE' && hasLimitWarning && (
                <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <Crown className="h-5 w-5 text-amber-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">Unlock More with Professional</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get unlimited diagram uploads, 100 AI analyses per month, team collaboration, and priority support.
                                </p>
                                <Link href="/pricing">
                                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500">
                                        View Professional Plans
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
