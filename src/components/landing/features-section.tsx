"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
    Upload,
    Brain,
    MessageSquare,
    BookOpen,
    Zap,
    Shield,
    Layers,
    Search
} from "lucide-react"

const FEATURES = [
    {
        icon: Upload,
        title: "Smart Upload",
        description: "Upload PDF, images, or CAD files. Our AI extracts components and connections automatically.",
    },
    {
        icon: Brain,
        title: "AI Analysis",
        description: "GPT-4 Vision identifies components, traces circuits, and suggests potential issues.",
    },
    {
        icon: MessageSquare,
        title: "Diagnostic Chat",
        description: "Describe symptoms and get step-by-step troubleshooting guidance in plain language.",
    },
    {
        icon: BookOpen,
        title: "Procedure Library",
        description: "Built-in procedures for all ATA chapters, automotive systems, and marine equipment.",
    },
    {
        icon: Layers,
        title: "Multi-Industry",
        description: "Aircraft, automotive, marine, and electric vehicles - all in one platform.",
    },
    {
        icon: Search,
        title: "Smart Search",
        description: "Find any component, wire, or system across all your uploaded diagrams instantly.",
    },
    {
        icon: Zap,
        title: "Instant Results",
        description: "Get answers in seconds, not hours. Reduce diagnostic time by up to 70%.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "SOC 2 compliant, encrypted storage, and role-based access control.",
    },
]

export function FeaturesSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Everything You Need to Diagnose Faster
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
                                <Card className="h-full border-white/10 bg-card/40 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all group">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
