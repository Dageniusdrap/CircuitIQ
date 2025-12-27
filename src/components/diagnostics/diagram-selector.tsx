"use client"

import { useState } from "react"
import { Diagram } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, ChevronRight, ArrowRight, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DiagramSelectorProps {
    diagrams: Diagram[]
}

export function DiagramSelector({ diagrams }: DiagramSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const filteredDiagrams = diagrams.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.system.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight">Select a Diagram to Diagnose</h2>
                <p className="text-muted-foreground">
                    Choose a wiring diagram to start a collaborative troubleshooting session with your AI teammate.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search by title, model, or system..."
                            className="pl-10 bg-slate-800 border-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                    {filteredDiagrams.length > 0 ? (
                        filteredDiagrams.map(diagram => (
                            <div
                                key={diagram.id}
                                onClick={() => router.push(`/diagnostics?diagramId=${diagram.id}`)}
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                                            {diagram.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <span className="font-medium bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-slate-700">
                                                {diagram.system}
                                            </span>
                                            • {diagram.model} ({diagram.year})
                                        </p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 space-y-4">
                            <div className="p-4 rounded-full bg-slate-800/50 w-fit mx-auto">
                                <Search className="h-8 w-8 text-slate-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-slate-300">No diagrams found</p>
                                <p className="text-sm text-slate-500">
                                    {searchQuery ? `No results for "${searchQuery}"` : "You haven't uploaded any diagrams yet."}
                                </p>
                            </div>
                            {!searchQuery && (
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/upload">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload New Diagram
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-500">
                    Select a diagram to load context for the AI Diagnostic Assistant
                </div>
            </div>

            <div className="flex gap-4">
                <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
                    <Link href="/upload">Upload New</Link>
                </Button>
                <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
                    <Link href="/diagrams">Browse Library</Link>
                </Button>
            </div>
        </div>
    )
}
