"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    FileText,
    BookOpen,
    Plane,
    Car,
    Ship,
    Zap,
    Clock,
    Loader2,
    Filter,
    X
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
    diagrams: any[]
    procedures: any[]
    total: number
}

export function SearchInterface() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        type: 'all',
        vehicleType: '',
        system: '',
    })

    const debouncedQuery = useDebounce(query, 300)

    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults(null)
            return
        }

        setLoading(true)
        try {
            const params = new URLSearchParams({
                q: searchQuery,
                type: filters.type,
                ...(filters.vehicleType && { vehicleType: filters.vehicleType }),
                ...(filters.system && { system: filters.system }),
            })

            const response = await fetch(`/api/search?${params}`)
            if (response.ok) {
                const data = await response.json()
                setResults(data)
            }
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        performSearch(debouncedQuery)
    }, [debouncedQuery, performSearch])

    const getVehicleIcon = (type: string) => {
        switch (type) {
            case 'AIRCRAFT': return <Plane className="h-4 w-4" />
            case 'AUTOMOTIVE': return <Car className="h-4 w-4" />
            case 'MARINE': return <Ship className="h-4 w-4" />
            case 'ELECTRIC_VEHICLE': return <Zap className="h-4 w-4" />
            default: return <FileText className="h-4 w-4" />
        }
    }

    const clearFilters = () => {
        setFilters({
            type: 'all',
            vehicleType: '',
            system: '',
        })
    }

    const hasActiveFilters = filters.type !== 'all' || filters.vehicleType || filters.system

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search diagrams, procedures, systems..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 pr-10 h-12 text-lg"
                                autoFocus
                            />
                            {query && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-2"
                                    onClick={() => setQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant={showFilters ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                                        {Object.values(filters).filter(Boolean).length - (filters.type === 'all' ? 0 : 1)}
                                    </Badge>
                                )}
                            </Button>

                            <Button
                                variant={filters.type === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilters({ ...filters, type: 'all' })}
                            >
                                All
                            </Button>
                            <Button
                                variant={filters.type === 'diagrams' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilters({ ...filters, type: 'diagrams' })}
                            >
                                Diagrams
                            </Button>
                            <Button
                                variant={filters.type === 'procedures' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilters({ ...filters, type: 'procedures' })}
                            >
                                Procedures
                            </Button>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="gap-1 text-muted-foreground"
                                >
                                    <X className="h-3 w-3" />
                                    Clear
                                </Button>
                            )}
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Vehicle Type</label>
                                    <select
                                        value={filters.vehicleType}
                                        onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    >
                                        <option value="">All Types</option>
                                        <option value="AIRCRAFT">Aircraft</option>
                                        <option value="AUTOMOTIVE">Automotive</option>
                                        <option value="MARINE">Marine</option>
                                        <option value="ELECTRIC_VEHICLE">Electric Vehicle</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">System</label>
                                    <Input
                                        placeholder="e.g., Electrical, Hydraulic"
                                        value={filters.system}
                                        onChange={(e) => setFilters({ ...filters, system: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Results */}
            {!loading && results && (
                <div className="space-y-6">
                    {/* Results Summary */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Found {results.total} result{results.total !== 1 ? 's' : ''} for "{query}"
                        </p>
                    </div>

                    {/* Diagrams */}
                    {results.diagrams.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Diagrams ({results.diagrams.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.diagrams.map((diagram) => (
                                    <Link key={diagram.id} href={`/diagnostics?diagram=${diagram.id}`}>
                                        <Card className="border-white/5 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-200 h-full cursor-pointer group">
                                            <CardContent className="pt-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        {getVehicleIcon(diagram.vehicleType)}
                                                        <Badge variant="outline" className="text-xs">
                                                            {diagram.vehicleType?.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                                            {diagram.title || diagram.model || 'Untitled Diagram'}
                                                        </h3>
                                                        {diagram.description && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {diagram.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>{diagram.manufacturer}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(diagram.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Procedures */}
                    {results.procedures.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Procedures ({results.procedures.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.procedures.map((procedure) => (
                                    <Link key={procedure.id} href={`/procedures/${procedure.id}`}>
                                        <Card className="border-white/5 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-200 cursor-pointer group">
                                            <CardContent className="pt-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {procedure.category}
                                                        </Badge>
                                                        <Badge
                                                            variant="secondary"
                                                            className={cn(
                                                                procedure.difficulty === 'beginner' && 'bg-green-500/10 text-green-500',
                                                                procedure.difficulty === 'intermediate' && 'bg-amber-500/10 text-amber-500',
                                                                procedure.difficulty === 'advanced' && 'bg-red-500/10 text-red-500'
                                                            )}
                                                        >
                                                            {procedure.difficulty}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                            {procedure.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                            {procedure.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>{procedure.system}</span>
                                                        <span>•</span>
                                                        <span>{procedure.steps.length} steps</span>
                                                        <span>•</span>
                                                        <span>{procedure.duration}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {results.total === 0 && (
                        <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                            <CardContent className="py-12 text-center">
                                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search terms or filters
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && !results && !query && (
                <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                    <CardContent className="py-12 text-center">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Start searching</h3>
                        <p className="text-sm text-muted-foreground">
                            Enter a search term to find diagrams and procedures
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
