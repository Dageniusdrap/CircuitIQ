"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    FileText,
    X,
    AlertCircle,
    Sparkles
} from "lucide-react"
import Link from "next/link"

export interface UploadFileStatus {
    name: string
    url: string
    key: string
    status: "uploading" | "processing" | "completed" | "error"
    progress: number
    diagramId?: string
    size?: number // in bytes
    uploadSpeed?: number // in bytes per second
    timeStarted?: number // timestamp
    error?: string
}

interface UploadProgressItemProps {
    file: UploadFileStatus
    onRemove?: () => void
}

export function UploadProgressItem({ file, onRemove }: UploadProgressItemProps) {
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)

    useEffect(() => {
        if (file.status === "uploading" && file.timeStarted) {
            const interval = setInterval(() => {
                const elapsed = Date.now() - file.timeStarted!
                setTimeElapsed(elapsed)

                // Calculate estimated time remaining
                if (file.progress > 0 && file.size && file.uploadSpeed) {
                    const remainingBytes = file.size * (1 - file.progress / 100)
                    const timeLeft = remainingBytes / file.uploadSpeed
                    setEstimatedTimeRemaining(timeLeft)
                }
            }, 500)

            return () => clearInterval(interval)
        }
    }, [file.status, file.timeStarted, file.progress, file.size, file.uploadSpeed])

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return "Unknown size"
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const formatTime = (ms: number): string => {
        const seconds = Math.floor(ms / 1000)
        if (seconds < 60) return `${seconds}s`
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}m ${remainingSeconds}s`
    }

    const getStatusConfig = () => {
        switch (file.status) {
            case "uploading":
                return {
                    icon: <Loader2 className="h-5 w-5 animate-spin" />,
                    bgColor: "bg-blue-500/10",
                    textColor: "text-blue-500",
                    borderColor: "border-blue-500/20",
                    label: "Uploading",
                    description: estimatedTimeRemaining
                        ? `${formatTime(estimatedTimeRemaining * 1000)} remaining`
                        : "Uploading to secure cloud..."
                }
            case "processing":
                return {
                    icon: <Sparkles className="h-5 w-5 animate-pulse" />,
                    bgColor: "bg-purple-500/10",
                    textColor: "text-purple-500",
                    borderColor: "border-purple-500/20",
                    label: "AI Analyzing",
                    description: "Extracting components and connections..."
                }
            case "completed":
                return {
                    icon: <CheckCircle2 className="h-5 w-5" />,
                    bgColor: "bg-emerald-500/10",
                    textColor: "text-emerald-500",
                    borderColor: "border-emerald-500/20",
                    label: "Complete",
                    description: "Ready for analysis"
                }
            case "error":
                return {
                    icon: <AlertCircle className="h-5 w-5" />,
                    bgColor: "bg-red-500/10",
                    textColor: "text-red-500",
                    borderColor: "border-red-500/20",
                    label: "Failed",
                    description: file.error || "Upload failed"
                }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border transition-all duration-300",
                "bg-slate-900/40 backdrop-blur-sm",
                file.status === "completed" ? "border-emerald-500/20 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5" :
                    file.status === "error" ? "border-red-500/20" :
                        "border-slate-800 hover:border-slate-700"
            )}
        >
            {/* Animated gradient background for active uploads */}
            {(file.status === "uploading" || file.status === "processing") && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer pointer-events-none" />
            )}

            <div className="relative p-4 space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Status Icon */}
                        <div className={cn(
                            "p-2 rounded-lg shrink-0 transition-colors",
                            statusConfig.bgColor,
                            statusConfig.textColor
                        )}>
                            {statusConfig.icon}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-sm text-slate-200 truncate group-hover:text-white transition-colors">
                                    {file.name}
                                </h4>
                                {onRemove && file.status !== "uploading" && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={onRemove}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>

                            {/* Status and File Details */}
                            <div className="flex items-center gap-2 text-xs">
                                <span className={cn(
                                    "font-medium px-2 py-0.5 rounded-full",
                                    statusConfig.bgColor,
                                    statusConfig.textColor
                                )}>
                                    {statusConfig.label}
                                </span>
                                {file.size && (
                                    <span className="text-slate-500">
                                        {formatFileSize(file.size)}
                                    </span>
                                )}
                                {file.status === "uploading" && file.uploadSpeed && (
                                    <span className="text-slate-500">
                                        • {formatFileSize(file.uploadSpeed)}/s
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-500">
                                {statusConfig.description}
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    {file.status === "completed" && file.diagramId && (
                        <Button
                            asChild
                            size="sm"
                            className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 h-8 gap-2"
                        >
                            <Link href={`/diagrams/${file.diagramId}`}>
                                View
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Progress Bar - Only show for uploading */}
                {file.status === "uploading" && (
                    <div className="space-y-1.5">
                        <div className="relative">
                            <Progress
                                value={file.progress}
                                className="h-2 bg-slate-800"
                            />
                            {/* Animated glow effect on progress bar */}
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{file.progress}%</span>
                            {estimatedTimeRemaining && (
                                <span>{formatTime(estimatedTimeRemaining * 1000)} left</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Processing indicator - indeterminate progress */}
                {file.status === "processing" && (
                    <div className="space-y-1.5">
                        <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-slow" />
                            <div className="absolute h-full w-1/3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-slide-progress" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
