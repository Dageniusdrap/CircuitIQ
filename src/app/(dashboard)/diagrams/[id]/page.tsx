import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Download, Zap, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { WireTracer } from "@/components/diagrams/wire-tracer"
import { DiagnosticsWizard } from "@/components/diagnostics/diagnostics-wizard"

export default async function DiagramDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const diagram = await prisma.diagram.findUnique({
        where: { id },
        include: {
            components: {
                include: {
                    connectionsTo: true,
                    connectionsFrom: true
                }
            },
            analyses: {
                take: 3,
                orderBy: { createdAt: "desc" },
            },
        },
    })

    if (!diagram) return notFound()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{diagram.title}</h1>
                        <Badge variant={diagram.status === "COMPLETED" ? "default" : "secondary"}>
                            {diagram.status}
                        </Badge>
                    </div>
                    <p className="text-slate-400">
                        {diagram.manufacturer} {diagram.model} • {diagram.system}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild variant="default">
                        <Link href={`/diagnostics?diagramId=${diagram.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Start Diagnostic
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col - Image & Visuals */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden bg-slate-950 border-slate-800">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={diagram.fileUrl}
                                alt={diagram.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Card>

                    <Tabs defaultValue="diagnostics" className="w-full">
                        <TabsList className="bg-slate-900">

                            <TabsTrigger value="diagnostics">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Smart Diagnostics
                            </TabsTrigger>
                            <TabsTrigger value="components">Components ({diagram.components.length})</TabsTrigger>
                            <TabsTrigger value="connections">Connections</TabsTrigger>
                        </TabsList>

                        <TabsContent value="diagnostics" className="mt-4">
                            <DiagnosticsWizard
                                diagramId={diagram.id}
                                vehicleInfo={`${diagram.manufacturer} ${diagram.model}`}
                            />
                        </TabsContent>

                        <TabsContent value="components" className="mt-4">
                            <Card>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-800">
                                        {diagram.components.map((comp: any) => (
                                            <div key={comp.id} className="p-4 flex justify-between items-center hover:bg-slate-800/50">
                                                <div>
                                                    <p className="font-medium text-slate-200">{comp.name}</p>
                                                    <p className="text-sm text-slate-500">{comp.type} • {comp.partNumber || "No Part #"}</p>
                                                </div>
                                                <Badge variant="outline">{comp.location || "Unknown Loc"}</Badge>
                                            </div>
                                        ))}
                                        {diagram.components.length === 0 && (
                                            <div className="p-8 text-center text-slate-500">
                                                No components extracted yet.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="connections" className="mt-4">
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-slate-400 text-sm">Connection headers not implemented in demo view.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Col - Info & Actions */}
                {/* Right Col - Info & Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">System Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 block">Vehicle Type</span>
                                    <span className="font-medium">{diagram.vehicleType}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Uploaded By</span>
                                    <span className="font-medium">Admin</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Processing Time</span>
                                    <span className="font-medium">12s</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Confidence</span>
                                    <span className="font-medium text-emerald-400">{(diagram.confidence || 0).toFixed(1)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* NEW: Wire Tracer Module */}
                    <Card className="border-yellow-500/30 bg-yellow-500/5">
                        <CardContent className="p-4">
                            <WireTracer
                                components={diagram.components}
                                // @ts-ignore
                                connections={diagram.components.flatMap((c: any) => c.connectionsTo || [])}
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-900/10 border-blue-900/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="text-blue-400 h-5 w-5" />
                                AI Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-300 mb-4">
                                AI has identified {diagram.components.length} components and potential failure points.
                            </p>
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                                <Link href={`/diagnostics?diagramId=${diagram.id}&intent=analysis`}>
                                    View Full Analysis
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

