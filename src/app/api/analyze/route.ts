import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { analyzeDiagramWithVision } from "@/lib/ai/diagram-analyzer"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { diagramId } = await req.json()

        if (!diagramId) {
            return NextResponse.json({ error: "Diagram ID required" }, { status: 400 })
        }

        // Get diagram
        const diagram = await prisma.diagram.findUnique({
            where: { id: diagramId },
        })

        if (!diagram) {
            return NextResponse.json({ error: "Diagram not found" }, { status: 404 })
        }

        // Update status to PROCESSING
        await prisma.diagram.update({
            where: { id: diagramId },
            data: {
                status: "PROCESSING",
                processingStartedAt: new Date(),
            },
        })

        // Run analysis
        const result = await analyzeDiagramWithVision(diagram.fileUrl, diagramId)

        return NextResponse.json({
            success: true,
            result,
        })
    } catch (error) {
        console.error("Analysis error:", error)
        const errorMessage = error instanceof Error ? error.message : "Analysis failed"

        // Check for common OpenAI errors
        if (errorMessage.includes("401")) {
            return NextResponse.json({ error: "OpenAI API Key Invalid" }, { status: 500 })
        }
        if (errorMessage.includes("429") || errorMessage.includes("insufficient_quota")) {
            return NextResponse.json({ error: "OpenAI API Quota Exceeded" }, { status: 500 })
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
