"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-primary/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-primary text-sm font-medium">Start Free Today</span>
                    </div>

                    <h2 className="text-5xl font-bold text-white leading-tight">
                        Ready to Diagnose <span className="text-primary">10x Faster?</span>
                    </h2>

                    <p className="text-xl text-slate-300">
                        Join thousands of technicians who trust CircuitIQ for their daily diagnostics.
                        No credit card required to start.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="gap-2 h-14 px-8 text-lg">
                            <Link href="/register">
                                Get Started Free
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg">
                            <Link href="/pricing">
                                View Pricing
                            </Link>
                        </Button>
                    </div>

                    <p className="text-sm text-slate-500">
                        ✓ Free forever plan available &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
