"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles, Check } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-950">
            {/* Premium gradient backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.08),transparent_50%)]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto space-y-8"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-5 py-2.5 shadow-lg shadow-amber-500/10">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-amber-300 text-sm font-semibold">Start Free Today</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        Ready to Diagnose{" "}
                        <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            10x Faster?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        Join thousands of technicians who trust CircuitIQ for their daily diagnostics.
                        No credit card required to start.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            asChild
                            size="lg"
                            className="gap-2 h-14 px-8 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                        >
                            <Link href="/register">
                                Get Started Free
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg border-slate-600 text-slate-200 hover:bg-slate-800/50 hover:border-slate-500 hover:text-white transition-all duration-300"
                        >
                            <Link href="/pricing">
                                View Pricing
                            </Link>
                        </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-4">
                        {[
                            "Free forever plan available",
                            "No credit card required",
                            "Cancel anytime"
                        ].map((feature) => (
                            <span key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                                <Check className="h-4 w-4 text-emerald-500" />
                                {feature}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
