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
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Technical Library</h1>
                    <p className="text-slate-400">
                        Browse manuals by ATA chapter, vehicle type, or system.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/upload">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Manual
                    </Link>
                </Button>
            </div>

            <LibraryBrowser diagrams={diagrams} />
        </div>
    )
}
