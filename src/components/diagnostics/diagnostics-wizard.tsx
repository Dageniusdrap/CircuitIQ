"use client"

import { useState, useRef, useEffect } from "react"
import { startDiagnosis, continueDiagnosis } from "@/actions/analysis"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Bot, Send, User, Wrench, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DiagnosticsWizardProps {
    diagramId: string
    vehicleInfo?: string
}

export function DiagnosticsWizard({ diagramId, vehicleInfo }: DiagnosticsWizardProps) {
    const [symptom, setSymptom] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisId, setAnalysisId] = useState<string | null>(null)
    const [history, setHistory] = useState<{ role: string, content: string }[]>([])
    const [probableCauses, setProbableCauses] = useState<any[]>([])
    const [suggestedTests, setSuggestedTests] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleStartDiagnosis = async () => {
        if (!symptom.trim()) return

        setIsAnalyzing(true)
        try {
            const result = await startDiagnosis(diagramId, symptom)
            setAnalysisId(result.analysisId)
            setProbableCauses(result.initialResponse.probableCauses || [])
            setSuggestedTests(result.initialResponse.suggestedTests || [])
            setHistory(result.history)
        } catch (error) {
            toast.error("Failed to start diagnosis. Please try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !analysisId) return

        const userMsg = newMessage
        setNewMessage("")
        setHistory(prev => [...prev, { role: "user", content: userMsg }])

        try {
            const result = await continueDiagnosis(analysisId, userMsg)
            setHistory(result.history)
        } catch (error) {
            toast.error("Failed to send message")
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [history])

    if (!analysisId) {
        return (
            <Card className="h-full border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-400" />
                        AI Diagnostics
                    </CardTitle>
                    <CardDescription>
                        Describe the issue with the {vehicleInfo || "system"} to start a guided troubleshooting session.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="e.g., The left headlight is dim and flickers when I hit a bump..."
                        className="min-h-[120px] bg-slate-950 border-slate-800"
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                    />
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-500"
                        onClick={handleStartDiagnosis}
                        disabled={isAnalyzing || !symptom.trim()}
                    >
                        {isAnalyzing ? "Analyzing Circuit Logic..." : "Start Diagnostics"}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Left Col: Analysis Results */}
            <div className="lg:col-span-1 space-y-4 h-full flex flex-col">
                <Card className="bg-slate-900/50 border-slate-800 flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            Probable Causes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                                {probableCauses.map((cause, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-slate-200">{cause.cause}</span>
                                            <Badge variant="outline" className={cn(
                                                "text-[10px]",
                                                cause.likelihood === "High" ? "text-red-400 border-red-900" : "text-yellow-400 border-yellow-900"
                                            )}>
                                                {cause.likelihood}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">{cause.reason}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-emerald-500" />
                            Recommended Tests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                                {suggestedTests.map((test, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-medium text-slate-400">
                                            {test.step}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{test.title}</p>
                                            <p className="text-xs text-slate-400 mt-1">{test.instruction}</p>
                                            {test.expected && (
                                                <div className="mt-2 text-xs bg-slate-900/50 p-1.5 rounded text-slate-500">
                                                    Expected: <span className="text-slate-300">{test.expected}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Right Col: Chat Interface */}
            <Card className="lg:col-span-2 border-slate-800 bg-slate-900/50 flex flex-col h-full overflow-hidden">
                <CardHeader className="border-b border-slate-800 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-500" />
                            <div>
                                <CardTitle className="text-base">Diagnostic Assistant</CardTitle>
                                <CardDescription className="text-xs">AI-Guided Troubleshooting</CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setAnalysisId(null)}>
                            Reset
                        </Button>
                    </div>
                </CardHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {history.map((msg, idx) => (
                        <div key={idx} className={cn(
                            "flex gap-3 max-w-[80%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        )}>
                            <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                msg.role === "user" ? "bg-blue-600" : "bg-slate-700"
                            )}>
                                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-lg text-sm",
                                msg.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-200"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type your findings (e.g., 'Voltage is 0V')..."
                            className="bg-slate-950 border-slate-700"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button size="icon" onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-500">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
