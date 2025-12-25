import { prisma } from "@/lib/db"
import { LibraryBrowser } from "@/components/library/library-browser"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DiagramsPage() {
    const diagrams = await prisma.diagram.findMany({
        orderBy: { createdAt: "desc" },
    })

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

            <LibraryBrowser diagrams={diagrams} />
        </div>
    )
}
