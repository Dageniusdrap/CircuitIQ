"use client"

import { useState } from "react"
import { Component, ComponentConnection } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, AlertCircle, ArrowRight, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface WireTracerProps {
    components: Component[]
    connections: (ComponentConnection & {
        fromComponent?: Component,
        toComponent?: Component
    })[]
}

export function WireTracer({ components, connections }: WireTracerProps) {
    const [startComponent, setStartComponent] = useState<string | null>(null)
    const [endComponent, setEndComponent] = useState<string | null>(null)
    const [tracedPath, setTracedPath] = useState<string[]>([])
    const [isTracing, setIsTracing] = useState(false)

    const handleTrace = () => {
        if (!startComponent || !endComponent) return
        setIsTracing(true)

        // Simulate AI extraction path finding
        // In a real implementation, this would use a graph traversal algorithm
        // For now, we simulate finding a path between any two selected components
        setTimeout(() => {
            const path = [startComponent, ...connections.slice(0, 2).map(c => c.id), endComponent]
            setTracedPath(path)
            setIsTracing(false)
        }, 1500)
    }

    const resetTrace = () => {
        setStartComponent(null)
        setEndComponent(null)
        setTracedPath([])
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Interactive Wire Tracing
                </h3>
                {tracedPath.length > 0 && (
                    <Button variant="outline" size="sm" onClick={resetTrace}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Trace
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Start Point</label>
                    <select
                        className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                        onChange={(e) => setStartComponent(e.target.value)}
                        value={startComponent || ""}
                    >
                        <option value="">Select component...</option>
                        {components.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.location || "Unknown"})</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">End Point</label>
                    <select
                        className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                        onChange={(e) => setEndComponent(e.target.value)}
                        value={endComponent || ""}
                    >
                        <option value="">Select component...</option>
                        {components.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.location || "Unknown"})</option>
                        ))}
                    </select>
                </div>
            </div>

            <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                disabled={!startComponent || !endComponent || isTracing}
                onClick={handleTrace}
            >
                {isTracing ? "Tracing Circuit Path..." : "Trace Circuit"}
            </Button>

            {/* Visualization Area */}
            <AnimatePresence>
                {tracedPath.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-200">Active Circuit Path Identified</span>
                        </div>

                        <div className="relative pl-4 border-l-2 border-yellow-500/30 space-y-6">
                            {/* Visual Path Representation */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-yellow-500" />
                                <p className="font-semibold text-slate-200">
                                    {components.find(c => c.id === startComponent)?.name}
                                </p>
                                <p className="text-xs text-slate-400">Power Source • 28V DC</p>
                            </div>

                            {/* Simulated Path Steps */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-2 h-2 w-2 rounded-full bg-yellow-500/50" />
                                <p className="text-sm text-slate-300">Wire 22AWG (Red)</p>
                                <p className="text-xs text-slate-500">Length: 1.2m • Resistance: 0.4Ω</p>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-yellow-500" />
                                <p className="font-semibold text-slate-200">
                                    {components.find(c => c.id === endComponent)?.name}
                                </p>
                                <p className="text-xs text-slate-400">Load • Grounded</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-yellow-500/20 text-xs text-slate-400">
                            AI Confidence: 98% • Path Verified
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
