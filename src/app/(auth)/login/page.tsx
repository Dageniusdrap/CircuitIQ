import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"


export const metadata: Metadata = {
    title: "Login | CircuitIQ",
    description: "Login to your account",
}

export default function LoginPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="mx-auto flex flex-col items-center mb-4">
                        <div className="relative w-16 h-16 mb-2">
                            <Image
                                src="/logo.png"
                                alt="CircuitIQ"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to access your account
                    </p>
                </div>
                <LoginForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
