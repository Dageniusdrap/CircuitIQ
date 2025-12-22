"use server"

import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { z } from "zod"

// Validation Schemas
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export async function login(values: z.infer<typeof loginSchema>) {
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        })

        return { success: "Logged in successfully!" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }

        throw error
    }
}

export async function register(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { name, email, password } = validatedFields.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "TECHNICIAN", // Default role
        },
    })

    return { success: "Registration successful! Please login." }
}

export async function logout() {
    await signOut({ redirectTo: "/login" })
}
