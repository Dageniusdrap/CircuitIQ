import { Metadata } from "next"
import { SearchInterface } from "@/components/search/search-interface"

export const metadata: Metadata = {
    title: "Search | CircuitIQ",
    description: "Search your wiring diagram library",
}

export default function SearchPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Search Library</h1>
                <p className="text-slate-400 mt-1">
                    Find components, wiring diagrams, and diagnostic history
                </p>
            </div>

            <SearchInterface />
        </div>
    )
}
