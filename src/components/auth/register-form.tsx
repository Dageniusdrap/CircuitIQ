"use client"

import { useState, useTransition, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { register as registerAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Check, X, CheckCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

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
    if (score <= 4) return { score, label: "Fair", color: "bg-amber-500" }
    if (score <= 5) return { score, label: "Good", color: "bg-blue-500" }
    return { score, label: "Strong", color: "bg-emerald-500" }
}

export function RegisterForm() {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            acceptTerms: false,
        },
    })

    const password = watch("password", "")
    const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

    const passwordChecks = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Contains number", valid: /[0-9]/.test(password) },
    ]

    const onSubmit = (values: RegisterFormValues) => {
        setError("")
        setSuccess(false)

        startTransition(() => {
            registerAction(values)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error)
                    }
                    if (data?.success) {
                        setSuccess(true)
                        toast.success("Account created! Please check your email to verify your account.")
                    }
                })
                .catch(() => setError("Something went wrong!"))
        })
    }

    if (success) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Account Created!</h2>
                    <p className="text-slate-400 text-sm">
                        Your account has been created successfully.
                        You can now sign in to access your dashboard.
                    </p>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Link href="/login">
                        Sign In to Your Account
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        disabled={isPending}
                        className="bg-slate-800/50 border-slate-700"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        disabled={isPending}
                        className="bg-slate-800/50 border-slate-700"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isPending}
                            className="bg-slate-800/50 border-slate-700 pr-10"
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all", passwordStrength.color)}
                                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                    />
                                </div>
                                <span className={cn(
                                    "text-xs font-medium",
                                    passwordStrength.color.replace("bg-", "text-")
                                )}>
                                    {passwordStrength.label}
                                </span>
                            </div>

                            {/* Password Requirements Checklist */}
                            <div className="grid grid-cols-2 gap-1">
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

                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isPending}
                            className="bg-slate-800/50 border-slate-700 pr-10"
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Terms Acceptance */}
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            {...register("acceptTerms")}
                            className="h-4 w-4 mt-0.5 rounded border-slate-700 bg-slate-800/50 text-blue-500 focus:ring-blue-500"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm text-slate-400 cursor-pointer leading-tight">
                            I agree to the{" "}
                            <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                                Terms of Service
                            </Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                                Privacy Policy
                            </Link>
                        </Label>
                    </div>
                    {errors.acceptTerms && (
                        <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
                    )}
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                disabled={isPending}
            >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>

            <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
