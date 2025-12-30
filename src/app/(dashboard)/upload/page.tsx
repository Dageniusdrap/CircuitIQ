import { Metadata } from "next"
import { UploadZone } from "@/components/upload/upload-zone"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { DeleteButton } from "@/components/upload/delete-button"

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
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Your Recent Uploads</h2>
                        <Button variant="link" asChild className="text-blue-400">
                            <Link href="/diagrams">View All Library <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {recentUploads.map((diagram) => (
                            <div
                                key={diagram.id}
                                className="group flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                                            {diagram.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(diagram.createdAt), { addSuffix: true })}
                                            </span>
                                            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                                                {diagram.vehicleType}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {diagram.status === "COMPLETED" ? (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                                            <CheckCircle className="h-3 w-3" />
                                            Processed
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">
                                            <Clock className="h-3 w-3" />
                                            {diagram.status === "PROCESSING" ? "Analyzing..." : "Pending"}
                                        </div>
                                    )}

                                    <Button asChild size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/diagnostics?diagramId=${diagram.id}`}>
                                            Diagnose
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline" className="h-8">
                                        <Link href={`/diagrams/${diagram.id}`}>
                                            View
                                        </Link>
                                    </Button>

                                    <DeleteButton diagramId={diagram.id} title={diagram.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
