import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
    title: "Forgot Password | CircuitIQ",
    description: "Reset your CircuitIQ account password",
}

export default function ForgotPasswordPage() {
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
                            Reset your password
                        </h2>
                        <p className="text-slate-400">
                            We&apos;ll send you a link to reset your password
                        </p>
                    </div>
                </div>

                {/* Forgot Password Card */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    <ForgotPasswordForm />
                </div>

                {/* Footer Link */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}
