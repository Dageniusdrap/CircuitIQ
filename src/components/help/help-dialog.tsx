"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    BookOpen,
    Upload,
    Search,
    Zap,
    Settings,
    HelpCircle,
    ChevronRight,
    Home,
    FileText,
    Activity
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HelpTopic {
    id: string
    title: string
    icon: React.ReactNode
    category: "getting-started" | "features" | "troubleshooting" | "advanced"
    content: React.ReactNode
}

const helpTopics: HelpTopic[] = [
    {
        id: "getting-started",
        title: "Getting Started with CircuitIQ",
        icon: <Home className="h-5 w-5" />,
        category: "getting-started",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Welcome to CircuitIQ! Here's how to get started:
                </p>
                <div className="space-y-3">
                    <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold mb-1">1. Upload Your First Diagram</h4>
                        <p className="text-sm text-muted-foreground">
                            Click "Upload" in the sidebar, select your vehicle type (Aviation, Automotive, Marine, or Electric),
                            then drag & drop your wiring diagram. Supported formats: PDF, PNG, JPG.
                        </p>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold mb-1">2. Wait for AI Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                            CircuitIQ uses GPT-4 Vision to analyze your diagram. This typically takes 30-90 seconds.
                            You'll see a "Ready" badge when complete.
                        </p>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold mb-1">3. Start Diagnostics</h4>
                        <p className="text-sm text-muted-foreground">
                            Click "Analyze Now" or navigate to Diagnostics to chat with the AI about your wiring diagram.
                            Describe symptoms and get step-by-step troubleshooting guidance.
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "upload-diagrams",
        title: "How to Upload Diagrams",
        icon: <Upload className="h-5 w-5" />,
        category: "features",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Follow these steps to upload your wiring diagrams:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Badge>Step 1</Badge> Choose Vehicle Type
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Select from Aviation (ATA), Automotive, Marine, or Electric Cars. This helps the AI apply
                        industry-specific analysis standards.
                    </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Badge>Step 2</Badge> Upload Files
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Drag & drop or click to browse. You can upload up to 20 files at once.
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                        <li>PDF: up to 32MB</li>
                        <li>PNG/JPG: up to 16MB</li>
                        <li>DWG: up to 64MB</li>
                    </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Badge>Step 3</Badge> Monitor Progress
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Scroll down to "Recent Uploads" to see your files. Status badges show:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                        <li><strong>Analyzing...</strong> - AI is processing</li>
                        <li><strong>Ready</strong> - Analysis complete, ready to use</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        id: "search-filter",
        title: "Searching and Filtering Diagrams",
        icon: <Search className="h-5 w-5" />,
        category: "features",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Find your diagrams quickly using our powerful search and filtering tools:
                </p>
                <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Category Filtering</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                            On the Diagrams page, click category buttons to filter:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Aviation (ATA)</Badge>
                            <Badge variant="outline">Automotive</Badge>
                            <Badge variant="outline">Marine</Badge>
                            <Badge variant="outline">Electric Cars</Badge>
                        </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Text Search</h4>
                        <p className="text-sm text-muted-foreground">
                            Use the search bar to find diagrams by:
                        </p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                            <li>File name (e.g., "Ford F-150")</li>
                            <li>Manufacturer (e.g., "Boeing", "Tesla")</li>
                            <li>System name (e.g., "Hydraulic", "APU")</li>
                            <li>ATA codes (e.g., "24", "29")</li>
                        </ul>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Global Search</h4>
                        <p className="text-sm text-muted-foreground">
                            Click "Search" in the sidebar to search across ALL diagrams and extracted components.
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "ai-diagnostics",
        title: "Using AI Diagnostics",
        icon: <Zap className="h-5 w-5" />,
        category: "features",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Get AI-powered troubleshooting assistance for your wiring diagrams:
                </p>
                <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Starting a Session</h4>
                        <p className="text-sm text-muted-foreground">
                            Navigate to Diagnostics → Select a diagram → Click "Start Diagnostic"
                        </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Asking Questions</h4>
                        <p className="text-sm text-muted-foreground mb-2">Be specific for best results:</p>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <Badge variant="outline" className="text-green-600">Good</Badge>
                                <p className="text-sm">"What would cause the fuel pump relay to not energize during engine start?"</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Badge variant="outline" className="text-red-600">Bad</Badge>
                                <p className="text-sm">"Why isn't it working?"</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">What AI Can Help With</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>Probable causes for symptoms</li>
                            <li>Test procedures for components</li>
                            <li>Wire tracing and continuity checks</li>
                            <li>Relay and circuit breaker locations</li>
                            <li>Power distribution analysis</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "upload-not-appearing",
        title: "Upload Not Appearing",
        icon: <HelpCircle className="h-5 w-5" />,
        category: "troubleshooting",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    If your uploaded file isn't showing in "Recent Uploads":
                </p>
                <div className="space-y-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Quick Fix
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Refresh the page (Cmd/Ctrl + R). Most upload issues are resolved by a simple refresh.
                        </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Other Solutions</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                            <li>Check your internet connection during upload</li>
                            <li>Ensure file size is within limits (32MB for PDF)</li>
                            <li>Try a different browser (Chrome/Firefox recommended)</li>
                            <li>Clear browser cache and cookies</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "ai-analysis-failed",
        title: "AI Analysis Failed",
        icon: <HelpCircle className="h-5 w-5" />,
        category: "troubleshooting",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    If analysis fails or takes too long:
                </p>
                <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Common Causes</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                            <li><strong>Low image quality:</strong> Use scans with minimum 1200px width</li>
                            <li><strong>Not a wiring diagram:</strong> AI only processes electrical schematics</li>
                            <li><strong>File corrupted:</strong> Try re-uploading from original source</li>
                            <li><strong>Complex diagram:</strong> Multi-system diagrams may take 2-3 minutes</li>
                        </ul>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Resolution Steps</h4>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                            <li>Delete the failed upload</li>
                            <li>Ensure file is a clear, readable wiring diagram</li>
                            <li>Re-upload with high-resolution version</li>
                            <li>Wait up to 3 minutes for complex diagrams</li>
                        </ol>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "keyboard-shortcuts",
        title: "Keyboard Shortcuts",
        icon: <Settings className="h-5 w-5" />,
        category: "advanced",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Speed up your workflow with these keyboard shortcuts:
                </p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Command Palette</span>
                        <Badge variant="outline">Cmd/Ctrl + K</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Toggle Sidebar</span>
                        <Badge variant="outline">Cmd/Ctrl + /</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Close Modals</span>
                        <Badge variant="outline">Esc</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Search Diagrams</span>
                        <Badge variant="outline">Cmd/Ctrl + F</Badge>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "best-practices",
        title: "Best Practices for AI Analysis",
        icon: <FileText className="h-5 w-5" />,
        category: "advanced",
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Get the most accurate AI analysis with these tips:
                </p>
                <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">File Naming</h4>
                        <div className="space-y-2">
                            <div>
                                <Badge variant="outline" className="text-red-600 mb-1">Bad</Badge>
                                <p className="text-sm text-muted-foreground">diagram1.pdf</p>
                            </div>
                            <div>
                                <Badge variant="outline" className="text-green-600 mb-1">Good</Badge>
                                <p className="text-sm text-muted-foreground">Boeing 737 APU Start Circuit.pdf</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Image Quality</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>Minimum 1200px width for scanned diagrams</li>
                            <li>Ensure text is readable when zoomed</li>
                            <li>Use single-page diagrams (avoid multi-page PDFs)</li>
                            <li>Prefer CAD exports over hand-drawn sketches</li>
                        </ul>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">AI Confidence Scores</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li><strong>90-100%:</strong> Excellent quality, high accuracy</li>
                            <li><strong>70-89%:</strong> Good quality, minor issues</li>
                            <li><strong>50-69%:</strong> Fair quality, verify manually</li>
                            <li><strong>Below 50%:</strong> Re-upload higher resolution</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
    },
]

