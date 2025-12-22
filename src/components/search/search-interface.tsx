"use client"

import { useState, useTransition } from "react"
import { globalSearch, SearchResult } from "@/actions/search"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, FileText, Settings, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchInterface() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isPending, startTransition] = useTransition()

    const handleSearch = (value: string) => {
        setQuery(value)
        startTransition(async () => {
            if (value.length > 1) {
                const data = await globalSearch(value)
                setResults(data)
            } else {
                setResults([])
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                    placeholder="Search diagrams, components, systems..."
                    className="pl-10 h-12 text-lg bg-slate-900/50"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isPending && (
                    <div className="absolute right-3 top-3">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {results.length > 0 ? (
                    results.map((result) => (
                        <Link key={`${result.type}-${result.id}`} href={result.url}>
                            <Card className="hover:bg-slate-800/50 transition-colors cursor-pointer border-slate-800">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-slate-800">
                                            {result.type === "diagram" ? (
                                                <FileText className="h-6 w-6 text-blue-400" />
                                            ) : (
                                                <Settings className="h-6 w-6 text-emerald-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-200">
                                                {result.title}
                                            </h3>
                                            <p className="text-sm text-slate-400">{result.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {result.status && (
                                            <Badge variant="outline" className="text-xs">
                                                {result.status}
                                            </Badge>
                                        )}
                                        <ArrowRight className="h-4 w-4 text-slate-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : query.length > 1 && !isPending ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No results found for "{query}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
                        {/* Empty State placeholder / Suggestion */}
                    </div>
                )}
            </div>
        </div>
    )
}
