"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plane, Car, Ship, Zap, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Diagram {
    id: string
    title: string
    vehicleType: string
    status: string
    createdAt: Date
}

interface DiagramSelectorWidgetProps {
    diagrams: Diagram[]
    title?: string
    maxItems?: number
    currentDiagramId?: string
}

const vehicleIcons = {
    AIRCRAFT: Plane,
    AUTOMOTIVE: Car,
    MARINE: Ship,
    ELECTRIC_VEHICLE: Zap,
}

export function DiagramSelectorWidget({
    diagrams,
    title = "Switch Diagram",
    maxItems = 8,
    currentDiagramId
}: DiagramSelectorWidgetProps) {
    const displayDiagrams = diagrams.slice(0, maxItems)

    return (
        <Card className="border-white/10 bg-card/40">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-xs">
                    Select a diagram to analyze
                </CardDescription>
            </CardHeader>
            <CardContent>
                {displayDiagrams.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>No diagrams available</p>
                        <Button variant="link" asChild className="mt-2 text-xs">
                            <Link href="/upload">Upload a diagram</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {displayDiagrams.map((diagram) => {
                            const Icon = vehicleIcons[diagram.vehicleType as keyof typeof vehicleIcons] || FileText
                            const isActive = diagram.id === currentDiagramId

                            return (
                                <Link
                                    key={diagram.id}
                                    href={`/diagnostics?diagramId=${diagram.id}`}
                                    className={cn(
                                        "flex items-center gap-2 p-2.5 rounded-lg transition-all duration-200 border text-sm",
                                        isActive
                                            ? "bg-primary/20 border-primary/40 ring-1 ring-primary/30"
                                            : "bg-white/5 hover:bg-white/10 border-white/5 hover:border-primary/20"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg shrink-0",
                                        isActive ? "bg-primary/30" : "bg-primary/10"
                                    )}>
                                        <Icon className={cn(
                                            "w-3.5 h-3.5",
                                            isActive ? "text-primary" : "text-primary/70"
                                        )} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate text-xs leading-tight">
                                                {diagram.title}
                                            </p>
                                            {isActive && (
                                                <Check className="w-3 h-3 text-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                                            {formatDistanceToNow(new Date(diagram.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
