import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Forgot Password | CircuitIQ",
    description: "Reset your CircuitIQ account password",
}

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Circuit<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">IQ</span>
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    )
}
