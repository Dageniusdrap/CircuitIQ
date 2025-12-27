"use client"

import { useState } from "react"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, MapPin, Phone, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const CONTACT_INFO = [
    {
        icon: Mail,
        label: "Email",
        value: "hello@circuitiq.com",
        href: "mailto:hello@circuitiq.com"
    },
    {
        icon: MessageSquare,
        label: "Support",
        value: "support@circuitiq.com",
        href: "mailto:support@circuitiq.com"
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Terego, Uganda",
        href: null
    }
]

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        toast.success("Message sent! We'll get back to you soon.")
    }

    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2">
                            <MessageSquare className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-400 text-sm font-medium">Get In Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Contact Us
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message
                            and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            {CONTACT_INFO.map((info) => {
                                const Icon = info.icon
                                return (
                                    <Card key={info.label} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-amber-500/10">
                                                    <Icon className="h-5 w-5 text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-400">{info.label}</p>
                                                    {info.href ? (
                                                        <a
                                                            href={info.href}
                                                            className="text-white hover:text-amber-400 transition-colors"
                                                        >
                                                            {info.value}
                                                        </a>
                                                    ) : (
                                                        <p className="text-white">{info.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}

                            {/* Additional Info */}
                            <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-white mb-3">Business Hours</h3>
                                    <div className="space-y-2 text-sm text-slate-400">
                                        <p>Monday - Friday: 9am - 6pm EAT</p>
                                        <p>Saturday: 10am - 2pm EAT</p>
                                        <p>Sunday: Closed</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <Card className="md:col-span-2 border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                            <CardContent className="p-8">
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                                        <p className="text-slate-400 mb-6">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                        <Button
                                            onClick={() => setIsSubmitted(false)}
                                            variant="outline"
                                            className="border-slate-600 text-slate-200 hover:bg-slate-800"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-200">Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Your name"
                                                    required
                                                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-200">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    required
                                                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-slate-200">Subject</Label>
                                            <Input
                                                id="subject"
                                                placeholder="How can we help?"
                                                required
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-slate-200">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={6}
                                                required
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold"
                                        >
                                            {isSubmitting ? (
                                                "Sending..."
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
