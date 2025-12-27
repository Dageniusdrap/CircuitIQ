"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Check,
    X,
    Zap,
    Building2,
    Rocket,
    Sparkles,
    Shield,
    Users,
    FileText,
    MessageSquare,
    Upload,
    Brain,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PricingPlansProps {
    currentPlan?: string
}

const PLANS = [
    {
        id: "FREE",
        name: "Free",
        description: "Perfect for getting started and exploring",
        price: { monthly: 0, yearly: 0 },
        icon: Zap,
        popular: false,
        features: [
            { name: "5 diagram uploads/month", included: true },
            { name: "3 AI analyses/month", included: true },
            { name: "Basic diagnostic chat", included: true },
            { name: "Community support", included: true },
            { name: "Procedure library access", included: true },
            { name: "PDF export", included: false },
            { name: "Priority AI processing", included: false },
            { name: "Team collaboration", included: false },
            { name: "API access", included: false },
            { name: "White-labeling", included: false },
        ],
        cta: "Get Started Free",
        disabled: false,
    },
    {
        id: "PROFESSIONAL",
        name: "Professional",
        description: "For individual technicians and small shops",
        price: { monthly: 49, yearly: 490 },
        icon: Rocket,
        popular: true,
        features: [
            { name: "Unlimited diagram uploads", included: true },
            { name: "100 AI analyses/month", included: true },
            { name: "Advanced diagnostic chat", included: true },
            { name: "Email support", included: true },
            { name: "Full procedure library", included: true },
            { name: "PDF & DXF export", included: true },
            { name: "Priority AI processing", included: true },
            { name: "5 team members", included: true },
            { name: "API access", included: false },
            { name: "White-labeling", included: false },
        ],
        cta: "Upgrade to Pro",
        disabled: false,
    },
    {
        id: "ENTERPRISE",
        name: "Enterprise",
        description: "For large organizations and MROs",
        price: { monthly: 199, yearly: 1990 },
        icon: Building2,
        popular: false,
        features: [
            { name: "Unlimited everything", included: true },
            { name: "Unlimited AI analyses", included: true },
            { name: "Custom AI training", included: true },
            { name: "24/7 priority support", included: true },
            { name: "Custom procedures", included: true },
            { name: "All export formats", included: true },
            { name: "Fastest AI processing", included: true },
            { name: "Unlimited team members", included: true },
            { name: "Full API access", included: true },
            { name: "White-labeling available", included: true },
        ],
        cta: "Contact Sales",
        disabled: false,
    },
]

