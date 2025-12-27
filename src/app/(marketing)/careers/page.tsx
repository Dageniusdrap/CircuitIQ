import { Metadata } from "next"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Globe, Users } from "lucide-react"

export const metadata: Metadata = {
    title: "Careers | CircuitIQ",
    description: "Join our team and help revolutionize wiring diagnostics",
}

const BENEFITS = [
    {
        icon: Globe,
        title: "Remote First",
        description: "Work from anywhere in the world"
    },
    {
        icon: Heart,
        title: "Health & Wellness",
        description: "Comprehensive health coverage"
    },
    {
        icon: Zap,
        title: "Learning Budget",
        description: "$2,000/year for courses & conferences"
    },
    {
        icon: Users,
        title: "Great Team",
        description: "Collaborative, supportive culture"
    }
]

const OPENINGS = [
    {
        title: "Senior Full-Stack Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "Build and scale our core platform using Next.js, TypeScript, and PostgreSQL."
    },
    {
        title: "Machine Learning Engineer",
        department: "AI/ML",
        location: "Remote",
        type: "Full-time",
        description: "Develop and improve our computer vision and NLP models for diagram analysis."
    },
    {
        title: "Product Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        description: "Design intuitive experiences for technicians working with complex diagrams."
    },
    {
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Remote (Americas)",
        type: "Full-time",
        description: "Help enterprise customers get maximum value from CircuitIQ."
    },
    {
        title: "Technical Writer",
        department: "Documentation",
        location: "Remote",
        type: "Contract",
        description: "Create clear, comprehensive documentation for our platform and API."
    }
]

export default function CareersPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
                            <Briefcase className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">We're Hiring</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Join Our Team
                        </h1>
                        <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
                            Help us revolutionize how technicians diagnose and troubleshoot
                            complex wiring systems using AI.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {BENEFITS.map((benefit) => {
                            const Icon = benefit.icon
                            return (
                                <Card key={benefit.title} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm text-center">
                                    <CardContent className="p-6">
                                        <div className="mx-auto w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                                            <Icon className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                                        <p className="text-sm text-slate-400">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Open Positions */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Open Positions</h2>
                        <div className="space-y-4">
                            {OPENINGS.map((job, index) => (
                                <Card key={index} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-purple-500/30 transition-colors group cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-2">
                                                    {job.title}
                                                </h3>
                                                <p className="text-slate-400 text-sm mb-3">{job.description}</p>
                                                <div className="flex flex-wrap gap-3 text-sm">
                                                    <span className="flex items-center gap-1 text-slate-500">
                                                        <Briefcase className="h-4 w-4" />
                                                        {job.department}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-slate-500">
                                                        <MapPin className="h-4 w-4" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-slate-500">
                                                        <Clock className="h-4 w-4" />
                                                        {job.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button className="bg-purple-500 hover:bg-purple-600 text-white shrink-0">
                                                Apply Now
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* No Match */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-xl font-bold text-white mb-4">Don't See a Match?</h2>
                            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                                We're always looking for talented people. Send us your resume and
                                tell us how you'd like to contribute.
                            </p>
                            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                Send General Application
                            </Button>
                            <p className="text-sm text-slate-500 mt-4">careers@circuitiq.com</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
