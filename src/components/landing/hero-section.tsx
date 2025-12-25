"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Upload, MessageSquare, Layers, LucideIcon, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { HeroBackground } from "./hero-background"

export function HeroSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <HeroBackground />

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
                <motion.div
                    className="text-center space-y-8 max-w-4xl mx-auto"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={item}>
                        <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 backdrop-blur-md hover:bg-blue-500/20 transition-colors cursor-default">
                            <Zap size={20} className="text-blue-400" />
                            <span className="text-blue-400 font-medium">AI-Powered Diagnostics</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight"
                        variants={item}
                    >
                        Troubleshoot Wiring Systems
                        <br />
                        <span className="text-blue-400 drop-shadow-lg"> 10x Faster</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                        variants={item}
                    >
                        Upload your wiring diagrams and let AI guide you through step-by-step diagnostics.
                        Perfect for aircraft, automotive, marine, and electric vehicles.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                        variants={item}
                    >
                        <Button asChild size="lg" className="gap-2 h-12">
                            <Link href="/register">
                                Get Started Free
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="glass" className="h-12">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid md:grid-cols-3 gap-6 mt-24"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <FeatureCard
                        icon={Upload}
                        title="Upload Diagrams"
                        description="Bulk upload PDFs, images, or CAD files. AI automatically extracts all components and connections."
                        delay={0}
                    />
                    <FeatureCard
                        icon={MessageSquare}
                        title="AI Diagnostics"
                        description="Chat with AI to troubleshoot issues. Get step-by-step procedures with expected values."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Layers}
                        title="System Analysis"
                        description="See how components interact, failure impacts, and bypass procedures automatically."
                        delay={0.4}
                    />
                </motion.div>
            </div>
        </div>
    )
}

function FeatureCard({
    icon: Icon,
    title,
    description,
    delay
}: {
    icon: LucideIcon
    title: string
    description: string
    delay: number
}) {
    return (
        <motion.div
            className="group bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-900/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                <Icon size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    )
}
