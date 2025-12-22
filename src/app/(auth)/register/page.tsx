import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Register | CircuitIQ",
    description: "Create a new account",
}

export default function RegisterPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mb-4">
                        <Zap size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your information to get started
                    </p>
                </div>
                <RegisterForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
