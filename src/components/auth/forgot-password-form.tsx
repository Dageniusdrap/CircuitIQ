"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { generatePasswordResetToken } from "@/lib/auth-utils"

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState(false)
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const email = watch("email", "")

    const onSubmit = (values: ForgotPasswordFormValues) => {
        setError("")
        setSuccess(false)

        startTransition(async () => {
            try {
                const result = await generatePasswordResetToken(values.email)

                if (result.success) {
                    setSuccess(true)
                } else {
                    setError(result.error || "Failed to send reset email")
                }
            } catch {
                setError("Something went wrong. Please try again.")
            }
        })
    }

    if (success) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Check your email</h3>
                    <p className="text-slate-400 text-sm">
                        We&apos;ve sent password reset instructions to{" "}
                        <span className="text-white font-medium">{email}</span>
                    </p>
                    <p className="text-slate-500 text-xs pt-2">
                        Please check your inbox and follow the link to reset your password.
                        The link will expire in 1 hour.
                    </p>
                </div>
                <div className="space-y-3 pt-4">
                    <p className="text-slate-500 text-sm">Didn&apos;t receive the email?</p>
                    <Button
                        onClick={() => setSuccess(false)}
                        variant="outline"
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        Send Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-400" />
                    </div>
                </div>
                <p className="text-slate-400 text-sm">
                    Enter your email address and we&apos;ll send you instructions to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        disabled={isPending}
                        {...register("email")}
                        className="bg-slate-800/50 border-slate-700"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    disabled={isPending}
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>

            <div className="text-center text-sm text-slate-500">
                <p>Remember your password?{" "}
                    <Link
                        href="/login"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
