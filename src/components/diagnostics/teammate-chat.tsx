"use client"

import { useState, useRef, useEffect } from "react"
import { nanoid } from "nanoid"
import {
    Send,
    Mic,
    Image as ImageIcon,
    Loader2,
    Zap,
    RotateCcw,
    Maximize2,
    ExternalLink,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Link from "next/link"

interface DiagnosticData {
    currentHypothesis: string
    confidence: number
}

interface TestProcedure {
    step: string
    instruction: string
}

interface ProgressUpdate {
    status: string
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    tone?: string
    timestamp: string
    diagnosticData?: DiagnosticData
    testProcedure?: TestProcedure
    progressUpdate?: ProgressUpdate
    quickSuggestions?: string[]
}

interface TeammateChatProps {
    diagramId?: string
    diagramUrl?: string // <--- New Prop
    vehicleInfo: {
        make: string
        model: string
        year?: number
        type: "aircraft" | "automotive" | "marine"
    }
    onComponentHighlight?: (components: string[]) => void
}

export function TeammateChat({ vehicleInfo, diagramUrl, onComponentHighlight }: TeammateChatProps) {
    const [sessionId] = useState(() => nanoid())
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nanoid(),
            role: "assistant",
            content: `Hey! I'm your diagnostic teammate. I see we're working on a ${vehicleInfo.make} ${vehicleInfo.model}. What's going on with it today?`,
            tone: "friendly",
            timestamp: new Date().toISOString(),
            quickSuggestions: [
                "System won't activate",
                "Getting unusual readings",
                "Intermittent failure",
                "Need help understanding this circuit"
            ]
        },
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // 🚀 AUTO-ANALYSIS: Automatically analyze diagram when loaded
    useEffect(() => {
        const performAutoAnalysis = async () => {
            // Only run if we have a diagram URL and haven't analyzed yet
            if (!diagramUrl || messages.length > 1) return;

            // Wait a moment for UI to settle
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsTyping(true);

            console.log('[Auto-Analysis] Diagram URL:', diagramUrl);
            console.log('[Auto-Analysis] Testing direct PDF URL with OpenAI...');

            try {
                const response = await fetch("/api/teammate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        action: "photo", // Use photo analysis
                        vehicleInfo,
                        imageUrl: diagramUrl, // Send PDF URL directly
                        analysisType: "comprehensive", // Get full analysis
                    }),
                });

                if (!response.ok) throw new Error("Auto-analysis failed");

                const data = await response.json();

                // Replace initial greeting with analysis results
                const analysisMessage: Message = {
                    id: nanoid(),
                    role: "assistant",
                    content: `📊 **Auto-Analysis Complete**\n\n${data.message}\n\n💬 **Questions?** Feel free to ask anything or let me know if you need help troubleshooting specific issues!`,
                    tone: "professional",
                    timestamp: data.timestamp,
                    diagnosticData: data.diagnosticData,
                    quickSuggestions: [
                        "Explain this in more detail",
                        "What should I test first?",
                        "Help me troubleshoot",
                        "Show me the key components"
                    ],
                };

                setMessages([analysisMessage]);

                // Highlight components if provided
                if (data.highlightComponents && onComponentHighlight) {
                    onComponentHighlight(data.highlightComponents);
                }
            } catch (error) {
                console.error("Auto-analysis error:", error);
                // Keep original greeting if auto-analysis fails
            } finally {
                setIsTyping(false);
            }
        };

        performAutoAnalysis();
    }, [diagramUrl, sessionId, vehicleInfo, onComponentHighlight]); // eslint-disable-line react-hooks/exhaustive-deps


    // Send message to teammate
    const sendMessage = async (messageText?: string) => {
        const textToSend = messageText || input.trim()
        if (!textToSend) return

        // Add user message
        const userMessage: Message = {
            id: nanoid(),
            role: "user",
            content: textToSend,
            timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        try {
            const response = await fetch("/api/teammate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    action: "chat",
                    message: textToSend,
                    vehicleInfo,
                    diagramUrl, // Include diagram URL for vision analysis
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.details || errorData.error || "Failed to communicate with teammate")
            }

            const data = await response.json()

            // Add teammate response
            const teammateMessage: Message = {
                id: nanoid(),
                role: "assistant",
                content: data.message,
                tone: data.tone,
                timestamp: data.timestamp,
                diagnosticData: data.diagnosticData,
                testProcedure: data.testProcedure,
                progressUpdate: data.progressUpdate,
                quickSuggestions: data.quickSuggestions,
            }
            setMessages((prev) => [...prev, teammateMessage])

            // Highlight components if provided
            if (data.highlightComponents && onComponentHighlight) {
                onComponentHighlight(data.highlightComponents)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Connection issue"
            toast.error(`Error: ${errorMessage}`)

            // Add error recovery message
            setMessages((prev) => [
                ...prev,
                {
                    id: nanoid(),
                    role: "assistant",
                    content: "Sorry, I'm having connection issues. Can you repeat that?",
                    tone: "apologetic",
                    timestamp: new Date().toISOString(),
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    // Voice input (using Web Speech API)
    const toggleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window)) {
            toast.error("Voice input not supported in this browser")
            return
        }

        if (isListening) {
            setIsListening(false)
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (window as any).webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput((prev) => prev + " " + transcript)
        }

        recognition.start()
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-4">
            {/* LEFT PANEL: CHAT (35%) */}
            <div className="w-full lg:w-[35%] flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
                {/* Header */}
                <div className="bg-slate-900/50 border-b border-slate-800 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20">
                                <Zap size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                    AI Teammate
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] h-4 px-1">
                                        Active
                                    </Badge>
                                </h3>
                                <p className="text-[10px] text-slate-400">
                                    {vehicleInfo.make} {vehicleInfo.model}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-800" onClick={() => setMessages([])}>
                            <RotateCcw size={14} className="text-slate-400" />
                        </Button>
                    </div>
                </div>

                {/* Status Card (Compact) */}
                <div className="bg-slate-900/30 border-b border-slate-800 p-2">
                    <div className="text-xs text-slate-400">
                        {messages[messages.length - 1]?.diagnosticData?.currentHypothesis ? (
                            <div className="flex items-center gap-2">
                                <ActivityIndicator />
                                <span className="truncate flex-1 font-medium text-slate-300">
                                    {messages[messages.length - 1]?.diagnosticData?.currentHypothesis}
                                </span>
                                <span className="text-emerald-400 font-mono">
                                    {messages[messages.length - 1]?.diagnosticData?.confidence}%
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                                <span>Ready to assist</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] rounded-xl p-3 text-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                : 'bg-slate-800 border border-slate-700/50 text-slate-200 shadow-sm'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                {msg.quickSuggestions && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {msg.quickSuggestions.map((suggestion, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-slate-700 bg-slate-700/50 text-[10px] font-normal py-0.5"
                                                onClick={() => sendMessage(suggestion)}
                                            >
                                                {suggestion}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-slate-800 rounded-xl p-3 flex gap-2 items-center">
                                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-slate-900 border-t border-slate-800">
                    <div className="flex gap-2 items-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={toggleVoiceInput}
                        >
                            <Mic size={18} className={isListening ? "text-red-500 animate-pulse" : "text-slate-400"} />
                        </Button>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            className="min-h-[40px] max-h-[120px] resize-none py-2 text-sm bg-slate-950 border-slate-700 focus:border-blue-500 transition-colors"
                        />
                        <Button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isTyping}
                            className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-500"
                            size="icon"
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: DIAGRAM VIEWER (65%) */}
            <div className="w-full lg:w-[65%] flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between">
                    <h3 className="font-medium text-slate-200 flex items-center gap-2 text-sm">
                        <FileText size={16} className="text-blue-400" />
                        Live Diagram View
                    </h3>
                    <div className="flex gap-2">
                        {diagramUrl && (
                            <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs" asChild>
                                <a href={diagramUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink size={14} /> Open Original
                                </a>
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <Maximize2 size={14} />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-950 relative">
                    {diagramUrl ? (
                        <iframe
                            src={`${diagramUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-0"
                            title="Wiring Diagram"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/50">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-slate-400 mb-2">No Diagram Selected</h3>
                            <p className="text-sm max-w-md">
                                Upload a diagram or select one from the library to view it here while you troubleshoot.
                            </p>
                            <Button variant="outline" className="mt-6 gap-2" asChild>
                                <Link href="/search">
                                    <ExternalLink size={16} /> Select Diagram
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ActivityIndicator() {
    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
    )
}
