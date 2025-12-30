"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { UploadedDocumentsWidget } from "./uploaded-documents-widget"
import type { Diagram } from "@prisma/client"

interface DiagramSelectorWidgetProps {
    diagrams: Diagram[]
    title?: string
    maxItems?: number
    currentDiagramId?: string
}

export function DiagramSelectorWidget({
    diagrams,
    title = "Switch Diagram",
    maxItems = 8,
    currentDiagramId
}: DiagramSelectorWidgetProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSelect = (diagramId: string) => {
        // Preserve current search params and update diagram ID
        const params = new URLSearchParams(searchParams)
        params.set("diagramId", diagramId)
        router.push(`?${params.toString()}`)
    }

    return (
        <UploadedDocumentsWidget
            diagrams={diagrams}
            title={title}
            maxItems={maxItems}
            showSearch={true}
            allowSelection={true}
            selectedId={currentDiagramId}
            onSelect={handleSelect}
        />
    )
}
