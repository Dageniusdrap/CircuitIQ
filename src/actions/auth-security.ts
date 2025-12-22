"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { authenticator } from "otplib"
import qrcode from "qrcode"
import { revalidatePath } from "next/cache"

export async function getTwoFactorStatus() {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { twoFactorEnabled: true }
    })

    return !!user?.twoFactorEnabled
}

export async function generateTwoFactorSecret() {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(
        session.user.email,
        "CircuitIQ Enterprise",
        secret
    )

    const qrCodeUrl = await qrcode.toDataURL(otpauth)

    return { secret, qrCodeUrl }
}

export async function enableTwoFactor(token: string, secret: string) {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const isValid = authenticator.verify({
        token,
        secret
    })

    if (!isValid) {
        throw new Error("Invalid verification code")
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            twoFactorEnabled: true,
            twoFactorSecret: secret
        }
    })

    revalidatePath("/settings")
    return { success: true }
}

export async function disableTwoFactor() {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            twoFactorEnabled: false,
            twoFactorSecret: null
        }
    })

    revalidatePath("/settings")
    return { success: true }
}
