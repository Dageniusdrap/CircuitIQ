"use client"

import { useState } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Upload,
    Brain,
    MessageSquare,
    BookOpen,
    Search,
    Zap,
    Shield,
    Layers,
    ArrowRight,
    Sparkles,
    CheckCircle,
    Play,
    X,
    FileText,
    Cpu,
    Mic,
    Camera,
    LucideIcon
} from "lucide-react"

interface FeaturePreviewModalProps {
    isOpen: boolean
    onClose: () => void
    feature: string
}

interface FeatureDemo {
    title: string
    description: string
    icon: LucideIcon
    gradient: string
    benefits: string[]
    demoContent: React.ReactNode
    href: string
    plan: "Free" | "Pro" | "Enterprise"
}

const FEATURE_DEMOS: Record<string, FeatureDemo> = {
    upload: {
        title: "Smart Upload",
        description: "Upload any wiring diagram and let AI extract all components, connections, and systems automatically.",
        icon: Upload,
        gradient: "from-blue-500 to-cyan-500",
        benefits: [
            "Supports PDF, PNG, JPG, CAD files",
            "AI extracts components automatically",
            "Identifies wire connections & routing",
            "Recognizes industry standards (ATA, SAE)"
        ],
        plan: "Free",
        href: "/upload",
        demoContent: (
            <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-8 text-center bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <p className="text-slate-300 mb-2">Drag and drop your wiring diagram</p>
                    <p className="text-sm text-slate-500">or click to browse files</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <Badge variant="outline" className="text-xs">PDF</Badge>
                        <Badge variant="outline" className="text-xs">PNG</Badge>
                        <Badge variant="outline" className="text-xs">JPG</Badge>
                        <Badge variant="outline" className="text-xs">DWG</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                        <Cpu className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">AI Processing</p>
                        <p className="text-xs text-slate-400">Components are extracted in seconds</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Auto</Badge>
                </div>
            </div>
        )
    },
    diagnostics: {
        title: "AI Diagnostics Chat",
        description: "Chat with an AI teammate that understands wiring systems. Describe symptoms and get step-by-step guidance.",
        icon: MessageSquare,
        gradient: "from-amber-500 to-orange-500",
        benefits: [
            "Natural language troubleshooting",
            "Step-by-step repair procedures",
            "Voice input support",
            "Photo analysis for visual issues"
        ],
        plan: "Free",
        href: "/diagnostics",
        demoContent: (
            <div className="space-y-3 max-h-[250px] overflow-hidden">
                {/* User message */}
                <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                        <p className="text-sm">The landing gear indicator light is not coming on</p>
                    </div>
                </div>
                {/* AI response */}
                <div className="flex gap-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 h-fit">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-md max-w-[85%]">
                        <p className="text-sm text-slate-200 mb-2">Let&apos;s troubleshoot this systematically. Here are the first checks:</p>
                        <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                            <li>Verify the circuit breaker CB-12</li>
                            <li>Check the squat switch continuity</li>
                            <li>Test the indicator bulb...</li>
                        </ol>
                    </div>
                </div>
                {/* Quick suggestions */}
                <div className="flex gap-2 flex-wrap pl-10">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                        <Mic className="h-3 w-3 mr-1" /> Voice Input
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                        <Camera className="h-3 w-3 mr-1" /> Upload Photo
                    </Button>
                </div>
            </div>
        )
    },
    procedures: {
        title: "Procedure Library",
        description: "Access built-in maintenance procedures for all ATA chapters, automotive systems, and marine equipment.",
        icon: BookOpen,
        gradient: "from-emerald-500 to-teal-500",
        benefits: [
            "ATA 100 chapter coverage",
            "Automotive OEM procedures",
            "Marine electrical systems",
            "Step-by-step instructions"
        ],
        plan: "Pro",
        href: "/procedures",
        demoContent: (
            <div className="space-y-3">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <FileText className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-200">ATA 24 - Electrical Power</h4>
                                <p className="text-xs text-slate-400">45 procedures available</p>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400">Aircraft</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <FileText className="h-5 w-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-200">Engine Management System</h4>
                                <p className="text-xs text-slate-400">32 procedures available</p>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400">Automotive</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                                <FileText className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-200">Navigation Electronics</h4>
                                <p className="text-xs text-slate-400">28 procedures available</p>
                            </div>
                            <Badge className="bg-cyan-500/20 text-cyan-400">Marine</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    },
    search: {
        title: "Smart Search",
        description: "Find any component, wire, or system across all your uploaded diagrams instantly.",
        icon: Search,
        gradient: "from-indigo-500 to-blue-500",
        benefits: [
            "Search across all diagrams",
            "Find components by part number",
            "Locate wire by color/gauge",
            "Cross-reference systems"
        ],
        plan: "Free",
        href: "/search",
        demoContent: (
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search diagrams, components, systems..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                        defaultValue="landing gear"
                    />
                </div>
                <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-medium text-slate-200">Landing Gear System - B737</span>
                            </div>
                            <Badge variant="outline" className="text-xs">Diagram</Badge>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-medium text-slate-200">Gear Position Sensor - P/N 123-456</span>
                            </div>
                            <Badge variant="outline" className="text-xs">Component</Badge>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    dashboard: {
        title: "System Analysis Dashboard",
        description: "See how components interact, understand failure impacts, and get automatic bypass procedures.",
        icon: Brain,
        gradient: "from-purple-500 to-pink-500",
        benefits: [
            "Visual dependency mapping",
            "Failure impact analysis",
            "Automatic bypass suggestions",
            "Real-time system status"
        ],
        plan: "Pro",
        href: "/dashboard",
        demoContent: (
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-blue-400">12</p>
                            <p className="text-xs text-slate-400">Diagrams</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-emerald-400">156</p>
                            <p className="text-xs text-slate-400">Components</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-amber-400">48</p>
                            <p className="text-xs text-slate-400">Analyses</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-slate-200">Recent Analysis</span>
                    </div>
                    <p className="text-xs text-slate-400">Fuel System - Identified 3 potential failure points</p>
                </div>
            </div>
        )
    },
    diagrams: {
        title: "Multi-Industry Support",
        description: "Work with aircraft, automotive, marine, and electric vehicle diagrams all in one platform.",
        icon: Layers,
        gradient: "from-rose-500 to-red-500",
        benefits: [
            "Aircraft (ATA standards)",
            "Automotive (OEM/Aftermarket)",
            "Marine vessels",
            "Electric vehicles"
        ],
        plan: "Free",
        href: "/diagrams",
        demoContent: (
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">✈️</div>
                        <p className="text-sm font-medium text-slate-200">Aircraft</p>
                        <p className="text-xs text-slate-400">ATA 100 compliant</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">🚗</div>
                        <p className="text-sm font-medium text-slate-200">Automotive</p>
                        <p className="text-xs text-slate-400">SAE standards</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">⛵</div>
                        <p className="text-sm font-medium text-slate-200">Marine</p>
                        <p className="text-xs text-slate-400">NMEA compatible</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">⚡</div>
                        <p className="text-sm font-medium text-slate-200">Electric</p>
                        <p className="text-xs text-slate-400">EV systems</p>
                    </CardContent>
                </Card>
            </div>
        )
    },
    pricing: {
        title: "Enterprise Security",
        description: "SOC 2 compliant infrastructure with encrypted storage and role-based access control.",
        icon: Shield,
        gradient: "from-slate-500 to-zinc-500",
        benefits: [
            "SOC 2 Type II compliant",
            "End-to-end encryption",
            "Role-based access control",
            "Audit logging"
        ],
        plan: "Enterprise",
        href: "/pricing",
        demoContent: (
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-emerald-300">SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-blue-300">AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Layers className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-purple-300">Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <FileText className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-amber-300">Complete Audit Trails</span>
                </div>
            </div>
        )
    }
}

export function FeaturePreviewModal({ isOpen, onClose, feature }: FeaturePreviewModalProps) {
    const demo = FEATURE_DEMOS[feature]

    if (!demo) return null

    const Icon = demo.icon
    const planColors = {
        Free: "bg-emerald-500/20 text-emerald-400",
        Pro: "bg-blue-500/20 text-blue-400",
        Enterprise: "bg-purple-500/20 text-purple-400"
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${demo.gradient}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl text-white">{demo.title}</DialogTitle>
                            <Badge className={planColors[demo.plan]}>{demo.plan} Plan</Badge>
                        </div>
                    </div>
                    <DialogDescription className="text-slate-300">
                        {demo.description}
                    </DialogDescription>
                </DialogHeader>

                {/* Interactive Demo */}
                <div className="my-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Play className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-400">Interactive Preview</span>
                    </div>
                    {demo.demoContent}
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">What you&apos;ll get</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {demo.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-sm text-slate-300">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-4">
                    <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600">
                        <Link href="/register">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Get Started Free
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                        <Link href="/login">
                            Sign In
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export { FEATURE_DEMOS }
