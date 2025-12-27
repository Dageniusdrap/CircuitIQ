import { Metadata } from "next"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Key, Webhook, Terminal, Copy, ExternalLink, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "API Documentation | CircuitIQ",
    description: "Integrate CircuitIQ into your applications with our REST API",
}

const API_ENDPOINTS = [
    {
        method: "POST",
        path: "/api/diagrams",
        description: "Upload a new diagram for analysis"
    },
    {
        method: "GET",
        path: "/api/diagrams/:id",
        description: "Retrieve a specific diagram and its components"
    },
    {
        method: "POST",
        path: "/api/analyze",
        description: "Start an AI analysis session on a diagram"
    },
    {
        method: "GET",
        path: "/api/procedures",
        description: "List available diagnostic procedures"
    },
    {
        method: "POST",
        path: "/api/chat",
        description: "Send a diagnostic query to the AI"
    }
]

const CODE_EXAMPLE = `// Example: Upload a diagram
const response = await fetch('https://api.circuitiq.com/v1/diagrams', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Boeing 737 Electrical',
    file_url: 'https://example.com/diagram.pdf',
    industry: 'aviation'
  })
});

const diagram = await response.json();
console.log(diagram.id); // dia_abc123`

export default function ApiDocsPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                            <Code className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-medium">REST API v1</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            API Documentation
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Integrate CircuitIQ's powerful diagram analysis into your applications
                        </p>
                    </div>

                    {/* Getting Started */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="p-3 rounded-xl bg-amber-500/10 w-fit mb-4">
                                    <Key className="h-6 w-6 text-amber-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Authentication</h3>
                                <p className="text-sm text-slate-400">
                                    Use API keys for authentication. Generate keys from your dashboard.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="p-3 rounded-xl bg-blue-500/10 w-fit mb-4">
                                    <Terminal className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Base URL</h3>
                                <p className="text-sm text-slate-400 font-mono">
                                    https://api.circuitiq.com/v1
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="p-3 rounded-xl bg-purple-500/10 w-fit mb-4">
                                    <Webhook className="h-6 w-6 text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Webhooks</h3>
                                <p className="text-sm text-slate-400">
                                    Receive real-time notifications for analysis completion.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Endpoints */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-white mb-6">API Endpoints</h2>
                            <div className="space-y-3">
                                {API_ENDPOINTS.map((endpoint, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${endpoint.method === 'GET'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="text-slate-200 font-mono text-sm">{endpoint.path}</code>
                                        </div>
                                        <span className="text-sm text-slate-400">{endpoint.description}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Code Example */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-400" />
                                    Quick Example
                                </h2>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <pre className="bg-slate-950 rounded-xl p-6 overflow-x-auto text-sm">
                                <code className="text-slate-300 font-mono">{CODE_EXAMPLE}</code>
                            </pre>
                        </CardContent>
                    </Card>

                    {/* SDKs */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-xl font-bold text-white mb-4">SDKs & Libraries</h2>
                            <p className="text-slate-400 mb-6">
                                Official client libraries for popular languages (coming soon)
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button variant="outline" className="border-slate-600 text-slate-300" disabled>
                                    JavaScript/TypeScript
                                </Button>
                                <Button variant="outline" className="border-slate-600 text-slate-300" disabled>
                                    Python
                                </Button>
                                <Button variant="outline" className="border-slate-600 text-slate-300" disabled>
                                    Go
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
