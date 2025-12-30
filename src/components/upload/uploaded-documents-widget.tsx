"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    FileText,
    Search,
    Filter,
    Plane,
    Car,
    Ship,
    Zap,
    Clock,
    CheckCircle,
    Loader2,
    ArrowRight,
    Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { Diagram } from "@prisma/client"

interface UploadedDocumentsWidgetProps {
    diagrams: Diagram[]
    title?: string
    maxItems?: number
    showSearch?: boolean
    allowSelection?: boolean
    onSelect?: (diagramId: string) => void
    selectedId?: string
    className?: string
}

const vehicleIcons = {
    AIRCRAFT: { icon: Plane, color: "text-blue-400", bg: "bg-blue-500/10" },
    AUTOMOTIVE: { icon: Car, color: "text-orange-400", bg: "bg-orange-500/10" },
    MARINE: { icon: Ship, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    ELECTRIC_VEHICLE: { icon: Zap, color: "text-green-400", bg: "bg-green-500/10" },
}

export function UploadedDocumentsWidget({
    diagrams,
    title = "My Documents",
    maxItems = 10,
    showSearch = true,
    allowSelection = false,
    onSelect,
    selectedId,
    className
}: UploadedDocumentsWidgetProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<string | null>(null)

    // Filter diagrams
    const filteredDiagrams = diagrams
        .filter(diagram => {
            const matchesSearch = diagram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                diagram.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                diagram.model.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter = !filterType || diagram.vehicleType === filterType
            return matchesSearch && matchesFilter
        })
        .slice(0, maxItems)

    const vehicleTypeCounts = diagrams.reduce((acc, diagram) => {
        acc[diagram.vehicleType] = (acc[diagram.vehicleType] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <Card className={cn("border-slate-800 bg-slate-900/50 backdrop-blur-sm", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        {title}
                    </CardTitle>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                        {diagrams.length} {diagrams.length === 1 ? 'document' : 'documents'}
                    </span>
                </div>

                {showSearch && (
                    <div className="pt-4 space-y-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800/50 border-slate-700"
                            />
                        </div>

                        {/* Vehicle Type Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant={filterType === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterType(null)}
                                className="h-8 text-xs"
                            >
                                All ({diagrams.length})
                            </Button>
                            {Object.entries(vehicleTypeCounts).map(([type, count]) => {
                                const config = vehicleIcons[type as keyof typeof vehicleIcons]
                                const Icon = config?.icon || FileText
                                return (
                                    <Button
                                        key={type}
                                        variant={filterType === type ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFilterType(type)}
                                        className="h-8 text-xs gap-1.5"
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {type.replace("_", " ").charAt(0) + type.replace("_", " ").slice(1).toLowerCase()}
                                        ({count})
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                {filteredDiagrams.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                            {searchQuery || filterType ? "No documents found matching your criteria" : "No documents uploaded yet"}
                        </p>
                        {!searchQuery && !filterType && (
                            <Button asChild variant="link" className="mt-2 text-blue-400">
                                <Link href="/upload">Upload your first document</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {filteredDiagrams.map((diagram) => {
                            const config = vehicleIcons[diagram.vehicleType]
                            const Icon = config?.icon || FileText
                            const isSelected = selectedId === diagram.id

                            return (
                                <div
                                    key={diagram.id}
                                    onClick={() => allowSelection && onSelect?.(diagram.id)}
                                    className={cn(
                                        "group relative p-3 rounded-lg border transition-all duration-200",
                                        "hover:bg-slate-800/50",
                                        allowSelection && "cursor-pointer",
                                        isSelected
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-slate-800 hover:border-slate-700"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div className={cn(
                                            "p-2 rounded-lg shrink-0",
                                            config?.bg,
                                            config?.color
                                        )}>
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-slate-200 truncate group-hover:text-white transition-colors">
                                                {diagram.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="truncate">
                                                    {diagram.manufacturer} {diagram.model}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(diagram.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex items-center gap-2">
                                            {diagram.status === "COMPLETED" ? (
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Ready
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Processing
                                                </div>
                                            )}

                                            {!allowSelection && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Link href={`/diagrams/${diagram.id}`}>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* View All Link */}
                {filteredDiagrams.length > 0 && filteredDiagrams.length === maxItems && diagrams.length > maxItems && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <Button asChild variant="link" className="w-full text-blue-400">
                            <Link href="/diagrams">
                                View all {diagrams.length} documents
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
