"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FeaturePreviewModal } from "./feature-preview-modal"
import {
    Upload,
    Brain,
    MessageSquare,
    BookOpen,
    Zap,
    Shield,
    Layers,
    Search,
    ArrowRight,
    Eye
} from "lucide-react"

const FEATURES = [
    {
        icon: Upload,
        title: "Smart Upload",
        description: "Upload PDF, images, or CAD files. Our AI extracts components and connections automatically.",
        gradient: "from-blue-500 to-cyan-500",
        href: "/upload",
        previewKey: "upload",
    },
    {
        icon: Brain,
        title: "AI Analysis",
        description: "GPT-4 Vision identifies components, traces circuits, and suggests potential issues.",
        gradient: "from-purple-500 to-pink-500",
        href: "/dashboard",
        previewKey: "dashboard",
    },
    {
        icon: MessageSquare,
        title: "Diagnostic Chat",
        description: "Describe symptoms and get step-by-step troubleshooting guidance in plain language.",
        gradient: "from-amber-500 to-orange-500",
        href: "/diagnostics",
        previewKey: "diagnostics",
    },
    {
        icon: BookOpen,
        title: "Procedure Library",
        description: "Built-in procedures for all ATA chapters, automotive systems, and marine equipment.",
        gradient: "from-emerald-500 to-teal-500",
        href: "/procedures",
        previewKey: "procedures",
    },
    {
        icon: Layers,
        title: "Multi-Industry",
        description: "Aircraft, automotive, marine, and electric vehicles - all in one platform.",
        gradient: "from-rose-500 to-red-500",
        href: "/diagrams",
        previewKey: "diagrams",
    },
    {
        icon: Search,
        title: "Smart Search",
        description: "Find any component, wire, or system across all your uploaded diagrams instantly.",
        gradient: "from-indigo-500 to-blue-500",
        href: "/search",
        previewKey: "search",
    },
    {
        icon: Zap,
        title: "Instant Results",
        description: "Get answers in seconds, not hours. Reduce diagnostic time by up to 70%.",
        gradient: "from-yellow-500 to-amber-500",
        href: "/dashboard",
        previewKey: "dashboard",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "SOC 2 compliant, encrypted storage, and role-based access control.",
        gradient: "from-slate-500 to-zinc-500",
        href: "/pricing",
        previewKey: "pricing",
    },
]

export function FeaturesSection() {
    const { data: session } = useSession()
    const [previewFeature, setPreviewFeature] = useState<string | null>(null)

    const handleCardClick = (feature: typeof FEATURES[0], e: React.MouseEvent) => {
        // If user is logged in, navigate directly
        if (session?.user) {
            return // Let the Link handle navigation
        }

        // If not logged in, show preview modal
        e.preventDefault()
        setPreviewFeature(feature.previewKey)
    }

    return (
        <section id="features" className="py-24 bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
                        Powerful Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Everything You Need to Diagnose Faster
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Powerful features designed for professional technicians and engineers
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={feature.href}
                                    className="block h-full"
                                    onClick={(e) => handleCardClick(feature, e)}
                                >
                                    <Card className="h-full border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1">
                                        <CardContent className="p-6 space-y-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                                                {feature.title}
                                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            </h3>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                            <div className="pt-2">
                                                <span className="text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                                    {session?.user ? (
                                                        <>
                                                            Open feature
                                                            <ArrowRight className="h-3 w-3" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-3 w-3" />
                                                            Preview feature
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Feature Preview Modal */}
            <FeaturePreviewModal
                isOpen={!!previewFeature}
                onClose={() => setPreviewFeature(null)}
                feature={previewFeature || ""}
            />
        </section>
    )
}
