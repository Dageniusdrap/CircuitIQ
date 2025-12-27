import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { RegisterForm } from "@/components/auth/register-form"


export const metadata: Metadata = {
    title: "Register | CircuitIQ",
    description: "Create a new account",
}

export default function RegisterPage() {
    return (
        <div className="dark min-h-screen bg-slate-950 flex items-center justify-center py-8">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]" />

            <div className="relative z-10 mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] px-4">
                {/* Logo and Header */}
                <div className="flex flex-col space-y-3 text-center">
                    <Link href="/" className="mx-auto flex flex-col items-center mb-2 group">
                        <div className="relative w-20 h-20 mb-3">
                            <Image
                                src="/logo.png"
                                alt="CircuitIQ"
                                fill
                                className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            CircuitIQ
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Create an account
                    </h1>
                    <p className="text-sm text-slate-400">
                        Enter your information to get started
                    </p>
                </div>

                {/* Register Form */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <RegisterForm />
                </div>

                {/* Footer */}
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
