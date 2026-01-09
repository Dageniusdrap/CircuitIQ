"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Zap, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Component {
    id: string
    name: string
    type: string
    location?: string
    connections?: string[]
}

interface WireTracingProps {
    diagramId: string
    onHighlight?: (componentIds: string[]) => void
}

export function WireTracing({ diagramId, onHighlight }: WireTracingProps) {
    const [components, setComponents] = useState<Component[]>([])
    const [loading, setLoading] = useState(false)
    const [extracting, setExtracting] = useState(false)
    const [tracing, setTracing] = useState(false)
    const [startComponent, setStartComponent] = useState<string>("")
    const [endComponent, setEndComponent] = useState<string>("")
    const [tracedPath, setTracedPath] = useState<any>(null)

    // Extract components on mount
    useEffect(() => {
        extractComponents()
    }, [diagramId])

    const extractComponents = async () => {
        setExtracting(true)
        try {
            const response = await fetch('/api/wire-trace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'extract_components',
                    diagramId,
                }),
            })

            if (!response.ok) throw new Error('Failed to extract components')

            const data = await response.json()
            setComponents(data.components || [])

            if (data.components.length === 0) {
                toast.info('No components detected in diagram')
            } else {
                toast.success(`Found ${data.components.length} components!`)
            }
        } catch (error) {
            console.error('Error extracting components:', error)
            toast.error('Failed to extract components')
        } finally {
            setExtracting(false)
        }
    }

    const tracePath = async () => {
        if (!startComponent || !endComponent) {
            toast.error('Please select both start and end components')
            return
        }

        if (startComponent === endComponent) {
            toast.error('Start and end components must be different')
            return
        }

        setTracing(true)
        setTracedPath(null)

        try {
            const response = await fetch('/api/wire-trace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'trace_path',
                    diagramId,
                    startComponent,
                    endComponent,
                }),
            })

            if (!response.ok) throw new Error('Failed to trace path')

            const data = await response.json()

            if (data.success && data.path) {
                setTracedPath(data.path)
                toast.success('Path traced successfully!')

                // Highlight components in path
                if (onHighlight && data.path.path) {
                    onHighlight(data.path.path)
                }
            } else {
                toast.error(data.error || 'Could not find path')
            }
        } catch (error) {
            console.error('Error tracing path:', error)
            toast.error('Failed to trace wire path')
        } finally {
            setTracing(false)
        }
    }

    const resetTrace = () => {
        setTracedPath(null)
        setStartComponent("")
        setEndComponent("")
        if (onHighlight) {
            onHighlight([])
        }
    }

    return (
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400" />
                        <h3 className="font-semibold text-lg">Interactive Wire Tracing</h3>
                    </div>
                    {extracting && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Extracting...
                        </div>
                    )}
                </div>

                {components.length === 0 && !extracting ? (
                    <div className="text-center py-6 space-y-2">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No components detected yet
                        </p>
                        <Button
                            onClick={extractComponents}
                            variant="outline"
                            size="sm"
                        >
                            Retry Extraction
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">
                                    Start Point
                                </label>
                                <Select
                                    value={startComponent}
                                    onValueChange={setStartComponent}
                                    disabled={extracting || tracing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select component..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {components.map((component) => (
                                            <SelectItem key={component.id} value={component.id}>
                                                {component.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">
                                    End Point
                                </label>
                                <Select
                                    value={endComponent}
                                    onValueChange={setEndComponent}
                                    disabled={extracting || tracing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select component..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {components.map((component) => (
                                            <SelectItem key={component.id} value={component.id}>
                                                {component.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={tracePath}
                            disabled={!startComponent || !endComponent || tracing}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500"
                        >
                            {tracing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Tracing Circuit...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Trace Circuit
                                </>
                            )}
                        </Button>

                        {tracedPath && (
                            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="font-medium">Path Found!</span>
                                </div>

                                <div className="text-sm space-y-1">
                                    <div>
                                        <span className="text-muted-foreground">From: </span>
                                        <span className="font-medium">{tracedPath.from.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">To: </span>
                                        <span className="font-medium">{tracedPath.to.name}</span>
                                    </div>
                                    {tracedPath.wireColor && (
                                        <div>
                                            <span className="text-muted-foreground">Wire Color: </span>
                                            <span className="font-medium">{tracedPath.wireColor}</span>
                                        </div>
                                    )}
                                    {tracedPath.wireGauge && (
                                        <div>
                                            <span className="text-muted-foreground">Wire Gauge: </span>
                                            <span className="font-medium">{tracedPath.wireGauge}</span>
                                        </div>
                                    )}
                                    {tracedPath.path && tracedPath.path.length > 0 && (
                                        <div>
                                            <span className="text-muted-foreground">Path: </span>
                                            <span className="font-medium">
                                                {tracedPath.path.length} component{tracedPath.path.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={resetTrace}
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                >
                                    Clear Trace
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
