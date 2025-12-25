import { openai } from "./openai"
import { prisma } from "@/lib/db"
import { VehicleType } from "@prisma/client"

interface ComponentData {
    name: string
    partNumber?: string
    type: string
    location?: string
    function: string
    specifications?: Record<string, unknown>
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

interface VehicleInfo {
    type?: string
    manufacturer?: string
    model?: string
    year?: string
    system?: string
    systemCode?: string
}

interface AIParsedData {
    components?: ComponentData[]
    connections?: ConnectionData[]
    systems?: string[]
    vehicleInfo?: VehicleInfo
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
                    content: `You are an expert avionics and electrical systems engineer. Your task is to analyze wiring diagrams and extract structured data.

CRITICAL: You must classify the system according to ATA iSpec 2200 standards (ATA Chapters).
Use the standard 2-digit ATA code (e.g., "32" for Landing Gear, "24" for Electrical Power).
If the diagram implies a specific ATA chapter, explicitly state it in the 'systemCode' field.

Extract the following:
1. Vehicle Information (Type, Make, Model, Year, System Name, ATA Chapter Code)
2. Components (Name, Type, Location, Part Number, Function)
3. Connections (From, To, Wire Type, Color, Gauge, Signal Type)
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
    "year": "year if visible",
    "system": "main system name",
    "systemCode": "ATA chapter code (e.g., 24, 32) for aircraft, or system abbreviation for others"
  }
}

IMPORTANT CLASSIFICATION RULES:
- FOR AIRCRAFT: Use ATA iSpec 2200 chapter codes (e.g., "24" for Electrical Power, "32" for Landing Gear, "33" for Lights, "34" for Navigation)
- FOR AUTOMOTIVE/EV: Use system names (e.g., "Engine Management", "Battery System", "Charging System", "HVAC")
- FOR MARINE: Use system names (e.g., "Navigation", "Bilge Pumps", "Power Distribution")

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
        let parsedData: AIParsedData
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
                    vehicleType: (parsedData.vehicleInfo.type?.toUpperCase() || "AIRCRAFT") as VehicleType,
                    manufacturer: parsedData.vehicleInfo.manufacturer || "Unknown",
                    model: parsedData.vehicleInfo.model || "Unknown",
                    year: parsedData.vehicleInfo.year ? parseInt(parsedData.vehicleInfo.year, 10) : null,
                    system: parsedData.vehicleInfo.system || "Unknown",
                    systemCode: parsedData.vehicleInfo.systemCode || null,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    aiExtractedData: parsedData as any,
                    status: "COMPLETED",
                    processingCompletedAt: new Date(),
                    confidence: calculateConfidence(parsedData),
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        specifications: (comp.specifications || {}) as any,
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

function calculateConfidence(data: AIParsedData | ComponentData): number {
    // Simple confidence calculation based on data completeness
    let score = 0
    let maxScore = 0

    // Check if it's the full data object
    if ('components' in data) {
        // It's AIParsedData. 
        // We use type assertion because 'in' check with optional properties is tricky in TS
        const parsed = data as AIParsedData;

        if (parsed.components) {
            maxScore += 40
            score += Math.min(parsed.components.length * 5, 40)
        }

        if (parsed.connections) {
            maxScore += 30
            score += Math.min(parsed.connections.length * 5, 30)
        }

        if (parsed.systems) {
            maxScore += 15
            score += Math.min(parsed.systems.length * 5, 15)
        }

        if (parsed.vehicleInfo) {
            maxScore += 15
            const info = parsed.vehicleInfo
            if (info.manufacturer && info.manufacturer !== "Unknown") score += 5
            if (info.model && info.model !== "Unknown") score += 5
            if (info.system && info.system !== "Unknown") score += 5
        }
    } else {
        // It's a component
        const comp = data as ComponentData
        maxScore = 100
        score = 60 // Base confidence for AI extraction
        if (comp.partNumber) score += 10
        if (comp.location) score += 10
        if (comp.specifications && Object.keys(comp.specifications).length > 0) score += 20
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 50
}
