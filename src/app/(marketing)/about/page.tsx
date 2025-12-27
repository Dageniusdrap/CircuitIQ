import { Metadata } from "next"
import Image from "next/image"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Heart, Globe, Zap, Users, Award, Plane, Car, Ship, Battery } from "lucide-react"

export const metadata: Metadata = {
    title: "About Us | CircuitIQ",
    description: "Learn about CircuitIQ's mission to revolutionize wiring diagnostics",
}

const VALUES = [
    {
        icon: Target,
        title: "Precision",
        description: "We deliver accurate diagnostics that professionals can rely on"
    },
    {
        icon: Zap,
        title: "Innovation",
        description: "Constantly pushing the boundaries of AI-powered analysis"
    },
    {
        icon: Users,
        title: "Accessibility",
        description: "Making expert-level diagnostics available to everyone"
    },
    {
        icon: Heart,
        title: "Reliability",
        description: "Building trust through consistent, dependable results"
    }
]

const INDUSTRIES = [
    { icon: Plane, name: "Aviation", description: "Aircraft wiring and avionics systems" },
    { icon: Car, name: "Automotive", description: "Vehicle electrical diagnostics" },
    { icon: Ship, name: "Marine", description: "Boat and vessel electrical systems" },
    { icon: Battery, name: "Electric Vehicles", description: "EV charging and battery systems" }
]

const STATS = [
    { value: "10,000+", label: "Technicians" },
    { value: "500K+", label: "Diagrams Analyzed" },
    { value: "70%", label: "Time Saved" },
    { value: "99.5%", label: "Uptime" }
]

export default function AboutPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            About CircuitIQ
                        </h1>
                        <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
                            We're on a mission to transform how technicians diagnose and troubleshoot
                            complex wiring systems using the power of artificial intelligence.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {STATS.map((stat) => (
                            <Card key={stat.label} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm text-center">
                                <CardContent className="p-6">
                                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-slate-400 mt-2">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Story */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-12">
                        <CardContent className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
                            <div className="space-y-4 text-slate-300 leading-relaxed">
                                <p>
                                    CircuitIQ was born from a simple observation: even the most experienced
                                    technicians spend countless hours poring over complex wiring diagrams,
                                    tracing circuits, and troubleshooting intermittent faults.
                                </p>
                                <p>
                                    Founded in Terego, Uganda, our team combines deep expertise in electrical
                                    systems engineering with cutting-edge artificial intelligence. We've worked
                                    with aircraft maintenance crews, automotive repair shops, and marine
                                    technicians to understand the real challenges they face every day.
                                </p>
                                <p>
                                    Today, CircuitIQ uses advanced computer vision and large language models
                                    to analyze wiring diagrams, understand system relationships, and guide
                                    technicians through step-by-step diagnostic procedures. What once took
                                    hours now takes minutes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Industries */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Industries We Serve</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {INDUSTRIES.map((industry) => {
                                const Icon = industry.icon
                                return (
                                    <Card key={industry.name} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm text-center">
                                        <CardContent className="p-6">
                                            <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                                <Icon className="h-6 w-6 text-amber-400" />
                                            </div>
                                            <h3 className="font-semibold text-white mb-2">{industry.name}</h3>
                                            <p className="text-sm text-slate-400">{industry.description}</p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>

                    {/* Values */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-12">
                        <CardContent className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-white text-center mb-8">Our Values</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {VALUES.map((value) => {
                                    const Icon = value.icon
                                    return (
                                        <div key={value.title} className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-blue-500/10 shrink-0">
                                                <Icon className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white mb-1">{value.title}</h3>
                                                <p className="text-slate-400">{value.description}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                        <CardContent className="p-8 md:p-12 text-center">
                            <Award className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Built by Experts</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Our team includes electrical engineers, AI researchers, and industry
                                veterans who have spent decades working with complex wiring systems.
                                We understand the challenges because we've lived them.
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                                <Globe className="h-5 w-5" />
                                <span>Made with ❤️ in Terego, Uganda</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