export function PricingPlans({ currentPlan }: PricingPlansProps) {
    const [isYearly, setIsYearly] = useState(true)
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const router = useRouter()

    const handleSubscribe = async (planId: string) => {
        if (planId === "FREE") {
            // For free plan, redirect to register
            router.push("/register")
            return
        }

        if (planId === "ENTERPRISE") {
            // For enterprise, redirect to contact page
            router.push("/contact?subject=Enterprise Plan Inquiry")
            return
        }

        setLoadingPlan(planId)

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    plan: planId,
                    isYearly,
                }),
            })

            const data = await response.json()

            if (data.error) {
                if (data.error === "Unauthorized") {
                    toast.error("Please sign in to subscribe")
                    router.push("/login?redirect=/pricing")
                    return
                }
                // Handle Stripe not configured error gracefully
                if (data.error === "Stripe is not configured") {
                    toast.info("Payment system is being configured. Please try again later.")
                    return
                }
                // Show other errors as toast instead of throwing
                toast.error(data.error)
                return
            }

            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error("Checkout error:", error)
            toast.error("Failed to start checkout. Please try again.")
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div className="space-y-12">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    !isYearly ? "text-white" : "text-slate-400"
                )}>
                    Monthly
                </span>
                <Switch
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                    className="data-[state=checked]:bg-amber-500"
                />
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    isYearly ? "text-white" : "text-slate-400"
                )}>
                    Yearly
                </span>
                {isYearly && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        Save 17%
                    </Badge>
                )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => {
                    const Icon = plan.icon
                    const isCurrentPlan = currentPlan === plan.id
                    const price = isYearly ? plan.price.yearly : plan.price.monthly
                    const billingPeriod = isYearly ? "/year" : "/month"

                    return (
                        <Card
                            key={plan.id}
                            className={cn(
                                "relative border-slate-700/50 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50",
                                plan.popular && "border-amber-500/50 shadow-xl shadow-amber-500/10 scale-105 bg-slate-900/80"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className={cn(
                                    "mx-auto mb-4 p-3 rounded-2xl w-fit",
                                    plan.popular ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" : "bg-slate-800/50"
                                )}>
                                    <Icon className={cn("h-8 w-8", plan.popular ? "text-amber-400" : "text-slate-300")} />
                                </div>
                                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                                <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Price */}
                                <div className="text-center">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold tracking-tight text-white">
                                            ${price}
                                        </span>
                                        <span className="text-slate-400">{billingPeriod}</span>
                                    </div>
                                    {isYearly && plan.price.monthly > 0 && (
                                        <p className="text-sm text-slate-500 mt-1">
                                            ${Math.round(plan.price.yearly / 12)}/month billed annually
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
                                            )}
                                            <span className={cn(
                                                "text-sm",
                                                feature.included ? "text-slate-200" : "text-slate-600"
                                            )}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className={cn(
                                        "w-full font-semibold",
                                        plan.popular
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25"
                                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
                                        isCurrentPlan && "opacity-50 cursor-not-allowed"
                                    )}
                                    size="lg"
                                    disabled={isCurrentPlan || plan.disabled || loadingPlan === plan.id}
                                    onClick={() => handleSubscribe(plan.id)}
                                >
                                    {loadingPlan === plan.id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : isCurrentPlan ? (
                                        "Current Plan"
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Feature Comparison */}
            <div className="mt-16 space-y-8">
                <h2 className="text-3xl font-bold text-center text-white">Compare All Features</h2>

                <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="text-left p-4 font-semibold text-white">Feature</th>
                                    <th className="text-center p-4 font-semibold text-slate-300">Free</th>
                                    <th className="text-center p-4 font-semibold text-amber-400 bg-amber-500/5">Professional</th>
                                    <th className="text-center p-4 font-semibold text-slate-300">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-800/50">
                                    <td className="p-4 flex items-center gap-2 text-slate-200">
                                        <Upload className="h-4 w-4 text-amber-400" />
                                        Diagram Uploads
                                    </td>
                                    <td className="text-center p-4 text-slate-400">5/month</td>
                                    <td className="text-center p-4 bg-amber-500/5 text-white font-medium">Unlimited</td>
                                    <td className="text-center p-4 text-slate-300">Unlimited</td>
                                </tr>
                                <tr className="border-b border-slate-800/50">
                                    <td className="p-4 flex items-center gap-2 text-slate-200">
                                        <Brain className="h-4 w-4 text-amber-400" />
                                        AI Analyses
                                    </td>
                                    <td className="text-center p-4 text-slate-400">3/month</td>
                                    <td className="text-center p-4 bg-amber-500/5 text-white font-medium">100/month</td>
                                    <td className="text-center p-4 text-slate-300">Unlimited</td>
                                </tr>
                                <tr className="border-b border-slate-800/50">
                                    <td className="p-4 flex items-center gap-2 text-slate-200">
                                        <MessageSquare className="h-4 w-4 text-amber-400" />
                                        Diagnostic Chat
                                    </td>
                                    <td className="text-center p-4 text-slate-400">Basic</td>
                                    <td className="text-center p-4 bg-amber-500/5 text-white font-medium">Advanced</td>
                                    <td className="text-center p-4 text-slate-300">Custom AI</td>
                                </tr>
                                <tr className="border-b border-slate-800/50">
                                    <td className="p-4 flex items-center gap-2 text-slate-200">
                                        <Users className="h-4 w-4 text-amber-400" />
                                        Team Members
                                    </td>
                                    <td className="text-center p-4 text-slate-400">1</td>
                                    <td className="text-center p-4 bg-amber-500/5 text-white font-medium">5</td>
                                    <td className="text-center p-4 text-slate-300">Unlimited</td>
                                </tr>
                                <tr className="border-b border-slate-800/50">
                                    <td className="p-4 flex items-center gap-2 text-slate-200">
                                        <FileText className="h-4 w-4 text-amber-400" />
                                        Export Formats
                                    </td>
                                    <td className="text-center p-4 text-slate-500">—</td>
                                    <td className="text-center p-4 bg-amber-500/5 text-white font-medium">PDF, DXF</td>
                                    <td className="text-center p-4 text-slate-300">All Formats</td>
                                </tr>
                                <tr className="border-b border-slate-800/50">
                                    <td className="p-4 flex items-center gap-2 text-slate-200">
                                        <Shield className="h-4 w-4 text-amber-400" />
                                        Support Level
                                    </td>
                                    <td className="text-center p-4 text-slate-400">Community</td>
                                    <td className="text-center p-4 bg-amber-500/5 text-white font-medium">Email</td>
                                    <td className="text-center p-4 text-slate-300">24/7 Priority</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 text-center space-y-4">
                <p className="text-slate-400">Trusted by aviation, automotive, and marine technicians worldwide</p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-500">
                    <Shield className="h-8 w-8 text-slate-600" />
                    <span className="text-sm text-slate-400">256-bit SSL Encryption</span>
                    <span className="text-sm text-slate-600 hidden md:inline">•</span>
                    <span className="text-sm text-emerald-500 font-medium">GDPR Compliant</span>
                    <span className="text-sm text-slate-600 hidden md:inline">•</span>
                    <span className="text-sm text-amber-500 font-medium">30-Day Money Back Guarantee</span>
                </div>
            </div>
        </div>
    )
}
