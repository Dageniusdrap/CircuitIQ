import { Metadata } from "next"
import { UploadZone } from "@/components/upload/upload-zone"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, ArrowRight, CheckCircle, Plane, Car, Ship, Zap, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { DeleteButton } from "@/components/upload/delete-button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Upload Diagrams | CircuitIQ",
    description: "Upload and process wiring diagrams",
}

export const dynamic = "force-dynamic"

export default async function UploadPage() {
    const recentUploads = await prisma.diagram.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-10">
            <div>
                <h1 className="text-3xl font-bold">Upload Diagrams</h1>
                <p className="text-slate-400 mt-1">
                    Upload and process new wiring diagrams with AI
                </p>
            </div>

            <UploadZone />

            {/* Recent Uploads Section */}
            {recentUploads.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Your Recent Uploads</h2>
                        <Button variant="link" asChild className="text-blue-400">
                            <Link href="/diagrams">View All Library <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        {/* Group uploads by vehicle type - simplistic approach for now since we only fetch 5 recent */}
                        {/* Ideally we would fetch more or group efficiently, but for 'Recent Uploads', a flat list with clear type indicators is also good. 
                            However, the user asked for "sections". Let's visually group them if they are mixed, or just improve the list card.
                            Given the constraint of "take: 5", strictly grouping might result in empty groups.
                            Let's keep the list but make the "Vehicle Type" more prominent and add a specific "Analyze Now" primary action.
                        */}

                        {recentUploads.map((diagram) => (
                            <div
                                key={diagram.id}
                                className="group flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-5 w-full md:w-auto">
                                    <div className={cn(
                                        "p-3 rounded-xl flex items-center justify-center",
                                        diagram.vehicleType === "AIRCRAFT" ? "bg-blue-500/10 text-blue-400" :
                                            diagram.vehicleType === "AUTOMOTIVE" ? "bg-orange-500/10 text-orange-400" :
                                                diagram.vehicleType === "MARINE" ? "bg-cyan-500/10 text-cyan-400" :
                                                    "bg-green-500/10 text-green-400"
                                    )}>
                                        {diagram.vehicleType === "AIRCRAFT" && <Plane className="h-6 w-6" />}
                                        {diagram.vehicleType === "AUTOMOTIVE" && <Car className="h-6 w-6" />}
                                        {diagram.vehicleType === "MARINE" && <Ship className="h-6 w-6" />}
                                        {diagram.vehicleType === "ELECTRIC_VEHICLE" && <Zap className="h-6 w-6" />}
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg text-slate-200 group-hover:text-white transition-colors">
                                            {diagram.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full bg-slate-800">
                                                {diagram.vehicleType.replace("_", " ")}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(diagram.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                                    {diagram.status === "COMPLETED" ? (
                                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Ready
                                        </div>
                                    ) : (
                                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            {diagram.status === "PROCESSING" ? "Analyzing..." : "Pending"}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                                            <Link href={`/diagrams/${diagram.id}`}>
                                                <Sparkles className="mr-2 h-3.5 w-3.5" />
                                                Analyze Now
                                            </Link>
                                        </Button>

                                        <DeleteButton diagramId={diagram.id} title={diagram.title} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
