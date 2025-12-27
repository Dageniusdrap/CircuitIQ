"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Zap, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle, XCircle, Lock, Shield, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validatePasswordResetToken, resetPassword } from "@/lib/auth-utils";

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
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Password strength calculator
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
}

export default function ResetPasswordPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = params.token as string;
    const email = searchParams.get("email") || "";

    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = form.watch("password");
    const passwordStrength = getPasswordStrength(password);

    // Validate token on mount
    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setTokenError("Invalid reset link. Please request a new password reset.");
                setIsValidating(false);
                return;
            }

            try {
                const result = await validatePasswordResetToken(token);
                if (result.valid) {
                    setIsTokenValid(true);
                } else {
                    setTokenError(result.error || "This reset link has expired. Please request a new one.");
                }
            } catch {
                setTokenError("Failed to validate reset token. Please try again.");
            } finally {
                setIsValidating(false);
            }
        }

        validateToken();
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await resetPassword(token, data.password);

            if (result.success) {
                setIsSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login?reset=success");
                }, 3000);
            } else {
                setError(result.error || "Failed to reset password. Please try again.");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while validating token
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
                    <p className="text-slate-400">Validating reset link...</p>
                </div>
            </div>
        );
    }

    // Show error state for invalid token
    if (!isTokenValid || tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-4">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            CircuitIQ
                        </Link>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full bg-red-500/10 mb-4">
                                <AlertTriangle className="h-12 w-12 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Invalid or Expired Link</h1>
                            <p className="text-slate-400 mb-6">
                                {tokenError || "This password reset link is no longer valid."}
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                                    <Link href="/forgot-password">
                                        Request New Reset Link
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild className="w-full text-slate-400 hover:text-white">
                                    <Link href="/login" className="flex items-center justify-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show success state
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-4">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            CircuitIQ
                        </Link>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full bg-green-500/10 mb-4 animate-pulse">
                                <CheckCircle className="h-12 w-12 text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Password Reset Successfully!</h1>
                            <p className="text-slate-400 mb-6">
                                Your password has been updated. You can now sign in with your new password.
                            </p>
                            <p className="text-slate-500 text-sm mb-6">
                                Redirecting to login in a few seconds...
                            </p>
                            <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                                <Link href="/login">
                                    Sign In Now
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Password requirements checklist
    const requirements = [
        { met: password.length >= 8, label: "At least 8 characters" },
        { met: /[A-Z]/.test(password), label: "One uppercase letter" },
        { met: /[a-z]/.test(password), label: "One lowercase letter" },
        { met: /[0-9]/.test(password), label: "One number" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-4">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        CircuitIQ
                    </Link>
                </div>

                {/* Reset Password Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="inline-flex p-3 rounded-full bg-cyan-500/10 mb-4">
                            <Shield className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                        <p className="text-slate-400">
                            Choose a strong password to secure your account
                            {email && <span className="block text-slate-500 mt-1">for {email}</span>}
                        </p>
                    </div>

                    {error && (
                        <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                            <XCircle className="h-4 w-4 text-red-400" />
                            <AlertDescription className="text-red-400">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                    {...form.register("password")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
                            )}

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Password strength</span>
                                        <span className={`font-medium ${passwordStrength.label === "Weak" ? "text-red-400" :
                                                passwordStrength.label === "Good" ? "text-blue-400" : "text-green-400"
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                        />
                                    </div>

                                    {/* Requirements Checklist */}
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        {requirements.map((req, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                {req.met ? (
                                                    <Check className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-slate-500" />
                                                )}
                                                <span className={req.met ? "text-green-400" : "text-slate-500"}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                    {...form.register("confirmPassword")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {form.formState.errors.confirmPassword && (
                                <p className="text-red-400 text-sm">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || !form.formState.isValid}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-5 w-5" />
                                    Reset Password
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <p className="text-center text-slate-400 mt-6">
                        Remember your password?{" "}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
