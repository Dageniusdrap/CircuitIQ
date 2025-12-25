"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Zap,
    AlertTriangle,
    CheckCircle,
    Info,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Eye,
    EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WireTrace {
    id: string
    from: string
    to: string
    path: { x: number; y: number }[]
    status: "normal" | "warning" | "critical" | "good"
    voltage?: number
    current?: number
    resistance?: number
    notes?: string
}

interface VisualWireTracerProps {
    imageUrl: string
    traces?: WireTrace[]
    onTraceClick?: (trace: WireTrace) => void
}

export function VisualWireTracer({ imageUrl, traces = [], onTraceClick }: VisualWireTracerProps) {
    const [selectedTrace, setSelectedTrace] = useState<WireTrace | null>(null)
    const [showAllTraces, setShowAllTraces] = useState(true)
    const [zoom, setZoom] = useState(100)
    const [showOverlay, setShowOverlay] = useState(true)

    const getStatusColor = (status: WireTrace["status"]) => {
        switch (status) {
            case "good":
                return "rgb(34, 197, 94)" // green-500
            case "normal":
                return "rgb(59, 130, 246)" // blue-500
            case "warning":
                return "rgb(251, 191, 36)" // amber-400
            case "critical":
                return "rgb(239, 68, 68)" // red-500
            default:
                return "rgb(148, 163, 184)" // slate-400
        }
    }

    const getStatusIcon = (status: WireTrace["status"]) => {
        switch (status) {
            case "good":
                return <CheckCircle className="h-4 w-4" />
            case "normal":
                return <Info className="h-4 w-4" />
            case "warning":
                return <AlertTriangle className="h-4 w-4" />
            case "critical":
                return <Zap className="h-4 w-4" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    const handleTraceClick = (trace: WireTrace) => {
        setSelectedTrace(trace)
        onTraceClick?.(trace)
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Visual Wire Tracer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={showOverlay ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowOverlay(!showOverlay)}
                            className="gap-2"
                        >
                            {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {showOverlay ? "Hide" : "Show"} Traces
                        </Button>
                        <Button
                            variant={showAllTraces ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowAllTraces(!showAllTraces)}
                            className="gap-2"
                        >
                            {showAllTraces ? "Selected Only" : "Show All"}
                        </Button>
                        <div className="flex items-center gap-2 ml-auto">
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => setZoom(Math.max(50, zoom - 10))}
                                disabled={zoom <= 50}
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                                {zoom}%
                            </span>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => setZoom(Math.min(200, zoom + 10))}
                                disabled={zoom >= 200}
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => setZoom(100)}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Diagram with Overlay */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                <div
                    className="relative"
                    style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'top left',
                        width: `${100 * (100 / zoom)}%`
                    }}
                >
                    {/* Base Image */}
                    <img
                        src={imageUrl}
                        alt="Wiring Diagram"
                        className="w-full h-auto"
                    />

                    {/* SVG Overlay for traces */}
                    {showOverlay && (
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ zIndex: 10 }}
                        >
                            {traces.map((trace) => {
                                const shouldShow = showAllTraces || selectedTrace?.id === trace.id
                                if (!shouldShow) return null

                                const isSelected = selectedTrace?.id === trace.id
                                const color = getStatusColor(trace.status)

                                return (
                                    <g key={trace.id}>
                                        {/* Trace path */}
                                        <path
                                            d={`M ${trace.path.map(p => `${p.x},${p.y}`).join(' L ')}`}
                                            stroke={color}
                                            strokeWidth={isSelected ? 4 : 2}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={cn(
                                                "transition-all duration-200",
                                                isSelected && "drop-shadow-[0_0_8px_currentColor]"
                                            )}
                                            style={{
                                                pointerEvents: 'auto',
                                                cursor: 'pointer',
                                                filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none'
                                            }}
                                            onClick={() => handleTraceClick(trace)}
                                        />

                                        {/* Start point */}
                                        <circle
                                            cx={trace.path[0].x}
                                            cy={trace.path[0].y}
                                            r={isSelected ? 6 : 4}
                                            fill={color}
                                            className="transition-all duration-200"
                                        />

                                        {/* End point */}
                                        <circle
                                            cx={trace.path[trace.path.length - 1].x}
                                            cy={trace.path[trace.path.length - 1].y}
                                            r={isSelected ? 6 : 4}
                                            fill={color}
                                            className="transition-all duration-200"
                                        />
                                    </g>
                                )
                            })}
                        </svg>
                    )}
                </div>
            </div>

            {/* Trace List */}
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Traced Connections ({traces.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {traces.map((trace) => (
                            <div
                                key={trace.id}
                                onClick={() => handleTraceClick(trace)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                                    selectedTrace?.id === trace.id
                                        ? "bg-primary/10 border-primary"
                                        : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: getStatusColor(trace.status) }}
                                            />
                                            <span className="font-medium text-sm truncate">
                                                {trace.from} → {trace.to}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            {trace.voltage !== undefined && (
                                                <span>{trace.voltage}V</span>
                                            )}
                                            {trace.current !== undefined && (
                                                <span>{trace.current}A</span>
                                            )}
                                            {trace.resistance !== undefined && (
                                                <span>{trace.resistance}Ω</span>
                                            )}
                                        </div>

                                        {trace.notes && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {trace.notes}
                                            </p>
                                        )}
                                    </div>

                                    <Badge
                                        variant={trace.status === "critical" ? "destructive" : "secondary"}
                                        className={cn(
                                            "gap-1 flex-shrink-0",
                                            trace.status === "good" && "bg-green-500/10 text-green-500 border-green-500/20",
                                            trace.status === "warning" && "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}
                                    >
                                        {getStatusIcon(trace.status)}
                                        {trace.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Selected Trace Details */}
            {selectedTrace && (
                <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {getStatusIcon(selectedTrace.status)}
                            Connection Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-muted-foreground">From</p>
                                <p className="font-semibold">{selectedTrace.from}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">To</p>
                                <p className="font-semibold">{selectedTrace.to}</p>
                            </div>
                        </div>

                        {(selectedTrace.voltage !== undefined ||
                            selectedTrace.current !== undefined ||
                            selectedTrace.resistance !== undefined) && (
                                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                                    {selectedTrace.voltage !== undefined && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Voltage</p>
                                            <p className="font-semibold text-blue-400">{selectedTrace.voltage}V</p>
                                        </div>
                                    )}
                                    {selectedTrace.current !== undefined && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Current</p>
                                            <p className="font-semibold text-amber-400">{selectedTrace.current}A</p>
                                        </div>
                                    )}
                                    {selectedTrace.resistance !== undefined && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Resistance</p>
                                            <p className="font-semibold text-purple-400">{selectedTrace.resistance}Ω</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        {selectedTrace.notes && (
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-xs text-muted-foreground mb-1">Analysis Notes</p>
                                <p className="text-sm">{selectedTrace.notes}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                            <Badge
                                className={cn(
                                    "gap-1",
                                    selectedTrace.status === "critical" && "bg-red-500/20 text-red-400 border-red-500/30",
                                    selectedTrace.status === "warning" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                    selectedTrace.status === "good" && "bg-green-500/20 text-green-400 border-green-500/30",
                                    selectedTrace.status === "normal" && "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                )}
                            >
                                {getStatusIcon(selectedTrace.status)}
                                Status: {selectedTrace.status.toUpperCase()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
