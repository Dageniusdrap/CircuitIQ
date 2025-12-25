"use server"

import { openai } from "@/lib/ai/openai"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export interface DiagnosticState {
    analysisId?: string
    messages: { role: "user" | "assistant"; content: string }[]
    currentStep?: number
    suggestedTests?: Record<string, unknown>[]
    probableCauses?: Record<string, unknown>[]
    isAnalyzing: boolean
}

export async function startDiagnosis(diagramId: string, symptom: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    // 1. Fetch Diagram Context
    const diagram = await prisma.diagram.findUnique({
        where: { id: diagramId },
        include: { components: true, uploadedBy: true }
    })

    if (!diagram) throw new Error("Diagram not found")

    // 2. Create Analysis Record
    const analysis = await prisma.analysis.create({
        data: {
            diagramId,
            userId: session.user.id,
            symptom,
            aiResponse: {},
            chatHistory: [{ role: "user", content: symptom }],
            suggestedTests: [],
            probableCauses: [],
        }
    })

    // 3. Initial AI Analysis
    const context = `
    Vehicle: ${diagram.manufacturer} ${diagram.model} (${diagram.year})
    System: ${diagram.system}
    Components: ${diagram.components.map((c: { name: string; type: string }) => `${c.name} (${c.type})`).join(", ")}
    User Complaint: ${symptom}
    `

    const systemPrompt = `
    You are an expert diagnostic technician. Analyze the provided wiring diagram context and user symptom.
    
    1. Identify the most likely failure modes based on the components present.
    2. Suggest a logical step-by-step troubleshooting procedure.
    3. Return your response in JSON format.
    
    Format:
    {
        "thoughtProcess": "Brief analysis of the situation...",
        "probableCauses": [
            { "cause": "Description", "likelihood": "High/Medium/Low", "reason": "Why?" }
        ],
        "suggestedTests": [
            { "step": 1, "title": "Check Power", "instruction": "Measure voltage at...", "expected": "12V" }
        ],
        "initialResponse": "A conversational opening message to the user summarizing the plan."
    }
    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo", // Use a smart model
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: context }
            ],
            response_format: { type: "json_object" }
        })

        const content = response.choices[0].message.content || "{}"
        const result = JSON.parse(content)

        // 4. Update Analysis Record
        await prisma.analysis.update({
            where: { id: analysis.id },
            data: {
                aiResponse: result,
                suggestedTests: result.suggestedTests || [],
                probableCauses: result.probableCauses || [],
                chatHistory: [
                    { role: "user", content: symptom },
                    { role: "assistant", content: result.initialResponse }
                ]
            }
        })

        revalidatePath(`/diagrams/${diagramId}`)
        return {
            analysisId: analysis.id,
            initialResponse: result,
            history: [
                { role: "user", content: symptom },
                { role: "assistant", content: result.initialResponse }
            ]
        }

    } catch (error) {
        console.error("Diagnosis Error:", error)
        throw new Error("Failed to generate diagnosis")
    }
}

export async function continueDiagnosis(analysisId: string, userMessage: string) {
    const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
        include: { diagram: { include: { components: true } } }
    })

    if (!analysis) throw new Error("Analysis not found")

    // Update history
    const history = (analysis.chatHistory as Record<string, unknown>[] | null) || []
    history.push({ role: "user", content: userMessage })

    // AI logic for follow-up...
    // simpler conversational follow-up for now
    const systemPrompt = `
    You are helping a technician fix a ${analysis.diagram.title}.
    Current Probable Causes: ${JSON.stringify(analysis.probableCauses)}
    Previous Tests: ${JSON.stringify(analysis.suggestedTests)}
    
    The user just said: "${userMessage}"
    
    Decide if the problem is solved, or suggest the next step.
    Keep it brief and professional.
    `

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            ...history.map((msg) => ({ role: (msg as { role: string }).role as "system" | "user" | "assistant", content: (msg as { content: string }).content }))
        ]
    })

    const reply = response.choices[0].message.content || "I'm not sure how to proceed."
    history.push({ role: "assistant", content: reply })

    await prisma.analysis.update({
        where: { id: analysisId },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { chatHistory: history as unknown as any } // Using double cast to force satisfaction if simple cast fails, but better to use InputJsonValue
    })

    return { history }
}