interface HelpDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
    const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTopics = helpTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const groupedTopics = {
        "getting-started": filteredTopics.filter(t => t.category === "getting-started"),
        "features": filteredTopics.filter(t => t.category === "features"),
        "troubleshooting": filteredTopics.filter(t => t.category === "troubleshooting"),
        "advanced": filteredTopics.filter(t => t.category === "advanced"),
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {selectedTopic ? selectedTopic.title : "Help & Documentation"}
                    </DialogTitle>
                    <DialogDescription>
                        {selectedTopic
                            ? "Learn how to use this feature effectively"
                            : "Find answers to common questions and learn how to use CircuitIQ"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 h-full">
                    {/* Sidebar */}
                    {!selectedTopic && (
                        <div className="w-full space-y-4">
                            <Input
                                placeholder="Search help topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />

                            <ScrollArea className="h-[calc(80vh-180px)]">
                                <div className="space-y-6">
                                    {groupedTopics["getting-started"].length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">
                                                Getting Started
                                            </h3>
                                            <div className="space-y-1">
                                                {groupedTopics["getting-started"].map(topic => (
                                                    <Button
                                                        key={topic.id}
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() => setSelectedTopic(topic)}
                                                    >
                                                        {topic.icon}
                                                        <span className="ml-2">{topic.title}</span>
                                                        <ChevronRight className="ml-auto h-4 w-4" />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {groupedTopics.features.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">
                                                Features
                                            </h3>
                                            <div className="space-y-1">
                                                {groupedTopics.features.map(topic => (
                                                    <Button
                                                        key={topic.id}
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() => setSelectedTopic(topic)}
                                                    >
                                                        {topic.icon}
                                                        <span className="ml-2">{topic.title}</span>
                                                        <ChevronRight className="ml-auto h-4 w-4" />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {groupedTopics.troubleshooting.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">
                                                Troubleshooting
                                            </h3>
                                            <div className="space-y-1">
                                                {groupedTopics.troubleshooting.map(topic => (
                                                    <Button
                                                        key={topic.id}
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() => setSelectedTopic(topic)}
                                                    >
                                                        {topic.icon}
                                                        <span className="ml-2">{topic.title}</span>
                                                        <ChevronRight className="ml-auto h-4 w-4" />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {groupedTopics.advanced.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">
                                                Advanced
                                            </h3>
                                            <div className="space-y-1">
                                                {groupedTopics.advanced.map(topic => (
                                                    <Button
                                                        key={topic.id}
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() => setSelectedTopic(topic)}
                                                    >
                                                        {topic.icon}
                                                        <span className="ml-2">{topic.title}</span>
                                                        <ChevronRight className="ml-auto h-4 w-4" />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* Content */}
                    {selectedTopic && (
                        <div className="w-full space-y-4">
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedTopic(null)}
                                className="mb-4"
                            >
                                ← Back to topics
                            </Button>

                            <ScrollArea className="h-[calc(80vh-180px)]">
                                <div className="pr-4">
                                    {selectedTopic.content}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
