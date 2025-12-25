"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const TESTIMONIALS = [
    {
        name: "Captain James Mitchell",
        role: "Chief Pilot, AeroTech Aviation",
        avatar: "/avatars/pilot.jpg",
        content: "CircuitIQ reduced our troubleshooting time by 70%. The AI instantly identifies which systems are affected and guides our technicians step-by-step.",
        rating: 5,
    },
    {
        name: "Sarah Chen",
        role: "Lead Avionics Tech, SkyMaintain MRO",
        avatar: "/avatars/tech.jpg",
        content: "Finally, a tool that understands ATA chapters! Our junior techs are now solving complex wiring issues that used to require senior engineers.",
        rating: 5,
    },
    {
        name: "Marcus Rodriguez",
        role: "Fleet Manager, Pacific Marine",
        avatar: "/avatars/marine.jpg",
        content: "From aircraft to marine vessels, CircuitIQ handles it all. The diagnostic chat is like having an expert electrician on call 24/7.",
        rating: 5,
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-slate-900/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Trusted by Industry Professionals
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
                            <Card className="h-full border-white/10 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-colors">
                                <CardContent className="p-6 space-y-4">
                                    {/* Stars */}
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-slate-300 leading-relaxed">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                        <Avatar>
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback className="bg-primary/20 text-primary">
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-white">{testimonial.name}</p>
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
                    className="mt-16 text-center"
                >
                    <p className="text-slate-500 text-sm mb-6">TRUSTED BY TECHNICIANS AT</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                        <span className="text-2xl font-bold text-white">Boeing</span>
                        <span className="text-2xl font-bold text-white">Airbus</span>
                        <span className="text-2xl font-bold text-white">Delta</span>
                        <span className="text-2xl font-bold text-white">Tesla</span>
                        <span className="text-2xl font-bold text-white">Caterpillar</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
