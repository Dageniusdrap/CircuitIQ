import { Metadata } from "next"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Github, Twitter, Slack, Youtube, ArrowRight, Star, Heart, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Community | CircuitIQ",
    description: "Join the CircuitIQ community of technicians and engineers",
}

const COMMUNITY_LINKS = [
    {
        icon: Slack,
        name: "Slack Community",
        description: "Join 2,000+ technicians discussing diagnostics, sharing tips, and getting help",
        members: "2,000+ members",
        href: "#",
        color: "purple"
    },
    {
        icon: Github,
        name: "GitHub Discussions",
        description: "Report bugs, request features, and contribute to our open-source tools",
        members: "500+ contributors",
        href: "#",
        color: "slate"
    },
    {
        icon: Twitter,
        name: "Twitter/X",
        description: "Follow us for the latest updates, tips, and industry news",
        members: "10K+ followers",
        href: "#",
        color: "blue"
    },
    {
        icon: Youtube,
        name: "YouTube Channel",
        description: "Watch tutorials, webinars, and diagnostic walkthroughs",
        members: "5K+ subscribers",
        href: "#",
        color: "red"
    }
]

const HIGHLIGHTS = [
    {
        icon: MessageSquare,
        title: "Weekly Q&A",
        description: "Live sessions with our AI engineers every Friday"
    },
    {
        icon: Star,
        title: "Feature Voting",
        description: "Help shape the product roadmap with your feedback"
    },
    {
        icon: Heart,
        title: "Mentorship",
        description: "Connect with experienced technicians for guidance"
    },
    {
        icon: Zap,
        title: "Early Access",
        description: "Beta test new features before public release"
    }
]

const TOP_CONTRIBUTORS = [
    { name: "Mike Thompson", contributions: 156, badge: "Aviation Expert" },
    { name: "Sarah Williams", contributions: 124, badge: "Marine Specialist" },
    { name: "David Kim", contributions: 98, badge: "EV Guru" },
    { name: "Lisa Chen", contributions: 87, badge: "Automotive Pro" }
]

export default function CommunityPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">Community</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Join Our Community
                        </h1>
                        <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
                            Connect with thousands of technicians and engineers who use CircuitIQ
                            to diagnose and troubleshoot wiring systems.
                        </p>
                    </div>

                    {/* Community Links */}
                    <div className="grid md:grid-cols-2 gap-4 mb-16">
                        {COMMUNITY_LINKS.map((link) => {
                            const Icon = link.icon
                            const colorClasses = {
                                purple: "bg-purple-500/10 text-purple-400",
                                slate: "bg-slate-500/10 text-slate-400",
                                blue: "bg-blue-500/10 text-blue-400",
                                red: "bg-red-500/10 text-red-400"
                            }
                            return (
                                <Card key={link.name} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-blue-500/30 transition-colors group cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${colorClasses[link.color as keyof typeof colorClasses]}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                    {link.name}
                                                </h3>
                                                <p className="text-sm text-slate-400 mb-2">{link.description}</p>
                                                <span className="text-xs text-slate-500">{link.members}</span>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {HIGHLIGHTS.map((highlight) => {
                            const Icon = highlight.icon
                            return (
                                <Card key={highlight.title} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm text-center">
                                    <CardContent className="p-6">
                                        <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                            <Icon className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-1">{highlight.title}</h3>
                                        <p className="text-sm text-slate-400">{highlight.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Top Contributors */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-8">
                        <CardContent className="p-8">
                            <h2 className="text-xl font-bold text-white text-center mb-8">Top Contributors</h2>
                            <div className="grid md:grid-cols-4 gap-4">
                                {TOP_CONTRIBUTORS.map((user, index) => (
                                    <div key={index} className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <p className="font-medium text-white">{user.name}</p>
                                        <p className="text-xs text-amber-400 font-medium mb-1">{user.badge}</p>
                                        <p className="text-sm text-slate-500">{user.contributions} contributions</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <Card className="border-slate-700/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
                            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                                Get instant access to our Slack community and start connecting
                                with fellow technicians today.
                            </p>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white">
                                Join the Community
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
