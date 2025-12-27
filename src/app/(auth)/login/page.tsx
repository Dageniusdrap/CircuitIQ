import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"
import { DemoCredentials } from "@/components/auth/demo-credentials"


export const metadata: Metadata = {
    title: "Login | CircuitIQ",
    description: "Login to your account",
}

export default function LoginPage() {
    return (
        <div className="dark min-h-screen bg-slate-950 flex items-center justify-center py-8">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)]" />

            <div className="relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px] px-4">
                {/* Logo and Header */}
                <div className="flex flex-col space-y-3 text-center">
                    <Link href="/" className="mx-auto flex flex-col items-center mb-2 group">
                        <div className="relative w-16 h-16 mb-2">
                            <Image
                                src="/logo.png"
                                alt="CircuitIQ"
                                fill
                                className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            CircuitIQ
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-400">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <LoginForm />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900/60 px-2 text-slate-500">or try demo</span>
                        </div>
                    </div>

                    {/* Demo Credentials */}
                    <DemoCredentials />
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
