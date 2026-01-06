"use client"

import { useState } from "react"
import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Zap, FileUp, Sparkles, Plane, Car, Ship, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { UploadProgressItem, type UploadFileStatus } from "./upload-progress-item"

type VehicleType = "AIRCRAFT" | "AUTOMOTIVE" | "MARINE" | "ELECTRIC_VEHICLE"

interface PendingFile {
    name: string
    url: string
    key: string
    size?: number
    diagramId?: string
    vehicleType: VehicleType
}

export function UploadZone() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadFileStatus[]>([])
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
    const [isHovering, setIsHovering] = useState(false)
    const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("AIRCRAFT")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleConfirmUpload = async () => {
        if (pendingFiles.length === 0) return

        setIsProcessing(true)
        toast.info("Starting AI analysis for all files...")

        // Move pending files to processing state
        const processingFiles: UploadFileStatus[] = pendingFiles.map(file => ({
            name: file.name,
            url: file.url,
            key: file.key,
            status: "processing" as const,
            progress: 100,
            diagramId: file.diagramId,
            size: file.size,
            timeStarted: Date.now()
        }))

        setUploadedFiles(prev => [...prev, ...processingFiles])
        setPendingFiles([]) // Clear pending files

        // Import the server action dynamically
        const { refreshUploadPage } = await import("@/actions/upload")
        await refreshUploadPage()

        // Process each file
        for (const file of processingFiles) {
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
                await refreshUploadPage()
            } catch (error) {
                console.error("Analysis failed:", error)
                setUploadedFiles(prev =>
                    prev.map(f => f.diagramId === file.diagramId ? { ...f, status: "error" } : f)
                )
                const msg = error instanceof Error ? error.message : "Unknown error"
                toast.error(`${file.name}: Analysis Failed - ${msg}`)
            }
        }

        setIsProcessing(false)
        toast.success("All files processed!")
    }

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return "Unknown size"
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const getVehicleIcon = (type: VehicleType) => {
        switch (type) {
            case "AIRCRAFT": return <Plane className="h-4 w-4" />
            case "AUTOMOTIVE": return <Car className="h-4 w-4" />
            case "MARINE": return <Ship className="h-4 w-4" />
            case "ELECTRIC_VEHICLE": return <Zap className="h-4 w-4" />
        }
    }

    const getVehicleColor = (type: VehicleType) => {
        switch (type) {
            case "AIRCRAFT": return "text-blue-400 bg-blue-500/10"
            case "AUTOMOTIVE": return "text-orange-400 bg-orange-500/10"
            case "MARINE": return "text-cyan-400 bg-cyan-500/10"
            case "ELECTRIC_VEHICLE": return "text-green-400 bg-green-500/10"
        }
    }

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

            {/* Current Upload in Progress - Shows DURING upload */}
            {uploadedFiles.some(f => f.status === "uploading") && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold text-blue-300">Current Upload in Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.filter(f => f.status === "uploading").map((file, index) => {
                            const progressValue = file.progress || 0
                            return (
                                <Card key={file.name + index} className="border-blue-500/30 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                                    <CardContent className="p-5 space-y-3">
                                        {/* File Info Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                {/* Upload Icon */}
                                                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                                                    <Upload className="h-6 w-6" />
                                                </div>
                                                {/* File Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base text-slate-100 truncate">
                                                        {file.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 mt-0.5">
                                                        File Format: {file.name.split('.').pop()?.toUpperCase()} • File Size: {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Cancel Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => {
                                                    setUploadedFiles(prev => prev.filter((_, i) => {
                                                        const uploadingFiles = prev.filter(f => f.status === "uploading")
                                                        return uploadingFiles[index] !== prev[i]
                                                    }))
                                                    toast.info(`Cancelled ${file.name}`)
                                                }}
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="relative h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
                                                    style={{ width: `${progressValue}%` }}
                                                >
                                                    {/* Shimmer effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">Uploading...</span>
                                                <span className="text-blue-400 font-semibold">{progressValue}%</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

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
                                    // Add uploaded files to pending state for user confirmation
                                    const newPendingFiles: PendingFile[] = res.map(file => ({
                                        name: file.name,
                                        url: file.url,
                                        key: file.key,
                                        size: file.size,
                                        diagramId: (file.serverData as { diagramId?: string })?.diagramId,
                                        vehicleType: selectedVehicleType
                                    }))

                                    setPendingFiles(prev => [...prev, ...newPendingFiles])
                                    toast.success(`${res.length} file(s) uploaded successfully!`)
                                    toast.info("Review your files and click 'Confirm & Process All' to start AI analysis")
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

            {/* Pending Files Confirmation Card */}
            {pendingFiles.length > 0 && (
                <Card className="border-blue-500/30 bg-blue-500/5 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-blue-400" />
                                    Review & Confirm Upload
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {pendingFiles.length} file{pendingFiles.length !== 1 ? 's' : ''} ready for AI analysis
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPendingFiles([])
                                        toast.info("Upload cancelled")
                                    }}
                                    disabled={isProcessing}
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel All
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleConfirmUpload}
                                    disabled={isProcessing}
                                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isProcessing ? "Processing..." : `Confirm & Process All (${pendingFiles.length})`}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {pendingFiles.map((file, index) => (
                                <div
                                    key={file.key || index}
                                    className="group flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Vehicle Type Icon */}
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            getVehicleColor(file.vehicleType)
                                        )}>
                                            {getVehicleIcon(file.vehicleType)}
                                        </div>

                                        {/* File Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-slate-200 truncate">
                                                {file.name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full font-medium",
                                                    getVehicleColor(file.vehicleType)
                                                )}>
                                                    {file.vehicleType.replace("_", " ")}
                                                </span>
                                                <span>•</span>
                                                <span>{formatFileSize(file.size)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        onClick={() => {
                                            setPendingFiles(prev => prev.filter((_, i) => i !== index))
                                            toast.info(`Removed ${file.name}`)
                                        }}
                                        disabled={isProcessing}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-start gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                                <p className="text-blue-300">
                                    <strong>Next Step:</strong> Click "Confirm & Process All" to start AI analysis.
                                    Our AI will extract components, trace connections, and identify potential issues in your diagrams.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Processing Queue */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold px-2 flex items-center gap-2">
                        Upload Queue
                        <span className="text-xs font-normal bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                            {uploadedFiles.filter(f => f.status === "completed").length}/{uploadedFiles.length}
                        </span>
                    </h3>
                    <div className="grid gap-3">
                        {uploadedFiles.map((file, index) => (
                            <UploadProgressItem
                                key={file.key || index}
                                file={file}
                                onRemove={() => {
                                    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
