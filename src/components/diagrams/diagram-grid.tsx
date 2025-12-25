import { Diagram } from "@prisma/client"
import { DiagramCard } from "./diagram-card"

export function DiagramGrid({ diagrams }: { diagrams: Diagram[] }) {
    if (diagrams.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No diagrams found. Upload one to get started.</p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map(diagram => (
                <DiagramCard key={diagram.id} diagram={diagram} />
            ))}
        </div>
    )
}
