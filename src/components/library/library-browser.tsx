"use client"

import { useState, useEffect } from "react"
import { Diagram } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { Folder, FileText, ChevronRight, Car, Plane, Ship, Search, Zap, Upload } from "lucide-react"
import { ATA_CHAPTERS } from "@/lib/constants"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface LibraryBrowserProps {
    diagrams: Diagram[]
    initialCategory: string
    initialSearch: string
}

export function LibraryBrowser({ diagrams, initialCategory, initialSearch }: LibraryBrowserProps) {
    const router = useRouter()
    const pathname = usePathname()

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
    const [searchQuery, setSearchQuery] = useState(initialSearch)

    // Update URL when filters change
    const updateFilters = (category: string, search: string) => {
        const params = new URLSearchParams()
        if (category) params.set("category", category)
        if (search) params.set("search", search)

        router.push(`${pathname}?${params.toString()}`)
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category) // Optimistic update
        updateFilters(category, searchQuery)
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        // Debounce could be added here, but for now we'll update on every keystroke or maybe on blur/enter?
        // Ideally debounce. For simplicity in this step, let's update.
        // Actually, let's just update local state and have a separate effect or use debounce.
        // For a search input that triggers server fetch, usually better to debounce.
        // Let's implement a simple debounce.
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== initialSearch) {
                updateFilters(selectedCategory, searchQuery)
            }
        }, 500)

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery])


    // Group by ATA Chapter (for Aircraft) or System (for others)
    const groupedDiagrams = diagrams.reduce((acc, diagram) => {
        const groupKey = diagram.systemCode
            ? `${diagram.systemCode} - ${ATA_CHAPTERS.find(a => a.code === diagram.systemCode)?.title || diagram.system}`
            : diagram.system || "Uncategorized"

        if (!acc[groupKey]) acc[groupKey] = []
        acc[groupKey].push(diagram)
        return acc
    }, {} as Record<string, Diagram[]>)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={selectedCategory === "aircraft" ? "default" : "outline"}
                        onClick={() => handleCategoryChange("aircraft")}
                        className="gap-2"
                        size="sm"
                    >
                        <Plane className="h-4 w-4" /> Aviation (ATA)
                    </Button>
                    <Button
                        variant={selectedCategory === "automotive" ? "default" : "outline"}
                        onClick={() => handleCategoryChange("automotive")}
                        className="gap-2"
                        size="sm"
                    >
                        <Car className="h-4 w-4" /> Automotive
                    </Button>
                    <Button
                        variant={selectedCategory === "marine" ? "default" : "outline"}
                        onClick={() => handleCategoryChange("marine")}
                        className="gap-2"
                        size="sm"
                    >
                        <Ship className="h-4 w-4" /> Marine
                    </Button>
                    <Button
                        variant={selectedCategory === "electric" ? "default" : "outline"}
                        onClick={() => handleCategoryChange("electric")}
                        className="gap-2"
                        size="sm"
                    >
                        <Zap className="h-4 w-4" /> Electric Cars
                    </Button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search current view..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedDiagrams).map(([group, groupDiagrams]) => (
                    <Card key={group} className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <Folder className="h-4 w-4 text-blue-500" />
                                {group}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {groupDiagrams.map(diagram => (
                                    <Link key={diagram.id} href={`/diagrams/${diagram.id}`}>
                                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-slate-300 group-hover:text-white truncate max-w-[180px]">
                                                        {diagram.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {diagram.model} • {diagram.year}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {diagrams.length === 0 && (
                <EmptyState
                    icon={Upload}
                    title="No diagrams found"
                    description={`Upload your first ${selectedCategory === "aircraft" ? "aviation" : selectedCategory} wiring diagram or try a different search.`}
                    actionLabel="Upload Diagram"
                    actionHref="/upload"
                />
            )}
        </div>
    )
}
