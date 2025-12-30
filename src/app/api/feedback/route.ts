import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const feedbackSchema = z.object({
    type: z.enum(["bug", "feature", "improvement", "other"]),
    title: z.string().min(5).max(200),
    description: z.string().min(10).max(2000),
    page: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
})

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const validatedData = feedbackSchema.parse(body)

        // Store feedback in database
        const feedback = await prisma.feedback.create({
            data: {
                userId: session.user.id,
                type: validatedData.type,
                title: validatedData.title,
                description: validatedData.description,
                page: validatedData.page,
                rating: validatedData.rating,
                status: "pending",
            },
        })

        return NextResponse.json({
            success: true,
            id: feedback.id,
        })
    } catch (error) {
        console.error("Feedback submission error:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid feedback data", details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        )
    }
}

// Get user's feedback history
export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const feedback = await prisma.feedback.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        })

        return NextResponse.json({ feedback })
    } catch (error) {
        console.error("Feedback retrieval error:", error)
        return NextResponse.json(
            { error: "Failed to retrieve feedback" },
            { status: 500 }
        )
    }
}
