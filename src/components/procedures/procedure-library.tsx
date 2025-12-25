"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Plane,
    Car,
    Ship,
    Zap,
    Search,
    BookOpen,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    Wrench
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ALL_PROCEDURES, type Procedure } from "@/lib/data/procedures"

export function ProcedureLibrary() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredProcedures = ALL_PROCEDURES.filter(proc => {
        const matchesCategory = selectedCategory === "all" || proc.category === selectedCategory
        const matchesSearch = proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proc.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proc.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Group by ATA chapter for aircraft, by system for others
    const groupedProcedures = filteredProcedures.reduce((acc, proc) => {
        let groupKey: string
        if (proc.category === "aircraft" && proc.ataChapter) {
            groupKey = `ATA ${proc.ataChapter} - ${proc.system}`
        } else {
            groupKey = proc.system
        }

        if (!acc[groupKey]) acc[groupKey] = []
        acc[groupKey].push(proc)
        return acc
    }, {} as Record<string, Procedure[]>)

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner": return "bg-green-500/10 text-green-500 border-green-500/20"
            case "intermediate": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
            case "advanced": return "bg-red-500/10 text-red-500 border-red-500/20"
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "aircraft": return <Plane className="h-4 w-4" />
            case "automotive": return <Car className="h-4 w-4" />
            case "marine": return <Ship className="h-4 w-4" />
            case "electric": return <Zap className="h-4 w-4" />
            default: return <BookOpen className="h-4 w-4" />
        }
    }

    const procedureCounts = {
        all: ALL_PROCEDURES.length,
        aircraft: ALL_PROCEDURES.filter(p => p.category === "aircraft").length,
        automotive: ALL_PROCEDURES.filter(p => p.category === "automotive").length,
        marine: ALL_PROCEDURES.filter(p => p.category === "marine").length,
        electric: ALL_PROCEDURES.filter(p => p.category === "electric").length,
    }

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Filter by Vehicle Type</CardTitle>
                    <CardDescription>Choose a category to see relevant procedures</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            onClick={() => setSelectedCategory("all")}
                            className="gap-2"
                        >
                            <BookOpen className="h-4 w-4" />
                            All Procedures
                        </Button>
                        <Button
                            variant={selectedCategory === "aircraft" ? "default" : "outline"}
                            onClick={() => setSelectedCategory("aircraft")}
                            className="gap-2"
                        >
                            <Plane className="h-4 w-4" />
                            Aviation
                        </Button>
                        <Button
                            variant={selectedCategory === "automotive" ? "default" : "outline"}
                            onClick={() => setSelectedCategory("automotive")}
                            className="gap-2"
                        >
                            <Car className="h-4 w-4" />
                            Automotive
                        </Button>
                        <Button
                            variant={selectedCategory === "marine" ? "default" : "outline"}
                            onClick={() => setSelectedCategory("marine")}
                            className="gap-2"
                        >
                            <Ship className="h-4 w-4" />
                            Marine
                        </Button>
                        <Button
                            variant={selectedCategory === "electric" ? "default" : "outline"}
                            onClick={() => setSelectedCategory("electric")}
                            className="gap-2"
                        >
                            <Zap className="h-4 w-4" />
                            Electric Vehicles
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search procedures..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Info Banner */}
            <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-400">Learning Resource</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                These procedures help you understand electrical systems when troubleshooting.
                                Always refer to official manuals for your specific vehicle.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Procedures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProcedures.map((procedure) => (
                    <Card
                        key={procedure.id}
                        className="group border-white/5 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-200"
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                    {procedure.title}
                                </CardTitle>
                                <Badge className={cn("flex-shrink-0", getDifficultyColor(procedure.difficulty))}>
                                    {procedure.difficulty}
                                </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {procedure.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{procedure.steps.length} steps</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{procedure.duration}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                    {procedure.system}
                                </Badge>
                                <Link href={`/procedures/${procedure.id}`}>
                                    <Button size="sm" className="gap-1">
                                        View Procedure
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProcedures.length === 0 && (
                <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                    <CardContent className="py-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">No procedures found</p>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search query
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
