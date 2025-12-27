"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, CheckCircle, AlertTriangle, Clock, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { showDemoLoginSuccess, showAuthError, showRateLimitWarning } from "@/lib/auth-toasts"
import { checkRateLimit, recordLoginAttempt } from "@/lib/auth-utils"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
    const [isLocked, setIsLocked] = useState(false)
    const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number>(0)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: true,
        },
    })

    const emailValue = watch("email")

    // Countdown timer for lockout
    useEffect(() => {
        if (lockoutTimeRemaining > 0) {
            const timer = setInterval(() => {
                setLockoutTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsLocked(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [lockoutTimeRemaining])

    const formatLockoutTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const onSubmit = (values: LoginFormValues) => {
        setError("")
        setSuccess(false)

        startTransition(async () => {
            try {
                // Check rate limit before attempting login
                const rateLimitCheck = await checkRateLimit(values.email.toLowerCase())

                if (!rateLimitCheck.allowed) {
                    const resetTime = rateLimitCheck.resetTime
                        ? Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)
                        : 900 // 15 minutes default
                    setIsLocked(true)
                    setLockoutTimeRemaining(resetTime)
                    setError("Too many login attempts. Please try again later.")
                    showRateLimitWarning(0)
                    return
                }

                setRemainingAttempts(rateLimitCheck.remainingAttempts)

                const result = await signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                })

                if (result?.error) {
                    // Record failed attempt
                    await recordLoginAttempt(values.email.toLowerCase(), false)

                    // Get updated rate limit status
                    const updatedRateLimit = await checkRateLimit(values.email.toLowerCase())
                    setRemainingAttempts(updatedRateLimit.remainingAttempts)

                    let errorMessage = "Invalid credentials. Please try again."

                    // More specific error messages
                    if (result.error === "CredentialsSignin") {
                        errorMessage = "The email or password you entered is incorrect"
                    } else if (result.error === "AccessDenied") {
                        errorMessage = "Your account has been suspended. Please contact support."
                    } else if (result.error === "Verification") {
                        errorMessage = "Please verify your email before logging in"
                    } else if (result.error === "RateLimited") {
                        errorMessage = "Too many attempts. Please wait before trying again."
                    }

                    setError(errorMessage)
                    showAuthError(errorMessage)

                    // Show warning if running low on attempts
                    if (updatedRateLimit.remainingAttempts <= 2 && updatedRateLimit.remainingAttempts > 0) {
                        showRateLimitWarning(updatedRateLimit.remainingAttempts)
                    }

                    return
                }

                if (result?.ok) {
                    // Record successful login
                    await recordLoginAttempt(values.email.toLowerCase(), true)

                    setSuccess(true)
                    showDemoLoginSuccess({ userName: "User" })

                    // Redirect to dashboard after short delay
                    setTimeout(() => {
                        window.location.href = "/dashboard"
                    }, 500)
                }
            } catch (err) {
                console.error("Login error:", err)
                const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
                setError(message)
                showAuthError(message)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        disabled={isPending || success}
                        className="bg-slate-800/50 border-slate-700"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isPending || success}
                            className="bg-slate-800/50 border-slate-700 pr-10"
                            {...register("password")}
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
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        {...register("rememberMe")}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-800/50 text-blue-500 focus:ring-blue-500"
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer">
                        Remember me for 30 days
                    </Label>
                </div>
            </div>

            {/* Lockout Warning */}
            {isLocked && lockoutTimeRemaining > 0 && (
                <Alert className="bg-red-500/10 border-red-500/20">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-400">
                        <div className="flex items-center justify-between">
                            <span>Account temporarily locked</span>
                            <span className="flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {formatLockoutTime(lockoutTimeRemaining)}
                            </span>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Remaining Attempts Warning */}
            {!isLocked && remainingAttempts !== null && remainingAttempts <= 3 && remainingAttempts > 0 && (
                <Alert className="bg-amber-500/10 border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-400">
                        {remainingAttempts} login {remainingAttempts === 1 ? "attempt" : "attempts"} remaining before lockout
                    </AlertDescription>
                </Alert>
            )}

            {error && !isLocked && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Login successful! Redirecting...</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                disabled={isPending || success || isLocked}
            >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {success && <CheckCircle className="mr-2 h-4 w-4" />}
                {isLocked && <ShieldAlert className="mr-2 h-4 w-4" />}
                {isLocked
                    ? `Locked (${formatLockoutTime(lockoutTimeRemaining)})`
                    : success
                        ? "Success!"
                        : "Sign In"}
            </Button>
        </form>
    )
}
