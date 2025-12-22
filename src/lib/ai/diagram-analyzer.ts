import { openai } from "./openai"
import { prisma } from "@/lib/db"

interface ComponentData {
    name: string
    partNumber?: string
    type: string
    location?: string
    function: string
    specifications?: Record<string, any>
    xPosition?: number
    yPosition?: number
}

interface ConnectionData {
    from: string
    to: string
    wireColor?: string
    wireGauge?: string
    signalType?: string
}

interface AnalysisResult {
    components: ComponentData[]
    connections: ConnectionData[]
    systems: string[]
    confidence: number
    rawResponse: string
}

export async function analyzeDiagramWithVision(
    imageUrl: string,
    diagramId: string
): Promise<AnalysisResult> {
    console.log("Starting AI analysis for diagram:", diagramId)

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "system",
                    content: `You are an expert aircraft and automotive electrical systems engineer. 
Analyze wiring diagrams and extract detailed component information, connections, and system relationships.
Provide responses in valid JSON format only, with no additional text or markdown formatting.`,
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this wiring diagram and extract the following information in JSON format:
{
  "components": [
    {
      "name": "component name",
      "partNumber": "part number if visible",
      "type": "relay|fuse|switch|sensor|actuator|connector|other",
      "location": "physical location if mentioned",
      "function": "detailed description of component function",
      "specifications": {
        "voltage": "operating voltage",
        "current": "current rating",
        "resistance": "resistance value if applicable"
      },
      "xPosition": 0-100 (percentage from left),
      "yPosition": 0-100 (percentage from top)
    }
  ],
  "connections": [
    {
      "from": "component name",
      "to": "component name",
      "wireColor": "wire color",
      "wireGauge": "wire gauge (e.g., 22AWG)",
      "signalType": "power|ground|signal|data"
    }
  ],
  "systems": ["list of electrical systems shown"],
  "vehicleInfo": {
    "type": "aircraft|automotive|marine|electric_vehicle",
    "manufacturer": "manufacturer if visible",
    "model": "model if visible",
    "system": "main system name"
  }
}

Be thorough and extract as much detail as possible. For component positions, estimate percentage-based coordinates.`,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                                detail: "high",
                            },
                        },
                    ],
                },
            ],
            max_tokens: 4096,
            temperature: 0.2, // Lower temperature for more consistent, factual responses
        })

        const content = response.choices[0].message.content || ""
        console.log("Raw AI Response:", content)

        // Parse the JSON response
        let parsedData: any
        try {
            // Remove markdown code blocks if present
            const cleanedContent = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim()

            parsedData = JSON.parse(cleanedContent)
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError)
            throw new Error("Failed to parse AI response as JSON")
        }

        // Update diagram with extracted information
        if (parsedData.vehicleInfo) {
            await prisma.diagram.update({
                where: { id: diagramId },
                data: {
                    vehicleType: parsedData.vehicleInfo.type?.toUpperCase() || "AIRCRAFT",
                    manufacturer: parsedData.vehicleInfo.manufacturer || "Unknown",
                    model: parsedData.vehicleInfo.model || "Unknown",
                    system: parsedData.vehicleInfo.system || "Unknown",
                    aiExtractedData: parsedData,
                    status: "COMPLETED",
                    processingCompletedAt: new Date(),
                    confidence: calculateConfidence(parsedData), // Fixed: Was calling calculateConfidence without implementation in scope
                },
            })
        }

        // Store components in database
        if (parsedData.components && Array.isArray(parsedData.components)) {
            for (const comp of parsedData.components) {
                await prisma.component.create({
                    data: {
                        diagramId,
                        name: comp.name,
                        partNumber: comp.partNumber,
                        type: comp.type,
                        location: comp.location,
                        function: comp.function,
                        specifications: comp.specifications || {},
                        xPosition: comp.xPosition,
                        yPosition: comp.yPosition,
                        extractedByAI: true,
                        confidence: calculateConfidence(comp),
                    },
                })
            }
        }

        // Store connections
        if (parsedData.connections && Array.isArray(parsedData.connections)) {
            for (const conn of parsedData.connections) {
                // Find the component IDs
                const fromComponent = await prisma.component.findFirst({
                    where: {
                        diagramId,
                        name: { contains: conn.from, mode: "insensitive" },
                    },
                })

                const toComponent = await prisma.component.findFirst({
                    where: {
                        diagramId,
                        name: { contains: conn.to, mode: "insensitive" },
                    },
                })

                if (fromComponent && toComponent) {
                    await prisma.componentConnection.create({
                        data: {
                            fromId: fromComponent.id,
                            toId: toComponent.id,
                            wireColor: conn.wireColor,
                            wireGauge: conn.wireGauge,
                            signalType: conn.signalType,
                        },
                    })
                }
            }
        }

        return {
            components: parsedData.components || [],
            connections: parsedData.connections || [],
            systems: parsedData.systems || [],
            confidence: calculateConfidence(parsedData),
            rawResponse: content,
        }
    } catch (error) {
        console.error("Error analyzing diagram:", error)

        // Update diagram status to FAILED
        await prisma.diagram.update({
            where: { id: diagramId },
            data: {
                status: "FAILED",
                processingError: error instanceof Error ? error.message : "Unknown error",
            },
        })

        throw error
    }
}

function calculateConfidence(data: any): number {
    // Simple confidence calculation based on data completeness
    let score = 0
    let maxScore = 0

    if (data.components) {
        maxScore += 40
        score += Math.min(data.components.length * 5, 40)
    }

    if (data.connections) {
        maxScore += 30
        score += Math.min(data.connections.length * 5, 30)
    }

    if (data.systems) {
        maxScore += 15
        score += Math.min(data.systems.length * 5, 15)
    }

    if (data.vehicleInfo) {
        maxScore += 15
        const info = data.vehicleInfo
        if (info.manufacturer && info.manufacturer !== "Unknown") score += 5
        if (info.model && info.model !== "Unknown") score += 5
        if (info.system && info.system !== "Unknown") score += 5
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 50
}
