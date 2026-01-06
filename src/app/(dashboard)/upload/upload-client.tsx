"use client"

import { useState } from "react"
import Link from "next/link"
import { UploadDropzone } from "@/components/upload/upload-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Plane,
    Car,
    Ship,
    Zap,
    ArrowRight,
    Clock,
    CheckCircle,
    Loader2,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type VehicleType = "AIRCRAFT" | "AUTOMOTIVE" | "MARINE" | "ELECTRIC_VEHICLE"

interface Diagram {
    id: string
    title: string
    fileUrl: string
    vehicleType: VehicleType
    status: string
    createdAt: Date
}

interface UploadPageClientProps {
    userId: string
    initialRecentUploads: Diagram[]
}

const vehicleTypeConfig = {
    AIRCRAFT: {
        label: "Aviation",
        icon: Plane,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        description: "Commercial & private aircraft"
    },
    AUTOMOTIVE: {
        label: "Automotive",
        icon: Car,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        description: "Cars, trucks & motorcycles"
    },
    MARINE: {
        label: "Marine",
        icon: Ship,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        description: "Boats & watercraft"
    },
    ELECTRIC_VEHICLE: {
        label: "Electric",
        icon: Zap,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        description: "EVs & hybrid systems"
    }
}

export function UploadPageClient({ userId, initialRecentUploads }: UploadPageClientProps) {
    const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("AIRCRAFT")
    const [recentUploads, setRecentUploads] = useState(initialRecentUploads)

    const refreshRecentUploads = async () => {
        // Refresh the page to get updated data
        window.location.reload()
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Upload Diagrams
                </h1>
                <p className="text-lg text-muted-foreground">
                    Upload wiring diagrams and let AI analyze them instantly
                </p>
            </div>

            {/* Vehicle Type Selection */}
            <Card className="border-white/10 bg-card/40 backdrop-blur">
                <CardHeader>
                    <CardTitle>Select Vehicle Type</CardTitle>
                    <CardDescription>
                        Choose the type of vehicle for accurate AI analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={selectedVehicleType} onValueChange={(v) => setSelectedVehicleType(v as VehicleType)}>
                        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white/5">
                            {Object.entries(vehicleTypeConfig).map(([key, config]) => {
                                const Icon = config.icon
                                return (
                                    <TabsTrigger
                                        key={key}
                                        value={key}
                                        className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary/10"
                                    >
                                        <Icon className={cn("w-6 h-6", config.color)} />
                                        <div className="text-center">
                                            <div className="font-semibold">{config.label}</div>
                                            <div className="text-xs text-muted-foreground hidden sm:block">
                                                {config.description}
                                            </div>
                                        </div>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>

                        {Object.keys(vehicleTypeConfig).map((key) => (
                            <TabsContent key={key} value={key} className="mt-6">
                                <UploadDropzone
                                    vehicleType={key}
                                    onUploadComplete={refreshRecentUploads}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            {/* Recent Uploads */}
            {recentUploads.length > 0 && (
                <Card className="border-white/10 bg-card/40 backdrop-blur">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Uploads</CardTitle>
                                <CardDescription>
                                    Your latest uploaded diagrams
                                </CardDescription>
                            </div>
                            <Button variant="link" asChild>
                                <Link href="/diagrams" className="text-primary">
                                    View All <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentUploads.map((diagram) => {
                                const config = vehicleTypeConfig[diagram.vehicleType]
                                const Icon = config.icon

                                return (
                                    <div
                                        key={diagram.id}
                                        className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-primary/30"
                                    >
                                        {/* Icon */}
                                        <div className={cn("p-3 rounded-xl shrink-0", config.bgColor)}>
                                            <Icon className={cn("w-5 h-5", config.color)} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                                {diagram.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {config.label}
                                                </Badge>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(diagram.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            {diagram.status === "COMPLETED" ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Ready
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                    Processing
                                                </Badge>
                                            )}

                                            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                                                <Link href={`/diagrams/${diagram.id}`}>
                                                    <Sparkles className="w-3 h-3 mr-2" />
                                                    Analyze
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {recentUploads.length === 0 && (
                <Card className="border-white/10 bg-card/40 backdrop-blur border-dashed">
                    <CardContent className="text-center py-12">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Upload your first wiring diagram to get started with AI analysis
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
