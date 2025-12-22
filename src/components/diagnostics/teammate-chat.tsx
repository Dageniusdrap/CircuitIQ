"use client"

import { useState, useRef, useEffect } from "react"
// import { nanoid } from "nanoid" // nanoid is ESM, may need dynamic import or use uuid. Next.js handles it usually. 
// If nanoid fails, I'll replace with simple random.
import { nanoid } from "nanoid"
import {
    Send,
    Mic,
    Camera,
    Image as ImageIcon,
    Loader2,
    Lightbulb,
    Wrench,
    AlertCircle,
    CheckCircle,
    ThumbsUp,
    ThumbsDown,
    RotateCcw,
    Zap,
    MessageSquare,
    FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    tone?: string
    timestamp: string
    diagnosticData?: any
    testProcedure?: any
    progressUpdate?: any
    quickSuggestions?: string[]
}

interface TeammateChatProps {
    diagramId?: string
    vehicleInfo: {
        make: string
        model: string
        year?: number
        type: "aircraft" | "automotive" | "marine"
    }
    onComponentHighlight?: (components: string[]) => void
}

export function TeammateChat({ diagramId, vehicleInfo, onComponentHighlight }: TeammateChatProps) {
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
                }),
            })

            if (!response.ok) throw new Error("Failed to communicate with teammate")

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
            console.error("Error communicating:", error)
            toast.error("Connection issue. Let me try to reconnect...")

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

    // Handle photo upload
    const handlePhotoUpload = async (file: File) => {
        if (!file) return

        // Create preview message
        const photoMessage: Message = {
            id: nanoid(),
            role: "user",
            content: `[Shared photo: ${file.name}]`,
            timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, photoMessage])
        setIsTyping(true)

        try {
            // Upload to your storage (UploadThing, S3, etc.)
            const formData = new FormData()
            formData.append("file", file)

            // For demo, we'll use a placeholder URL
            const imageUrl = URL.createObjectURL(file)

            const response = await fetch("/api/teammate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    action: "photo",
                    imageUrl,
                    techComment: input || "Check this out",
                }),
            })

            const data = await response.json()

            setMessages((prev) => [
                ...prev,
                {
                    id: nanoid(),
                    role: "assistant",
                    content: data.message,
                    tone: data.tone,
                    timestamp: data.timestamp,
                },
            ])
        } catch (error) {
            toast.error("Couldn't analyze photo. Try again?")
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

        const recognition = new (window as any).webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)

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
        <div className="flex h-full flex-col lg:flex-row h-[600px] border border-slate-800 rounded-lg overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-950">
                {/* Header */}
                <div className="bg-slate-950 border-b border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center">
                                <Zap size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    AI Diagnostic Partner
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                        Online
                                    </Badge>
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {vehicleInfo.make} {vehicleInfo.model} Expert
                                </p>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" className="hover:bg-slate-800">
                            <RotateCcw size={18} className="text-slate-400" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 border border-slate-700 text-slate-200'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                {msg.quickSuggestions && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {msg.quickSuggestions.map((suggestion, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-slate-700"
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
                            <div className="bg-slate-800 rounded-lg p-3 flex gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                <span className="text-sm text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon size={20} className="text-slate-400" />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleVoiceInput}
                            className={isListening ? "bg-red-500/10 text-red-500" : ""}
                        >
                            <Mic size={20} className={isListening ? "animate-pulse" : "text-slate-400"} />
                        </Button>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Describe the problem or share an observation..."
                            className="min-h-[50px] max-h-[150px] resize-none"
                        />
                        <Button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}>
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Side Panel (Context) - Hidden on mobile */}
            <div className="w-80 bg-slate-900 border-l border-slate-800 hidden lg:block p-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Diagnostic Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-400">
                            {messages[messages.length - 1]?.diagnosticData?.currentHypothesis ? (
                                <div>
                                    <p className="font-medium text-slate-200">Current Hypothesis:</p>
                                    <p>{messages[messages.length - 1].diagnosticData.currentHypothesis}</p>
                                    <Progress className="mt-2" value={messages[messages.length - 1].diagnosticData.confidence} />
                                </div>
                            ) : (
                                "Tracking progress..."
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
