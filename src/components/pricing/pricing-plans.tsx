"use client"

import { useState } from "react"
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
    Brain
} from "lucide-react"
import { cn } from "@/lib/utils"

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
        cta: "Current Plan",
        disabled: true,
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

export function PricingPlans({ currentPlan = "FREE" }: PricingPlansProps) {
    const [isYearly, setIsYearly] = useState(true)

    return (
        <div className="space-y-12">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    !isYearly ? "text-foreground" : "text-muted-foreground"
                )}>
                    Monthly
                </span>
                <Switch
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                    className="data-[state=checked]:bg-primary"
                />
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    isYearly ? "text-foreground" : "text-muted-foreground"
                )}>
                    Yearly
                </span>
                {isYearly && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
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
                                "relative border-white/10 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30",
                                plan.popular && "border-primary/50 shadow-lg shadow-primary/10 scale-105"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Price */}
                                <div className="text-center">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold tracking-tight">
                                            ${price}
                                        </span>
                                        <span className="text-muted-foreground">{billingPeriod}</span>
                                    </div>
                                    {isYearly && plan.price.monthly > 0 && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            ${Math.round(plan.price.yearly / 12)}/month billed annually
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                                            )}
                                            <span className={cn(
                                                "text-sm",
                                                feature.included ? "text-foreground" : "text-muted-foreground/50"
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
                                        "w-full",
                                        plan.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80",
                                        isCurrentPlan && "opacity-50 cursor-not-allowed"
                                    )}
                                    size="lg"
                                    disabled={isCurrentPlan || plan.disabled}
                                >
                                    {isCurrentPlan ? "Current Plan" : plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Feature Comparison */}
            <div className="mt-16 space-y-8">
                <h2 className="text-3xl font-bold text-center">Compare All Features</h2>

                <Card className="border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 font-medium">Feature</th>
                                    <th className="text-center p-4 font-medium">Free</th>
                                    <th className="text-center p-4 font-medium bg-primary/5">Professional</th>
                                    <th className="text-center p-4 font-medium">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 flex items-center gap-2">
                                        <Upload className="h-4 w-4 text-primary" />
                                        Diagram Uploads
                                    </td>
                                    <td className="text-center p-4">5/month</td>
                                    <td className="text-center p-4 bg-primary/5">Unlimited</td>
                                    <td className="text-center p-4">Unlimited</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-primary" />
                                        AI Analyses
                                    </td>
                                    <td className="text-center p-4">3/month</td>
                                    <td className="text-center p-4 bg-primary/5">100/month</td>
                                    <td className="text-center p-4">Unlimited</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        Diagnostic Chat
                                    </td>
                                    <td className="text-center p-4">Basic</td>
                                    <td className="text-center p-4 bg-primary/5">Advanced</td>
                                    <td className="text-center p-4">Custom AI</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-primary" />
                                        Team Members
                                    </td>
                                    <td className="text-center p-4">1</td>
                                    <td className="text-center p-4 bg-primary/5">5</td>
                                    <td className="text-center p-4">Unlimited</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        Export Formats
                                    </td>
                                    <td className="text-center p-4">—</td>
                                    <td className="text-center p-4 bg-primary/5">PDF, DXF</td>
                                    <td className="text-center p-4">All Formats</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="p-4 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" />
                                        Support Level
                                    </td>
                                    <td className="text-center p-4">Community</td>
                                    <td className="text-center p-4 bg-primary/5">Email</td>
                                    <td className="text-center p-4">24/7 Priority</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 text-center space-y-4">
                <p className="text-muted-foreground">Trusted by aviation, automotive, and marine technicians worldwide</p>
                <div className="flex items-center justify-center gap-8 text-muted-foreground/50">
                    <Shield className="h-8 w-8" />
                    <span className="text-sm">256-bit SSL Encryption</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">GDPR Compliant</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">30-Day Money Back Guarantee</span>
                </div>
            </div>
        </div>
    )
}
