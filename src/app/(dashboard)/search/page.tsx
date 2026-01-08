import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SearchInterface } from "@/components/search/search-interface"

export const metadata: Metadata = {
    title: "Search | CircuitIQ",
    description: "Search across diagrams and procedures",
}

export default async function SearchPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                    Search
                </h1>
                <p className="text-muted-foreground text-lg">
                    Find diagrams, procedures, and documentation across CircuitIQ
                </p>
            </div>

            <SearchInterface />
        </div>
    )
}
