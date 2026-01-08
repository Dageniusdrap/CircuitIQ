import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { EngineerTeammate } from "@/lib/ai/engineer-teammate"
import { trackUsage, checkUsageLimit } from "@/lib/usage-tracking"


// Store active teammate sessions (use Redis in production)
// Note: In serverless, this map will be reset on cold start. 
// For production, use Redis or database to persist state.
const activeTeammates = new Map<string, EngineerTeammate>()

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { sessionId, action, message, imageUrl, diagramUrl, techComment, vehicleInfo } = body

        // Check AI analysis limit for actions that use AI
        const aiActions = ['chat', 'photo', 'explain', 'reassess'];
        if (aiActions.includes(action)) {
            const usageCheck = await checkUsageLimit(session.user.id, 'AI_ANALYSIS');
            if (!usageCheck.allowed) {
                return NextResponse.json(
                    {
                        error: 'AI analysis limit reached',
                        message: `You've reached your AI analysis limit of ${usageCheck.limit} this month. Upgrade to continue using AI features.`,
                        current: usageCheck.current,
                        limit: usageCheck.limit,
                        percentage: usageCheck.percentage,
                        upgradeUrl: '/pricing',
                    },
                    { status: 429 }
                );
            }
        }

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

        let response;
        let analysisType: string | undefined;

        // Handle different actions
        switch (action) {
            case "chat":
                // If we have a diagram URL, use vision analysis
                if (diagramUrl) {
                    response = await teammate.lookAtPhoto(diagramUrl, message);
                    analysisType = 'vision';
                } else {
                    response = await teammate.communicate(message);
                    analysisType = 'chat';
                }
                break;

            case "photo":
                response = await teammate.lookAtPhoto(imageUrl, techComment);
                analysisType = 'photo';
                break;

            case "explain":
                response = await teammate.explainWhy(message);
                analysisType = 'explain';
                break;

            case "reassess":
                response = await teammate.reassessStrategy();
                analysisType = 'reassess';
                break;

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }

        // Track AI analysis usage (don't block on this)
        if (aiActions.includes(action)) {
            trackUsage({
                userId: session.user.id,
                action: 'AI_ANALYSIS',
                resourceId: sessionId,
                metadata: {
                    action,
                    analysisType,
                    hasDiagram: !!diagramUrl,
                    hasImage: !!imageUrl,
                },
            }).catch(err => console.error('Failed to track AI analysis:', err));
        }

        return NextResponse.json(response);

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
