import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plane, Car, Ship, Zap, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Diagram {
    id: string
    title: string
    vehicleType: string
    status: string
    createdAt: Date
}

interface RecentDocumentsProps {
    diagrams: Diagram[]
    title?: string
    maxItems?: number
}

const vehicleIcons = {
    AIRCRAFT: Plane,
    AUTOMOTIVE: Car,
    MARINE: Ship,
    ELECTRIC_VEHICLE: Zap,
}

export function RecentDocuments({ diagrams, title = "Recent Documents", maxItems = 8 }: RecentDocumentsProps) {
    const displayDiagrams = diagrams.slice(0, maxItems)

    return (
        <Card className="border-white/10 bg-card/40">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>Your recently uploaded diagrams</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/diagrams">
                            View All <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {displayDiagrams.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No documents yet</p>
                        <Button variant="link" asChild className="mt-2">
                            <Link href="/upload">Upload your first diagram</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayDiagrams.map((diagram) => {
                            const Icon = vehicleIcons[diagram.vehicleType as keyof typeof vehicleIcons] || FileText

                            return (
                                <Link
                                    key={diagram.id}
                                    href={`/diagrams/${diagram.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-primary/30"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{diagram.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(diagram.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {diagram.status}
                                    </Badge>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
