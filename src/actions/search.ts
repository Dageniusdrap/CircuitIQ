"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export interface SearchResult {
    type: "diagram" | "component" | "analysis"
    id: string
    title: string
    subtitle?: string
    url: string
    status?: string
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
    const session = await auth()
    if (!session?.user) return []

    if (!query || query.length < 2) return []

    const results: SearchResult[] = []

    // Search Diagrams
    const diagrams = await prisma.diagram.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { system: { contains: query, mode: "insensitive" } },
                { manufacturer: { contains: query, mode: "insensitive" } },
                { model: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 5,
    })

    results.push(
        ...diagrams.map((d) => ({
            type: "diagram" as const,
            id: d.id,
            title: d.title,
            subtitle: `${d.manufacturer} ${d.model} - ${d.system}`,
            url: `/diagrams/${d.id}`,
            status: d.status,
        }))
    )

    // Search Components
    const components = await prisma.component.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { partNumber: { contains: query, mode: "insensitive" } },
                { function: { contains: query, mode: "insensitive" } },
            ],
        },
        include: {
            diagram: true,
        },
        take: 5,
    })

    results.push(
        ...components.map((c) => ({
            type: "component" as const,
            id: c.id,
            title: c.name,
            subtitle: `Part #: ${c.partNumber || "N/A"} in ${c.diagram.title}`,
            url: `/diagrams/${c.diagramId}?component=${c.id}`,
        }))
    )

    return results
}
