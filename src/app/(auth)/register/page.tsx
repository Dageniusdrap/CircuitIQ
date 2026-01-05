import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
    title: "Register | CircuitIQ",
    description: "Create your CircuitIQ account",
}

export default function RegisterPage() {
    return (
        <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4">
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
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
                            Create your account
                        </h2>
                        <p className="text-slate-400">
                            Get started with CircuitIQ today
                        </p>
                    </div>
                </div>

                {/* Register Card */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    <RegisterForm />
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
