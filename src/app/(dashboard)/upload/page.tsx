import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UploadPageClient } from "./upload-client"

export const metadata: Metadata = {
    title: "Upload Diagrams | CircuitIQ",
    description: "Upload and analyze wiring diagrams with AI",
}

export const dynamic = "force-dynamic"

export default async function UploadPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    // Fetch recent uploads for this user
    let recentUploads = []
    try {
        recentUploads = await prisma.diagram.findMany({
            where: {
                uploadedById: session.user.id,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                title: true,
                fileUrl: true,
                vehicleType: true,
                status: true,
                createdAt: true,
            },
        })
    } catch (error) {
        console.error("Failed to fetch diagrams:", error)
    }

    return (
        <UploadPageClient
            userId={session.user.id}
            initialRecentUploads={recentUploads}
        />
    )
}
