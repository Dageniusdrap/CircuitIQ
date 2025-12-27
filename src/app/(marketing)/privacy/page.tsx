import { Metadata } from "next"
import Link from "next/link"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Server, Key, Bell, Users, FileCheck } from "lucide-react"

export const metadata: Metadata = {
    title: "Privacy Policy | CircuitIQ",
    description: "Learn how CircuitIQ protects and handles your data",
}

const PRIVACY_SECTIONS = [
    {
        icon: Eye,
        title: "Information We Collect",
        content: `We collect information you provide directly to us, such as when you create an account, upload diagrams, use our diagnostic tools, or contact us for support. This includes:
        
• Account information (name, email, password)
• Uploaded diagrams and associated metadata
• Diagnostic session data and chat history
• Payment and billing information
• Usage data and analytics`
    },
    {
        icon: Server,
        title: "How We Use Your Information",
        content: `We use the information we collect to:
        
• Provide, maintain, and improve our services
• Process transactions and send related information
• Send technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Analyze usage patterns to improve user experience
• Train and improve our AI diagnostic models (anonymized data only)`
    },
    {
        icon: Shield,
        title: "Data Security",
        content: `We implement industry-standard security measures to protect your data:
        
• 256-bit SSL/TLS encryption for all data in transit
• AES-256 encryption for data at rest
• SOC 2 Type II certified infrastructure
• Regular security audits and penetration testing
• Multi-factor authentication options
• Automatic session timeouts`
    },
    {
        icon: Users,
        title: "Data Sharing",
        content: `We do not sell your personal information. We may share your data with:
        
• Service providers who assist in operating our platform
• Professional advisors (lawyers, accountants, auditors)
• Law enforcement when required by law
• Business partners with your explicit consent
        
All third-party providers are bound by strict confidentiality agreements.`
    },
    {
        icon: Lock,
        title: "Your Rights",
        content: `You have the right to:
        
• Access your personal data
• Correct inaccurate information
• Delete your account and associated data
• Export your data in a portable format
• Opt-out of marketing communications
• Restrict certain data processing activities
        
Contact us at privacy@circuitiq.com to exercise these rights.`
    },
    {
        icon: Bell,
        title: "Updates to This Policy",
        content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:
        
• Posting the new policy on our website
• Sending you an email notification
• Displaying a prominent notice in your dashboard
        
Your continued use of CircuitIQ after changes constitutes acceptance of the updated policy.`
    }
]

export default function PrivacyPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-medium">Your Privacy Matters</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Privacy Policy
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Last updated: December 26, 2024
                        </p>
                    </div>

                    {/* Introduction */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-8">
                        <CardContent className="p-8">
                            <p className="text-slate-300 leading-relaxed">
                                At CircuitIQ, we take your privacy seriously. This Privacy Policy explains how we collect,
                                use, disclose, and safeguard your information when you use our AI-powered wiring diagram
                                analysis platform. Please read this policy carefully. If you do not agree with the terms of
                                this privacy policy, please do not access the application.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Sections */}
                    <div className="space-y-6">
                        {PRIVACY_SECTIONS.map((section, index) => {
                            const Icon = section.icon
                            return (
                                <Card key={index} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-emerald-500/10 shrink-0">
                                                <Icon className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-white mb-4">
                                                    {section.title}
                                                </h2>
                                                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                                                    {section.content}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Contact */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mt-8">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-xl font-semibold text-white mb-4">Questions?</h2>
                            <p className="text-slate-300 mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <p className="text-amber-400 font-medium">privacy@circuitiq.com</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
