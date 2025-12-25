"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { VehicleType, Prisma } from "@prisma/client"

export async function updateDiagramMetadata(
    diagramId: string,
    data: {
        title?: string
        description?: string
        vehicleType?: VehicleType
        manufacturer?: string
        model?: string
        year?: number
        system?: string
        systemCode?: string
    }
) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        const diagram = await prisma.diagram.update({
            where: { id: diagramId },
            data,
        })

        revalidatePath("/diagrams")
        return { success: true, diagram }
    } catch (error) {
        console.error("Error updating diagram:", error)
        return { error: "Failed to update diagram" }
    }
}

export async function deleteDiagram(diagramId: string) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        // Check if user owns the diagram or is admin
        const diagram = await prisma.diagram.findUnique({
            where: { id: diagramId },
        })

        if (!diagram) {
            return { error: "Diagram not found" }
        }

        if (diagram.uploadedById !== session.user.id && session.user.role !== "ADMIN") {
            return { error: "Unauthorized" }
        }

        await prisma.diagram.delete({
            where: { id: diagramId },
        })

        revalidatePath("/diagrams")
        return { success: true }
    } catch (error) {
        console.error("Error deleting diagram:", error)
        return { error: "Failed to delete diagram" }
    }
}

export async function getDiagrams(filters?: {
    vehicleType?: VehicleType
    manufacturer?: string
    search?: string
}) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        const where: Prisma.DiagramWhereInput = {}

        if (filters?.vehicleType) {
            where.vehicleType = filters.vehicleType
        }

        if (filters?.manufacturer) {
            where.manufacturer = filters.manufacturer
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
                { system: { contains: filters.search, mode: "insensitive" } },
            ]
        }

        const diagrams = await prisma.diagram.findMany({
            where,
            include: {
                uploadedBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        components: true,
                        analyses: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return { diagrams }
    } catch (error) {
        console.error("Error fetching diagrams:", error)
        return { error: "Failed to fetch diagrams" }
    }
}

export async function triggerDiagramProcessing(diagramId: string) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        // Update status to PROCESSING
        await prisma.diagram.update({
            where: { id: diagramId },
            data: {
                status: "PROCESSING",
                processingStartedAt: new Date(),
            },
        })

        // Here you would trigger the AI processing
        // For now, we'll just simulate it
        // In production, this would call your AI analysis function
        console.log(`Triggering AI processing for diagram ${diagramId}`)

        revalidatePath("/diagrams")
        return { success: true }
    } catch (error) {
        console.error("Error triggering processing:", error)
        return { error: "Failed to trigger processing" }
    }
}
