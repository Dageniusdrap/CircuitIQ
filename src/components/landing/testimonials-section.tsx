"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const TESTIMONIALS = [
    {
        name: "Captain James Mitchell",
        role: "Chief Pilot, AeroTech Aviation",
        avatar: "/avatars/pilot.jpg",
        content: "CircuitIQ reduced our troubleshooting time by 70%. The AI instantly identifies which systems are affected and guides our technicians step-by-step.",
        rating: 5,
        initials: "JM",
        avatarBg: "from-blue-600 to-cyan-600",
    },
    {
        name: "Sarah Chen",
        role: "Lead Avionics Tech, SkyMaintain MRO",
        avatar: "/avatars/tech.jpg",
        content: "Finally, a tool that understands ATA chapters! Our junior techs are now solving complex wiring issues that used to require senior engineers.",
        rating: 5,
        initials: "SC",
        avatarBg: "from-purple-600 to-pink-600",
    },
    {
        name: "Marcus Rodriguez",
        role: "Fleet Manager, Pacific Marine",
        avatar: "/avatars/marine.jpg",
        content: "From aircraft to marine vessels, CircuitIQ handles it all. The diagnostic chat is like having an expert electrician on call 24/7.",
        rating: 5,
        initials: "MR",
        avatarBg: "from-amber-600 to-orange-600",
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-slate-900/80 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Trusted by Industry Professionals
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        See why aviation, automotive, and marine technicians choose CircuitIQ
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 group">
                                <CardContent className="p-8 space-y-6">
                                    {/* Quote Icon */}
                                    <Quote className="h-10 w-10 text-amber-500/30 group-hover:text-amber-500/50 transition-colors" />

                                    {/* Stars */}
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-slate-200 leading-relaxed text-lg">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
                                        <Avatar className="h-12 w-12 ring-2 ring-slate-700/50">
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback className={`bg-gradient-to-br ${testimonial.avatarBg} text-white font-semibold`}>
                                                {testimonial.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-white">{testimonial.name}</p>
                                            <p className="text-sm text-slate-400">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <p className="text-slate-500 text-sm font-medium tracking-wider mb-8">TRUSTED BY TECHNICIANS AT</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                        {["Boeing", "Airbus", "Delta", "Tesla", "Caterpillar"].map((company) => (
                            <span
                                key={company}
                                className="text-2xl font-bold text-slate-500 hover:text-slate-300 transition-colors duration-300 cursor-default"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
