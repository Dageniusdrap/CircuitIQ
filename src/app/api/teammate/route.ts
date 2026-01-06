import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { EngineerTeammate } from "@/lib/ai/engineer-teammate"


// Store active teammate sessions (use Redis in production)
// Note: In serverless, this map will be reset on cold start. 
// For production, use Redis or database to persist state.
const activeTeammates = new Map<string, EngineerTeammate>()

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { sessionId, action, message, imageUrl, diagramUrl, techComment, vehicleInfo } = body

        // Get or create teammate
        let teammate = activeTeammates.get(sessionId)
        if (!teammate) {
            teammate = new EngineerTeammate(sessionId, vehicleInfo || {
                make: "Unknown",
                model: "Unknown",
                type: "aircraft"
            })
            activeTeammates.set(sessionId, teammate)
        }

        // Handle different actions
        switch (action) {
            case "chat":
                // If we have a diagram URL, use vision analysis
                if (diagramUrl) {
                    const visionResponse = await teammate.lookAtPhoto(diagramUrl, message)
                    return NextResponse.json(visionResponse)
                }
                const response = await teammate.communicate(message)
                return NextResponse.json(response)

            case "photo":
                const photoResponse = await teammate.lookAtPhoto(imageUrl, techComment)
                return NextResponse.json(photoResponse)

            case "explain":
                const explanation = await teammate.explainWhy(message)
                return NextResponse.json(explanation)

            case "reassess":
                const reassessment = await teammate.reassessStrategy()
                return NextResponse.json(reassessment)

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }
    } catch (error) {
        console.error("Teammate API error:", error)
        // Check for specific OpenAI errors
        if (error instanceof Error && error.message.includes("401")) {
            return NextResponse.json({ error: "AI Configuration Error: Invalid API Key" }, { status: 500 })
        }
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
