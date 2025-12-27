"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, CheckCircle, XCircle, Mail, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail, generateVerificationToken } from "@/lib/auth-utils";
import { showEmailVerified, showAuthError } from "@/lib/auth-toasts";

export default function VerifyEmailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const token = params.token as string;
    const email = searchParams.get("email") || "";

    const [isVerifying, setIsVerifying] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Verify email on mount
    useEffect(() => {
        async function verify() {
            if (!token) {
                setError("Invalid verification link. Please request a new one.");
                setIsVerifying(false);
                return;
            }

            try {
                const result = await verifyEmail(token);
                if (result.success) {
                    setIsVerified(true);
                    showEmailVerified();
                } else {
                    setError(result.error || "Verification failed. The link may have expired.");
                }
            } catch {
                setError("Failed to verify email. Please try again.");
            } finally {
                setIsVerifying(false);
            }
        }

        verify();
    }, [token]);

    const handleResendVerification = async () => {
        if (!email) {
            showAuthError("Email address is required to resend verification.");
            return;
        }

        setIsResending(true);
        try {
            // generateVerificationToken returns the token string on success, throws on error
            await generateVerificationToken(email);
            setResendSuccess(true);
        } catch {
            showAuthError("Failed to resend verification email.");
        } finally {
            setIsResending(false);
        }
    };

    // Show loading state while verifying
    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
                    <p className="text-slate-400">Verifying your email...</p>
                </div>
            </div>
        );
    }

    // Show success state
    if (isVerified) {
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
                            {/* Success Animation */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
                                <div className="relative p-4 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-green-400/30">
                                    <CheckCircle className="h-12 w-12 text-green-400" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">Email Verified! 🎉</h1>
                            <p className="text-slate-400 mb-8">
                                Your email has been successfully verified. You now have full access to all features.
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                                    <Link href="/dashboard" className="flex items-center justify-center gap-2">
                                        Go to Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild className="w-full text-slate-400 hover:text-white">
                                    <Link href="/login">
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Features Unlocked */}
                    <div className="mt-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4">
                        <p className="text-sm text-center text-slate-400 mb-3">Features now unlocked:</p>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="text-sm">
                                <div className="text-cyan-400 font-semibold">Upload</div>
                                <div className="text-slate-500 text-xs">Diagrams</div>
                            </div>
                            <div className="text-sm">
                                <div className="text-cyan-400 font-semibold">AI Analysis</div>
                                <div className="text-slate-500 text-xs">Unlimited</div>
                            </div>
                            <div className="text-sm">
                                <div className="text-cyan-400 font-semibold">Export</div>
                                <div className="text-slate-500 text-xs">Reports</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
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
                    {resendSuccess ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full bg-green-500/10 mb-4">
                                <Mail className="h-12 w-12 text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Verification Email Sent!</h1>
                            <p className="text-slate-400 mb-6">
                                We&apos;ve sent a new verification link to <span className="text-cyan-400">{email}</span>.
                                Please check your inbox and spam folder.
                            </p>
                            <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
                                <Link href="/login">
                                    Back to Login
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full bg-red-500/10 mb-4">
                                {error?.includes("expired") ? (
                                    <AlertTriangle className="h-12 w-12 text-amber-400" />
                                ) : (
                                    <XCircle className="h-12 w-12 text-red-400" />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                {error?.includes("expired") ? "Link Expired" : "Verification Failed"}
                            </h1>
                            <p className="text-slate-400 mb-6">
                                {error || "This verification link is no longer valid."}
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                {email && (
                                    <Button
                                        onClick={handleResendVerification}
                                        disabled={isResending}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                    >
                                        {isResending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Resend Verification Email
                                            </>
                                        )}
                                    </Button>
                                )}
                                <Button variant="ghost" asChild className="w-full text-slate-400 hover:text-white">
                                    <Link href="/login">
                                        Back to Login
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
