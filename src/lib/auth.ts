import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { UserRole, SubscriptionPlan } from "@prisma/client"
import { authConfig } from "./auth.config"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: UserRole
            plan: SubscriptionPlan
        } & DefaultSession["user"]
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        // Google and GitHub OAuth temporarily disabled until credentials are configured
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        //     allowDangerousEmailAccountLinking: true,
        // }),
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID!,
        //     clientSecret: process.env.GITHUB_SECRET!,
        //     allowDangerousEmailAccountLinking: true,
        // }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                })

                if (!user || !user.password) {
                    throw new Error("Invalid credentials")
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    plan: user.plan,
                    image: user.image,
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            if (token.plan && session.user) {
                session.user.plan = token.plan as SubscriptionPlan
            }

            return session
        },
        async jwt({ token, user, trigger }) {
            // When user signs in, add role and plan to token
            // This happens on initial sign-in, not on every request
            if (user) {
                // User is available on sign-in
                token.role = (user as { role?: UserRole }).role || "TECHNICIAN"
                token.plan = (user as { plan?: SubscriptionPlan }).plan || "FREE"
            }

            // Handle token refresh if needed (e.g., when user updates their profile)
            // This is called on session access, but we don't query DB every time
            if (trigger === "update") {
                // Token refresh is triggered manually, e.g., after plan upgrade
                // We can skip DB queries here in Edge runtime
            }

            return token
        },
    },
})
