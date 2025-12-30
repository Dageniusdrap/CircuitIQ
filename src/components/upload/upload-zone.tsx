"use client"

import { useState } from "react"
import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Upload, CheckCircle, XCircle, Loader2, ArrowRight, Zap, FileUp, Sparkles, Plane, Car, Ship } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface UploadedFile {
    name: string
    url: string
    key: string
    status: "uploading" | "processing" | "completed" | "error"
    progress: number
    diagramId?: string
}

type VehicleType = "AIRCRAFT" | "AUTOMOTIVE" | "MARINE" | "ELECTRIC_VEHICLE"

import { useRouter } from "next/navigation"

export function UploadZone() {
    const router = useRouter()
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isHovering, setIsHovering] = useState(false)
    const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("AIRCRAFT")

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Vehicle Type Selector */}
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Select Vehicle Type</CardTitle>
                    <CardDescription>Choose the category for your wiring diagrams</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button
                            variant={selectedVehicleType === "AIRCRAFT" ? "default" : "outline"}
                            onClick={() => setSelectedVehicleType("AIRCRAFT")}
                            className="h-auto flex-col gap-2 py-4"
                        >
                            <Plane className="h-6 w-6" />
                            <span className="text-sm font-semibold">Aviation</span>
                        </Button>
                        <Button
                            variant={selectedVehicleType === "AUTOMOTIVE" ? "default" : "outline"}
                            onClick={() => setSelectedVehicleType("AUTOMOTIVE")}
                            className="h-auto flex-col gap-2 py-4"
                        >
                            <Car className="h-6 w-6" />
                            <span className="text-sm font-semibold">Automotive</span>
                        </Button>
                        <Button
                            variant={selectedVehicleType === "MARINE" ? "default" : "outline"}
                            onClick={() => setSelectedVehicleType("MARINE")}
                            className="h-auto flex-col gap-2 py-4"
                        >
                            <Ship className="h-6 w-6" />
                            <span className="text-sm font-semibold">Marine</span>
                        </Button>
                        <Button
                            variant={selectedVehicleType === "ELECTRIC_VEHICLE" ? "default" : "outline"}
                            onClick={() => setSelectedVehicleType("ELECTRIC_VEHICLE")}
                            className="h-auto flex-col gap-2 py-4"
                        >
                            <Zap className="h-6 w-6" />
                            <span className="text-sm font-semibold">Electric Cars</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Hero Upload Card */}
            <div className="relative group rounded-3xl p-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent hover:via-primary/80 transition-all duration-500">
                <div className={cn(
                    "relative rounded-[23px] bg-slate-950/80 backdrop-blur-xl overflow-hidden transition-all duration-500",
                    isHovering ? "shadow-2xl shadow-primary/20" : "shadow-xl"
                )}>
                    {/* Animated Background Mesh */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                    <div className="relative p-10 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="p-4 rounded-full bg-primary/10 ring-1 ring-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <div className="p-4 rounded-full bg-gradient-to-tr from-primary to-blue-400 shadow-lg shadow-primary/30">
                                <Upload className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2 max-w-lg mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                                Upload Wiring Diagrams
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Drag & drop your PDF, PNG, or DWG files here to instantly analyze with AI.
                            </p>
                            <p className="text-sm text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full inline-block">
                                ✨ Batch Upload Supported (Up to 20 files at once)
                            </p>
                        </div>

                        <div
                            className="w-full max-w-2xl mx-auto"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <UploadDropzone
                                endpoint="diagramUploader"
                                input={{ vehicleType: selectedVehicleType }}
                                className="border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 rounded-2xl transition-all duration-300 min-h-[250px] flex flex-col items-center justify-center ut-label:text-lg ut-label:font-semibold ut-label:text-foreground ut-allowed-content:text-muted-foreground ut-allowed-content:text-sm ut-button:!bg-primary ut-button:hover:!bg-primary/90 ut-button:!text-white ut-button:!font-semibold ut-button:!shadow-lg ut-button:!shadow-primary/25 ut-button:hover:!shadow-primary/40 ut-button:!transition-all ut-button:!duration-200 ut-button:!px-8 ut-button:!py-3 ut-button:!rounded-xl ut-button:!border-0 ut-button:active:!scale-[0.98] ut-button:!text-sm ut-upload-icon:text-primary/60 ut-upload-icon:!w-8 ut-upload-icon:!h-8"
                                onClientUploadComplete={async (res) => {
                                    // 1. Mark as processing locally
                                    const newFiles: UploadedFile[] = res.map(file => ({
                                        name: file.name,
                                        url: file.url,
                                        key: file.key,
                                        status: "processing", // Start as processing (AI analysis)
                                        progress: 100,
                                        diagramId: (file.serverData as { diagramId?: string })?.diagramId
                                    }))

                                    setUploadedFiles(prev => {
                                        const filtered = prev.filter(f => f.status !== "uploading")
                                        return [...filtered, ...newFiles]
                                    })

                                    toast.success("File uploaded successfully!")
                                    toast.info("Starting AI Analysis...")

                                    // 2. Import the server action dynamically to avoid bundling issues
                                    const { refreshUploadPage } = await import("@/actions/upload")

                                    // 3. Refresh Server Data immediately so it shows in the list below
                                    await refreshUploadPage()

                                    // 4. Trigger Analysis for each file
                                    for (const file of newFiles) {
                                        if (!file.diagramId) continue

                                        try {
                                            const analysisRes = await fetch("/api/analyze", {
                                                method: "POST",
                                                body: JSON.stringify({ diagramId: file.diagramId }),
                                                headers: { "Content-Type": "application/json" }
                                            })

                                            if (!analysisRes.ok) {
                                                const errorData = await analysisRes.json()
                                                throw new Error(errorData.error || "Analysis failed")
                                            }

                                            // Success
                                            setUploadedFiles(prev =>
                                                prev.map(f => f.diagramId === file.diagramId ? { ...f, status: "completed" } : f)
                                            )
                                            toast.success(`${file.name}: AI Analysis Complete`)

                                            // Refresh again to show analysis status in list
                                            await refreshUploadPage()
                                        } catch (error) {
                                            console.error("Analysis failed:", error)
                                            // Even if analysis fails, the file is uploaded. We can mark it as completed (uploaded) but maybe with a warning?
                                            // For now, let's mark it as error only for the queue item, but the file exists.

                                            setUploadedFiles(prev =>
                                                prev.map(f => f.diagramId === file.diagramId ? { ...f, status: "error" } : f)
                                            )
                                            const msg = error instanceof Error ? error.message : "Unknown error"
                                            toast.error(`Analysis Failed: ${msg}`)
                                        }
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(`Error: ${error.message}`)
                                    setUploadedFiles(prev => prev.map(f => f.status === "uploading" ? { ...f, status: "error" } : f))
                                }}
                                onUploadBegin={(name) => {
                                    setUploadedFiles(prev => [...prev, {
                                        name,
                                        url: "",
                                        key: "",
                                        status: "uploading",
                                        progress: 0,
                                    }])
                                }}
                                onUploadProgress={(progress) => {
                                    setUploadedFiles(prev => {
                                        const newFiles = [...prev]
                                        const uploadingFile = newFiles.find(f => f.status === "uploading")
                                        if (uploadingFile) {
                                            uploadingFile.progress = progress
                                        }
                                        return newFiles
                                    })
                                }}
                                content={{
                                    label: ({ ready, isUploading }) => {
                                        if (!ready) return "Getting ready..."
                                        if (isUploading) return "Uploading..."
                                        return "Choose file(s) or drag and drop"
                                    },
                                    allowedContent: "PDF, PNG, JPG, or DWG (max 32MB)",
                                    button: ({ ready, isUploading }) => {
                                        if (!ready) return "Preparing..."
                                        if (isUploading) return "Uploading..."
                                        return "Choose Files"
                                    }
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground/60 pt-4">
                            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-400" /> AI Powered Analysis</span>
                            <span className="flex items-center gap-1.5"><Zap size={14} className="text-blue-400" /> Instant Wiring Tracing</span>
                            <span className="flex items-center gap-1.5"><FileUp size={14} className="text-green-400" /> Supports PDF & DWG</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Queue */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold px-2 flex items-center gap-2">
                        Processing Queue
                        <span className="text-xs font-normal bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                            {uploadedFiles.filter(f => f.status === "completed").length}/{uploadedFiles.length}
                        </span>
                    </h3>
                    <div className="grid gap-4">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-2.5 rounded-lg transition-colors",
                                            file.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                                file.status === 'error' ? "bg-red-500/10 text-red-500" :
                                                    "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {file.status === 'completed' ? <CheckCircle className="h-5 w-5" /> :
                                                file.status === 'error' ? <XCircle className="h-5 w-5" /> :
                                                    <Loader2 className="h-5 w-5 animate-spin" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{file.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                {file.status === "uploading" && "Uploading to secure cloud..."}
                                                {file.status === "processing" && "AI analyzing components..."}
                                                {file.status === "completed" && <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready for review</>}
                                                {file.status === "error" && "Upload failed"}
                                            </p>
                                        </div>
                                    </div>

                                    {file.status === "completed" && (
                                        <Button asChild size="sm" variant="glass" className="h-9 gap-2 group/btn">
                                            <Link href={file.diagramId ? `/diagrams/${file.diagramId}` : "/diagrams"}>
                                                Analyze <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {file.status === "uploading" && (
                                    <div className="relative pt-2">
                                        <Progress value={file.progress} className="h-1.5 bg-secondary" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
