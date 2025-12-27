"use client"

import { toast } from "sonner"
import { CheckCircle, AlertCircle, Shield, User, Bell } from "lucide-react"

interface AuthToastOptions {
    userName?: string
    plan?: string
    role?: string
}

/**
 * Show success toast when demo user logs in
 */
export function showDemoLoginSuccess(options: AuthToastOptions = {}) {
    const { userName = "Demo User", plan = "FREE", role = "User" } = options

    toast.success(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">Welcome, {userName}!</span>
            </div>
            <p className="text-xs text-muted-foreground">
                Logged in as {role} • {plan} Plan
            </p>
        </div>,
        {
            duration: 4000,
            position: "top-right",
        }
    )
}

/**
 * Show error toast for auth failures
 */
export function showAuthError(error: string) {
    toast.error(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="font-semibold">Authentication Failed</span>
            </div>
            <p className="text-xs text-muted-foreground">{error}</p>
        </div>,
        {
            duration: 5000,
            position: "top-right",
        }
    )
}

/**
 * Show rate limit warning
 */
export function showRateLimitWarning(attemptsRemaining: number) {
    toast.warning(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span className="font-semibold">Too Many Attempts</span>
            </div>
            <p className="text-xs text-muted-foreground">
                {attemptsRemaining} attempts remaining before temporary lockout
            </p>
        </div>,
        {
            duration: 5000,
            position: "top-right",
        }
    )
}

/**
 * Show session expiry notification
 */
export function showSessionExpiring(minutesRemaining: number) {
    toast.info(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Session Expiring</span>
            </div>
            <p className="text-xs text-muted-foreground">
                Your session will expire in {minutesRemaining} minutes
            </p>
        </div>,
        {
            duration: 10000,
            position: "top-right",
            action: {
                label: "Refresh",
                onClick: () => {
                    // Trigger session refresh
                    window.location.reload()
                },
            },
        }
    )
}

/**
 * Show password reset success
 */
export function showPasswordResetSent() {
    toast.success(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">Reset Link Sent</span>
            </div>
            <p className="text-xs text-muted-foreground">
                Check your email for password reset instructions
            </p>
        </div>,
        {
            duration: 6000,
            position: "top-right",
        }
    )
}

/**
 * Show email verification success
 */
export function showEmailVerified() {
    toast.success(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">Email Verified</span>
            </div>
            <p className="text-xs text-muted-foreground">
                Your email has been successfully verified
            </p>
        </div>,
        {
            duration: 5000,
            position: "top-right",
        }
    )
}

/**
 * Show logout success
 */
export function showLogoutSuccess() {
    toast.success(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">Signed Out</span>
            </div>
            <p className="text-xs text-muted-foreground">
                You have been successfully logged out
            </p>
        </div>,
        {
            duration: 3000,
            position: "top-right",
        }
    )
}

/**
 * Show upgrade prompt
 */
export function showUpgradePrompt(feature: string, requiredPlan: string) {
    toast.info(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Upgrade Required</span>
            </div>
            <p className="text-xs text-muted-foreground">
                {feature} requires a {requiredPlan} plan
            </p>
        </div>,
        {
            duration: 5000,
            position: "top-right",
            action: {
                label: "Upgrade",
                onClick: () => {
                    window.location.href = "/pricing?upgrade=true"
                },
            },
        }
    )
}

/**
 * Show 2FA enabled success
 */
export function show2FAEnabled() {
    toast.success(
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">Two-Factor Enabled</span>
            </div>
            <p className="text-xs text-muted-foreground">
                Your account is now more secure
            </p>
        </div>,
        {
            duration: 5000,
            position: "top-right",
        }
    )
}
