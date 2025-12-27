"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"

// Rate limiting store (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

/**
 * Rate limiting for login attempts
 */
export async function checkRateLimit(identifier: string): Promise<{
    allowed: boolean
    remainingAttempts: number
    resetTime?: number
}> {
    const now = Date.now()
    const attempts = loginAttempts.get(identifier)

    if (!attempts) {
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
    }

    // Reset if window expired
    if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.delete(identifier)
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
    }

    if (attempts.count >= MAX_ATTEMPTS) {
        const resetTime = attempts.lastAttempt + RATE_LIMIT_WINDOW
        return {
            allowed: false,
            remainingAttempts: 0,
            resetTime
        }
    }

    return {
        allowed: true,
        remainingAttempts: MAX_ATTEMPTS - attempts.count
    }
}

export async function recordLoginAttempt(identifier: string, success: boolean) {
    if (success) {
        loginAttempts.delete(identifier)
        return
    }

    //     const attempts = loginAttempts.get(identifier)
    //     if (attempts) {
    //         attempts.count += 1
    //         attempts.lastAttempt = Date.now()
    //     } else {
    //         loginAttempts.set(identifier, { count: 1, lastAttempt: Date.now() })
    //     }
}

/**
 * Generate a secure password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<{
    success: boolean
    error?: string
}> {
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    })

    // Don't reveal if email exists
    if (!user) {
        return { success: true } // Pretend it worked for security
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token in database (we'll create a PasswordResetToken model)
    try {
        await prisma.passwordResetToken.upsert({
            where: { email: email.toLowerCase() },
            update: { token, expires },
            create: { email: email.toLowerCase(), token, expires }
        })

        // In production, send email here
        console.log(`Password reset token for ${email}: ${token}`)

        return { success: true }
    } catch {
        return { success: false, error: "Failed to generate reset token" }
    }
}

/**
 * Validate password reset token
 */
export async function validatePasswordResetToken(token: string): Promise<{
    valid: boolean
    email?: string
    error?: string
}> {
    try {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        })

        if (!resetToken) {
            return { valid: false, error: "Invalid reset token" }
        }

        if (resetToken.expires < new Date()) {
            await prisma.passwordResetToken.delete({ where: { token } })
            return { valid: false, error: "Reset token has expired" }
        }

        return { valid: true, email: resetToken.email }
    } catch {
        return { valid: false, error: "Failed to validate token" }
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(
    token: string,
    newPassword: string
): Promise<{ success: boolean; error?: string }> {
    const validation = await validatePasswordResetToken(token)

    if (!validation.valid || !validation.email) {
        return { success: false, error: validation.error || "Invalid token" }
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { email: validation.email },
            data: { password: hashedPassword }
        })

        // Delete the used token
        await prisma.passwordResetToken.delete({ where: { token } })

        return { success: true }
    } catch {
        return { success: false, error: "Failed to reset password" }
    }
}

/**
 * Generate email verification token
 */
export async function generateVerificationToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    try {
        // Delete any existing tokens for this email first
        await prisma.verificationToken.deleteMany({
            where: { identifier: email.toLowerCase() }
        })

        // Create new token
        await prisma.verificationToken.create({
            data: { identifier: email.toLowerCase(), token, expires }
        })
        return token
    } catch {
        throw new Error("Failed to generate verification token")
    }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!verificationToken) {
            return { success: false, error: "Invalid verification token" }
        }

        if (verificationToken.expires < new Date()) {
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: verificationToken.identifier,
                        token: verificationToken.token
                    }
                }
            })
            return { success: false, error: "Verification token has expired" }
        }

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() }
        })

        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token
                }
            }
        })

        return { success: true }
    } catch {
        return { success: false, error: "Failed to verify email" }
    }
}

/**
 * Change password for authenticated user
 */
export async function changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean; error?: string }> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
    })

    if (!user?.password) {
        return { success: false, error: "User not found or no password set" }
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)

    if (!isValid) {
        return { success: false, error: "Current password is incorrect" }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })

    return { success: true }
}
