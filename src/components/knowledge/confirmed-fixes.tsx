"use client"

import { useState, useEffect } from "react"
import { getConfirmedFixes } from "@/actions/knowledge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Wrench, Clock, DollarSign, CheckCircle2 } from "lucide-react"

interface ConfirmedFixesPanelProps {
    symptom?: string
    vehicleModel?: string
}

export function ConfirmedFixesPanel({ symptom, vehicleModel }: ConfirmedFixesPanelProps) {
    const [fixes, setFixes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (symptom && vehicleModel) {
            setLoading(true)
            getConfirmedFixes(symptom, vehicleModel).then(data => {
                setFixes(data)
                setLoading(false)
            })
        }
    }, [symptom, vehicleModel])

    if (!symptom) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                <h3 className="font-bold text-lg">Community Confirmed Fixes</h3>
            </div>

            {loading ? (
                <div className="text-sm text-slate-500 animate-pulse">Searching knowledge base...</div>
            ) : fixes.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 text-center text-slate-400 text-sm">
                        No community fixes found for this specific symptom yet.
                    </CardContent>
                </Card>
            ) : (
                fixes.map(fix => (
                    <Card key={fix.id} className="bg-emerald-950/20 border-emerald-900/50 hover:bg-emerald-950/30 transition-colors">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-emerald-100">{fix.componentName}</h4>
                                <Badge variant="secondary" className="bg-emerald-900 text-emerald-200 hover:bg-emerald-800">
                                    {fix.votes} Verified
                                </Badge>
                            </div>

                            <p className="text-sm text-slate-300">{fix.fixDescription}</p>

                            <div className="flex gap-4 text-xs text-slate-400 pt-2 border-t border-emerald-900/30">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {fix.averageTime} mins
                                </span>
                                <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> ${fix.averageCost}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Wrench className="h-3 w-3" /> {fix.difficulty}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}

            {/* Demo Fix for Showcase if DB empty */}
            {fixes.length === 0 && !loading && (
                <Card className="bg-emerald-950/20 border-emerald-900/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] px-2 py-0.5 font-bold uppercase">
                        Demo Example
                    </div>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-emerald-100">Replace Landing Gear Relay R5</h4>
                            <Badge variant="secondary" className="bg-emerald-900 text-emerald-200">
                                124 Verified
                            </Badge>
                        </div>

                        <p className="text-sm text-slate-300">
                            Corrosion on pin 87 causes intermittent open circuit during deployment. Relocating ground point G4 prevents recurrence.
                        </p>

                        <div className="flex gap-4 text-xs text-slate-400 pt-2 border-t border-emerald-900/30">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 45 mins
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> $125.00
                            </span>
                            <span className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" /> Medium
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
