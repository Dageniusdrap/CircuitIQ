import { getDiagrams } from "@/actions/diagram"
import { LibraryBrowser } from "@/components/library/library-browser"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { VehicleType } from "@prisma/client"

export const dynamic = "force-dynamic"

interface DiagramsPageProps {
    searchParams: Promise<{
        category?: string
        search?: string
    }>
}

export default async function DiagramsPage({ searchParams }: DiagramsPageProps) {
    const params = await searchParams
    const category = params.category || "aircraft"
    const search = params.search || ""

    // Map URL category to Prisma VehicleType
    let vehicleType: VehicleType | undefined

    switch (category) {
        case "aircraft":
            vehicleType = "AIRCRAFT"
            break
        case "automotive":
            vehicleType = "AUTOMOTIVE"
            break
        case "marine":
            vehicleType = "MARINE"
            break
        case "electric":
            vehicleType = "ELECTRIC_VEHICLE"
            break
        default:
            vehicleType = "AIRCRAFT" // Default to Aviation
    }

    const { diagrams, error } = await getDiagrams({
        vehicleType,
        search: search
    })

    if (error) {
        // Fallback or error state could be handled here
        console.error("Error fetching diagrams:", error)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                        Technical Library
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Browse and manage your wiring diagrams
                    </p>
                </div>
                <Button asChild size="lg" className="gap-2">
                    <Link href="/upload">
                        <Plus className="h-4 w-4" />
                        Upload Diagram
                    </Link>
                </Button>
            </div>

            <LibraryBrowser
                diagrams={diagrams || []}
                initialCategory={category}
                initialSearch={search}
            />
        </div>
    )
}
