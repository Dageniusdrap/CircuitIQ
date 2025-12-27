import { Metadata } from "next"
import Link from "next/link"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BookOpen,
    Zap,
    Upload,
    MessageSquare,
    Search,
    Code,
    ArrowRight,
    ExternalLink,
    FileText,
    Video,
    Terminal
} from "lucide-react"

export const metadata: Metadata = {
    title: "Documentation | CircuitIQ",
    description: "Learn how to use CircuitIQ with our comprehensive documentation",
}

const QUICK_START = [
    { step: 1, title: "Create an account", description: "Sign up for free and verify your email" },
    { step: 2, title: "Upload your first diagram", description: "Drag and drop a PDF or image file" },
    { step: 3, title: "Start a diagnostic session", description: "Describe your issue and let AI guide you" },
    { step: 4, title: "Follow the procedures", description: "Execute step-by-step diagnostics" }
]

const DOC_SECTIONS = [
    {
        icon: Zap,
        title: "Getting Started",
        description: "Quick start guide and basic concepts",
        links: [
            { name: "Quick Start Guide", href: "#" },
            { name: "Account Setup", href: "#" },
            { name: "Dashboard Overview", href: "#" },
            { name: "Basic Navigation", href: "#" }
        ]
    },
    {
        icon: Upload,
        title: "Working with Diagrams",
        description: "Upload, organize, and analyze diagrams",
        links: [
            { name: "Supported Formats", href: "#" },
            { name: "Uploading Diagrams", href: "#" },
            { name: "Diagram Organization", href: "#" },
            { name: "Bulk Import", href: "#" }
        ]
    },
    {
        icon: MessageSquare,
        title: "AI Diagnostics",
        description: "Leverage AI for troubleshooting",
        links: [
            { name: "Starting a Session", href: "#" },
            { name: "Interpreting Results", href: "#" },
            { name: "Advanced Queries", href: "#" },
            { name: "Best Practices", href: "#" }
        ]
    },
    {
        icon: FileText,
        title: "Procedures",
        description: "Work with diagnostic procedures",
        links: [
            { name: "Procedure Library", href: "#" },
            { name: "Creating Procedures", href: "#" },
            { name: "ATA Chapters", href: "#" },
            { name: "Custom Templates", href: "#" }
        ]
    },
    {
        icon: Code,
        title: "API Reference",
        description: "Integrate CircuitIQ into your systems",
        links: [
            { name: "Authentication", href: "#" },
            { name: "Endpoints Overview", href: "#" },
            { name: "Rate Limits", href: "#" },
            { name: "Webhooks", href: "#" }
        ]
    },
    {
        icon: Terminal,
        title: "Integrations",
        description: "Connect with other tools",
        links: [
            { name: "MRO Systems", href: "#" },
            { name: "Fleet Management", href: "#" },
            { name: "SSO Setup", href: "#" },
            { name: "Export Options", href: "#" }
        ]
    }
]

export default function DocsPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
                            <BookOpen className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Documentation</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Learn CircuitIQ
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Everything you need to know to get the most out of CircuitIQ
                        </p>
                    </div>

                    {/* Quick Start */}
                    <Card className="border-slate-700/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm mb-12">
                        <CardContent className="p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-400" />
                                Quick Start
                            </h2>
                            <div className="grid md:grid-cols-4 gap-4">
                                {QUICK_START.map((item) => (
                                    <div key={item.step} className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center mx-auto mb-3">
                                            {item.step}
                                        </div>
                                        <h3 className="font-medium text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-slate-400">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-6">
                                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white">
                                    Start the Tutorial
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Doc Sections */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {DOC_SECTIONS.map((section) => {
                            const Icon = section.icon
                            return (
                                <Card key={section.title} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-purple-500/30 transition-colors group">
                                    <CardContent className="p-6">
                                        <div className="p-3 rounded-xl bg-purple-500/10 w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                                            <Icon className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-2">{section.title}</h3>
                                        <p className="text-sm text-slate-400 mb-4">{section.description}</p>
                                        <ul className="space-y-2">
                                            {section.links.map((link) => (
                                                <li key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-sm text-slate-300 flex items-center gap-2 hover:text-purple-400 transition-colors"
                                                    >
                                                        <ArrowRight className="h-3 w-3" />
                                                        {link.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* API Docs Link */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-xl bg-amber-500/10">
                                    <Code className="h-8 w-8 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">API Documentation</h2>
                                    <p className="text-slate-400">Full API reference for developers</p>
                                </div>
                            </div>
                            <Link href="/api-docs">
                                <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                                    View API Docs
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
