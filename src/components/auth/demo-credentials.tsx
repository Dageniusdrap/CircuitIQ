"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { User, Briefcase, Shield, Sparkles, ChevronDown, ChevronUp, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { showDemoLoginSuccess, showAuthError } from "@/lib/auth-toasts"

interface DemoAccount {
    id: string
    name: string
    email: string
    password: string
    plan: "FREE" | "PRO" | "ENTERPRISE"
    role: string
    icon: React.ReactNode
    gradient: string
    features: string[]
    description: string
}

const DEMO_ACCOUNTS: DemoAccount[] = [
    {
        id: "demo",
        name: "Demo User",
        email: "demo@circuitiq.com",
        password: "Demo123!",
        plan: "FREE",
        role: "Technician",
        icon: <User className="h-4 w-4" />,
        gradient: "from-slate-500 to-slate-600",
        features: ["3 Diagrams/month", "5 AI Queries/day", "Basic search"],
        description: "Perfect for exploring the platform",
    },
    {
        id: "pro",
        name: "Test Engineer",
        email: "test@circuitiq.com",
        password: "TestUser123!",
        plan: "PRO",
        role: "Engineer",
        icon: <Briefcase className="h-4 w-4" />,
        gradient: "from-blue-500 to-cyan-500",
        features: ["50 Diagrams/month", "Unlimited AI", "Priority support"],
        description: "Full professional features access",
    },
    {
        id: "enterprise",
        name: "Admin User",
        email: "admin@circuitiq.com",
        password: "Admin123!",
        plan: "ENTERPRISE",
        role: "Admin",
        icon: <Shield className="h-4 w-4" />,
        gradient: "from-amber-500 to-orange-500",
        features: ["Unlimited everything", "Team management", "Custom integrations"],
        description: "Complete enterprise capabilities",
    },
]

export function DemoCredentials() {
    const [loggingIn, setLoggingIn] = useState<string | null>(null)
    const [isExpanded, setIsExpanded] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleQuickLogin = async (account: DemoAccount) => {
        setLoggingIn(account.id)
        setError(null)
        setSuccess(null)

        try {
            const result = await signIn("credentials", {
                email: account.email,
                password: account.password,
                redirect: false,
            })

            if (result?.error) {
                let errorMessage = "Invalid credentials. Please try again."
                if (result.error === "CredentialsSignin") {
                    errorMessage = "Email or password is incorrect"
                }
                setError(errorMessage)
                showAuthError(errorMessage)
                setLoggingIn(null)
                return
            }

            if (result?.ok) {
                // Show success state before redirect
                setSuccess(account.name)
                showDemoLoginSuccess({
                    userName: account.name,
                    plan: account.plan,
                    role: account.role,
                })

                // Small delay to show success toast
                setTimeout(() => {
                    window.location.href = "/dashboard"
                }, 500)
            }
        } catch (err) {
            console.error("Login error:", err)
            const errorMessage = "An error occurred. Please try again."
            setError(errorMessage)
            showAuthError(errorMessage)
            setLoggingIn(null)
        }
    }

    return (
        <div className="mt-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center gap-2 w-full text-sm text-slate-400 hover:text-slate-300 transition-colors py-2"
            >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Quick Demo Access</span>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>

            {isExpanded && (
                <div className="mt-3 space-y-2">
                    <p className="text-xs text-center text-slate-500 mb-3">
                        Click any account to login instantly
                    </p>

                    {DEMO_ACCOUNTS.map((account) => (
                        <button
                            key={account.id}
                            onClick={() => handleQuickLogin(account)}
                            disabled={!!loggingIn || !!success}
                            className={cn(
                                "w-full p-3 rounded-xl border transition-all duration-300",
                                "bg-slate-800/50 border-slate-700/50 hover:border-slate-600",
                                "hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                "group relative overflow-hidden",
                                success === account.name && "border-emerald-500/50 bg-emerald-500/10"
                            )}
                        >
                            {/* Gradient overlay on hover */}
                            <div
                                className={cn(
                                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                                    `bg-gradient-to-r ${account.gradient}`
                                )}
                            />

                            <div className="relative flex items-center gap-3">
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "flex-shrink-0 p-2 rounded-lg",
                                        success === account.name
                                            ? "bg-emerald-500"
                                            : `bg-gradient-to-br ${account.gradient}`
                                    )}
                                >
                                    {success === account.name ? (
                                        <Check className="h-4 w-4 text-white" />
                                    ) : loggingIn === account.id ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        account.icon
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white">
                                            {account.name}
                                        </span>
                                        <span
                                            className={cn(
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                                account.plan === "FREE" && "bg-slate-600 text-slate-200",
                                                account.plan === "PRO" && "bg-blue-500/20 text-blue-400",
                                                account.plan === "ENTERPRISE" && "bg-amber-500/20 text-amber-400"
                                            )}
                                        >
                                            {account.plan}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {account.description}
                                    </p>
                                </div>

                                {/* Arrow or Success */}
                                <div className="flex-shrink-0 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                                    {success === account.name ? (
                                        <span className="text-emerald-400">✓</span>
                                    ) : (
                                        "→"
                                    )}
                                </div>
                            </div>

                            {/* Features preview */}
                            <div className="mt-2 flex flex-wrap gap-1">
                                {account.features.slice(0, 3).map((feature, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}

                    {/* Error state */}
                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-400 mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success state */}
                    {success && (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <Check className="h-4 w-4 flex-shrink-0" />
                            <span>Logging in as {success}... Redirecting to dashboard</span>
                        </div>
                    )}

                    <p className="text-[10px] text-center text-slate-600 mt-2">
                        These are test accounts with sample data
                    </p>
                </div>
            )}
        </div>
    )
}
