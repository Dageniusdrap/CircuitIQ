import { Metadata } from "next"
import { TeammateChat } from "@/components/diagnostics/teammate-chat"
import { prisma } from "@/lib/db"

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
        }
    }

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Diagnostics</h1>
                <p className="text-slate-400">
                    {diagramContext
                        ? `Troubleshooting ${diagramContext.title} (${diagramContext.system})`
                        : "Collaborate with your AI teammate to solve complex issues"}
                </p>
            </div>
            <div className="flex-1 min-h-0">
                <TeammateChat
                    diagramId={searchParams.diagramId}
                    vehicleInfo={vehicleInfo}
                />
            </div>
        </div>
    )
}
