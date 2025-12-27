import { Metadata } from "next"
import Link from "next/link"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    HelpCircle,
    Upload,
    MessageSquare,
    Zap,
    CreditCard,
    Users,
    Shield,
    FileText,
    Search,
    ArrowRight,
    BookOpen,
    Video,
    Headphones
} from "lucide-react"

export const metadata: Metadata = {
    title: "Help Center | CircuitIQ",
    description: "Get help with CircuitIQ - FAQs, guides, and support resources",
}

const HELP_CATEGORIES = [
    {
        icon: Upload,
        title: "Uploading Diagrams",
        description: "Learn how to upload and manage your wiring diagrams",
        articles: ["Supported file formats", "Bulk upload guide", "Organizing diagrams"]
    },
    {
        icon: MessageSquare,
        title: "AI Diagnostics",
        description: "Get the most out of our AI-powered diagnostic tools",
        articles: ["Starting a diagnostic session", "Understanding AI suggestions", "Best practices"]
    },
    {
        icon: CreditCard,
        title: "Billing & Plans",
        description: "Manage your subscription and billing information",
        articles: ["Upgrading your plan", "Payment methods", "Invoices and receipts"]
    },
    {
        icon: Users,
        title: "Team Management",
        description: "Collaborate with your team effectively",
        articles: ["Inviting team members", "Role permissions", "Sharing diagrams"]
    },
    {
        icon: Shield,
        title: "Account & Security",
        description: "Secure your account and manage settings",
        articles: ["Two-factor authentication", "Password reset", "Session management"]
    },
    {
        icon: FileText,
        title: "Procedures Library",
        description: "Access and use diagnostic procedures",
        articles: ["Browsing procedures", "Custom procedures", "ATA chapters explained"]
    }
]

const FAQS = [
    {
        question: "What file formats does CircuitIQ support?",
        answer: "CircuitIQ supports PDF, PNG, JPG, JPEG, TIFF, and various CAD formats including DXF and DWG. For best results, we recommend high-resolution PDFs or images."
    },
    {
        question: "How accurate is the AI analysis?",
        answer: "Our AI achieves 95%+ accuracy on component identification and circuit tracing. However, we always recommend verification by qualified technicians, especially for safety-critical systems."
    },
    {
        question: "Can I use CircuitIQ offline?",
        answer: "Currently, CircuitIQ requires an internet connection for AI analysis. However, you can view previously analyzed diagrams and saved procedures offline in the mobile app."
    },
    {
        question: "How do I cancel my subscription?",
        answer: "You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we use enterprise-grade security including 256-bit encryption, SOC 2 certification, and strict access controls. Your diagrams are never shared with third parties."
    }
]

const RESOURCES = [
    {
        icon: BookOpen,
        title: "Documentation",
        description: "Comprehensive guides and API references",
        href: "/docs"
    },
    {
        icon: Video,
        title: "Video Tutorials",
        description: "Step-by-step video walkthroughs",
        href: "#"
    },
    {
        icon: Headphones,
        title: "Contact Support",
        description: "Get help from our support team",
        href: "/contact"
    }
]

export default function HelpPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                            <HelpCircle className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">Help Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            How can we help you?
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Search our knowledge base or browse categories below
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-2xl mx-auto mb-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <Input
                            placeholder="Search for help articles..."
                            className="pl-12 h-14 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 text-lg"
                        />
                    </div>

                    {/* Categories */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                        {HELP_CATEGORIES.map((category) => {
                            const Icon = category.icon
                            return (
                                <Card key={category.title} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-blue-500/30 transition-colors group cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="p-3 rounded-xl bg-blue-500/10 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                                            <Icon className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-2">{category.title}</h3>
                                        <p className="text-sm text-slate-400 mb-4">{category.description}</p>
                                        <ul className="space-y-2">
                                            {category.articles.map((article) => (
                                                <li key={article} className="text-sm text-slate-300 flex items-center gap-2 hover:text-blue-400 transition-colors">
                                                    <ArrowRight className="h-3 w-3" />
                                                    {article}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* FAQs */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {FAQS.map((faq, index) => (
                                <Card key={index} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                                        <p className="text-slate-400">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {RESOURCES.map((resource) => {
                            const Icon = resource.icon
                            return (
                                <Link key={resource.title} href={resource.href}>
                                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-amber-500/30 transition-colors h-full">
                                        <CardContent className="p-6 text-center">
                                            <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                                <Icon className="h-6 w-6 text-amber-400" />
                                            </div>
                                            <h3 className="font-semibold text-white mb-2">{resource.title}</h3>
                                            <p className="text-sm text-slate-400">{resource.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
