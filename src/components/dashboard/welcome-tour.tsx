"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Upload,
    MessageSquare,
    Search,
    FileText,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Zap,
    Check,
} from "lucide-react"

interface TourStep {
    title: string
    description: string
    icon: React.ReactNode
    gradient: string
    features: string[]
}

const TOUR_STEPS: TourStep[] = [
    {
        title: "Welcome to CircuitIQ!",
        description: "Your AI-powered wiring diagnostic platform. Let's take a quick tour of the key features.",
        icon: <Sparkles className="h-8 w-8" />,
        gradient: "from-blue-500 to-cyan-500",
        features: [
            "AI-powered diagram analysis",
            "Interactive diagnostic chat",
            "Searchable component database",
            "Step-by-step repair procedures",
        ],
    },
    {
        title: "Smart Upload",
        description: "Upload wiring diagrams in PDF, PNG, or DWG format. Our AI automatically extracts components and connections.",
        icon: <Upload className="h-8 w-8" />,
        gradient: "from-emerald-500 to-teal-500",
        features: [
            "Drag & drop file upload",
            "AI component extraction",
            "Wire routing analysis",
            "Automatic indexing",
        ],
    },
    {
        title: "AI Diagnostics",
        description: "Chat with your AI diagnostic assistant to troubleshoot issues. Describe symptoms and get step-by-step solutions.",
        icon: <MessageSquare className="h-8 w-8" />,
        gradient: "from-purple-500 to-pink-500",
        features: [
            "Natural language queries",
            "Context-aware responses",
            "Test procedure suggestions",
            "Part recommendations",
        ],
    },
    {
        title: "Smart Search",
        description: "Search across all your diagrams, components, and procedures. Find what you need in seconds.",
        icon: <Search className="h-8 w-8" />,
        gradient: "from-amber-500 to-orange-500",
        features: [
            "Full-text search",
            "Component filtering",
            "Cross-diagram results",
            "Pin number lookup",
        ],
    },
    {
        title: "Procedure Library",
        description: "Access a comprehensive library of repair procedures, test protocols, and best practices.",
        icon: <FileText className="h-8 w-8" />,
        gradient: "from-red-500 to-rose-500",
        features: [
            "Step-by-step guides",
            "Safety precautions",
            "Required tools list",
            "Expected values",
        ],
    },
]

export function WelcomeTour() {
    const { data: session } = useSession()
    const [showTour, setShowTour] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        // Check if this is a demo user on their first visit
        if (!session?.user) return

        const tourKey = `circuitiq_tour_shown_${session.user.id}`
        const hasSeenTour = localStorage.getItem(tourKey)

        if (!hasSeenTour) {
            // Show tour after a short delay
            const timer = setTimeout(() => setShowTour(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [session?.user])

    const handleComplete = () => {
        if (session?.user?.id) {
            localStorage.setItem(`circuitiq_tour_shown_${session.user.id}`, "true")
        }
        setShowTour(false)
    }

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSkip = () => {
        handleComplete()
    }

    const step = TOUR_STEPS[currentStep]

    return (
        <Dialog open={showTour} onOpenChange={setShowTour}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
                {/* Header with gradient */}
                <div className={cn(
                    "p-6 bg-gradient-to-r text-white",
                    step.gradient
                )}>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            {step.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{step.title}</h2>
                            <p className="text-sm text-white/80">
                                Step {currentStep + 1} of {TOUR_STEPS.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-400">
                        {step.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {step.features.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50"
                            >
                                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-sm text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 pt-2">
                        {TOUR_STEPS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={cn(
                                    "h-2 rounded-full transition-all",
                                    i === currentStep
                                        ? "w-6 bg-blue-500"
                                        : "w-2 bg-slate-600 hover:bg-slate-500"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/50">
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="text-slate-400 hover:text-white"
                    >
                        Skip Tour
                    </Button>

                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            className={cn("bg-gradient-to-r", step.gradient)}
                        >
                            {currentStep === TOUR_STEPS.length - 1 ? (
                                <>
                                    <Zap className="h-4 w-4 mr-1" />
                                    Get Started
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
