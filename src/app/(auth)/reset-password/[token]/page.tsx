"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import Image from "next/image"
import {
    Loader2,
    Eye,
    EyeOff,
    CheckCircle,
    AlertTriangle,
    Check,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validatePasswordResetToken, resetPassword } from "@/lib/auth-utils"
import { cn } from "@/lib/utils"

const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface PasswordStrength {
    score: number
    label: string
    color: string
}

function getPasswordStrength(password: string): PasswordStrength {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" }
    if (score <= 4) return { score, label: "Good", color: "bg-blue-500" }
    return { score, label: "Strong", color: "bg-emerald-500" }
}

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [isValidating, setIsValidating] = useState(true)
    const [isTokenValid, setIsTokenValid] = useState(false)
    const [tokenError, setTokenError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const password = watch("password", "")
    const passwordStrength = getPasswordStrength(password)

    const passwordChecks = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Number", valid: /[0-9]/.test(password) },
    ]

    // Validate token on mount
    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setTokenError("Invalid reset link")
                setIsValidating(false)
                return
            }

            try {
                const result = await validatePasswordResetToken(token)
                if (result.valid) {
                    setIsTokenValid(true)
                } else {
                    setTokenError(result.error || "This reset link has expired")
                }
            } catch {
                setTokenError("Failed to validate reset token")
            } finally {
                setIsValidating(false)
            }
        }

        validateToken()
    }, [token])

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await resetPassword(token, data.password)

            if (result.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push("/login?reset=success")
                }, 3000)
            } else {
                setError(result.error || "Failed to reset password")
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    // Loading state
    if (isValidating) {
        return (
            <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-slate-400">Validating reset link...</p>
                </div>
            </div>
        )
    }

    // Invalid token state
    if (!isTokenValid || tokenError) {
        return (
            <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-md space-y-8">
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex flex-col items-center group">
                            <div className="relative w-16 h-16 mb-3">
                                <Image
                                    src="/logo.png"
                                    alt="CircuitIQ"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                CircuitIQ
                            </h1>
                        </Link>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-red-400" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    Invalid Reset Link
                                </h2>
                                <p className="text-slate-400">
                                    {tokenError || "This password reset link is no longer valid"}
                                </p>
                            </div>
                            <div className="space-y-3 pt-4">
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                >
                                    <Link href="/forgot-password">
                                        Request New Reset Link
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild className="w-full text-slate-400 hover:text-white">
                                    <Link href="/login">
                                        Back to Login
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative z-10 w-full max-w-md space-y-8">
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex flex-col items-center group">
                            <div className="relative w-16 h-16 mb-3">
                                <Image
                                    src="/logo.png"
                                    alt="CircuitIQ"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                CircuitIQ
                            </h1>
                        </Link>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    Password Reset!
                                </h2>
                                <p className="text-slate-400">
                                    Your password has been successfully updated
                                </p>
                                <p className="text-sm text-slate-500">
                                    Redirecting to login...
                                </p>
                            </div>
                            <Button
                                asChild
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mt-6"
                            >
                                <Link href="/login">
                                    Sign In Now
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Reset password form
    return (
        <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4">
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="relative z-10 w-full max-w-md space-y-8">
                {/* Logo and Header */}
                <div className="text-center space-y-3">
                    <Link href="/" className="inline-flex flex-col items-center group">
                        <div className="relative w-16 h-16 mb-3">
                            <Image
                                src="/logo.png"
                                alt="CircuitIQ"
                                fill
                                className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            CircuitIQ
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-white">
                            Create New Password
                        </h2>
                        <p className="text-slate-400">
                            Choose a strong password to secure your account
                        </p>
                    </div>
                </div>

                {/* Reset Password Card */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="bg-slate-800/50 border-slate-700 pr-10"
                                    {...register("password")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Password strength</span>
                                        <span className={cn(
                                            "font-medium",
                                            passwordStrength.color.replace("bg-", "text-")
                                        )}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all", passwordStrength.color)}
                                            style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                        />
                                    </div>

                                    {/* Requirements Checklist */}
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        {passwordChecks.map((check, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-xs">
                                                {check.valid ? (
                                                    <Check className="h-3 w-3 text-emerald-400" />
                                                ) : (
                                                    <X className="h-3 w-3 text-slate-500" />
                                                )}
                                                <span className={check.valid ? "text-emerald-400" : "text-slate-500"}>
                                                    {check.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="bg-slate-800/50 border-slate-700 pr-10"
                                    {...register("confirmPassword")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Resetting Password..." : "Reset Password"}
                        </Button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="text-center mt-6">
                        <Link
                            href="/login"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Remember your password? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
