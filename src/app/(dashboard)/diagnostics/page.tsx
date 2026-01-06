import { Metadata } from "next"
import { TeammateChat } from "@/components/diagnostics/teammate-chat"
import { prisma } from "@/lib/db"
import { DiagramSelector } from "@/components/diagnostics/diagram-selector"
import { DiagramSelectorWidget } from "@/components/diagnostics/diagram-selector-widget"

export const metadata: Metadata = {
    title: "Diagnostics | CircuitIQ",
    description: "Chat with your AI diagnostic teammate",
}

export default async function DiagnosticsPage(props: {
    searchParams: Promise<{ diagramId?: string }>
}) {
    const searchParams = await props.searchParams
    let vehicleInfo: { make: string, model: string, type: "aircraft" | "automotive" | "marine" } = { make: "Generic", model: "Vehicle", type: "aircraft" }
    let diagramContext = null

    // Fetch all diagrams for the widget
    const allDiagrams = await prisma.diagram.findMany({
        orderBy: { createdAt: "desc" },
        take: 50
    })

    // If no diagram selected, show selector
    if (!searchParams.diagramId) {
        return <DiagramSelector diagrams={allDiagrams} />
    }

    if (searchParams.diagramId) {
        const diagram = await prisma.diagram.findUnique({
            where: { id: searchParams.diagramId },
        })

        if (diagram) {
            vehicleInfo = {
                make: diagram.manufacturer,
                model: diagram.model,
                type: (diagram.vehicleType.toLowerCase() as "aircraft" | "automotive" | "marine") || "aircraft"
            }
            diagramContext = diagram
        } else {
            // Diagram ID provided but not found - likely deleted or invalid
            // Show selector instead of broken chat
            return <DiagramSelector diagrams={allDiagrams} />
        }
    }

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Diagnostics</h1>
                <p className="text-slate-400">
                    {diagramContext
                        ? `Troubleshooting ${diagramContext.title} (${diagramContext.system})`
                        : "Collaborate with your AI teammate to solve complex issues"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Chat Area */}
                <div className="lg:col-span-3 h-[calc(100vh-220px)] flex flex-col">
                    <TeammateChat
                        diagramId={searchParams.diagramId}
                        vehicleInfo={vehicleInfo}
                        diagramUrl={diagramContext?.fileUrl}
                    />
                </div>

                {/* Sidebar with Uploaded Documents */}
                <div className="lg:col-span-1 space-y-4">
                    <DiagramSelectorWidget
                        diagrams={allDiagrams}
                        title="Switch Diagram"
                        maxItems={8}
                        currentDiagramId={searchParams.diagramId}
                    />
                </div>
            </div>
        </div>
    )
}
