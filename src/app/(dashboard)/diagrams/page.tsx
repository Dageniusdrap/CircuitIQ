import { Metadata } from "next"
import { DiagramGrid } from "@/components/diagrams/diagram-grid"
import { getDiagrams } from "@/actions/diagram"

export const metadata: Metadata = {
    title: "Diagrams | CircuitIQ",
    description: "Browse your wiring diagram library",
}

export default async function DiagramsPage() {
    const { diagrams } = await getDiagrams()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Wiring Diagrams</h1>
                <p className="text-slate-400 mt-1">
                    Browse and manage your diagram library
                </p>
            </div>

            <DiagramGrid diagrams={diagrams || []} />
        </div>
    )
}
