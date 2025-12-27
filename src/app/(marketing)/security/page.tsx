import { Metadata } from "next"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Server, Key, FileCheck, Eye, AlertTriangle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "Security | CircuitIQ",
    description: "Learn about CircuitIQ's security practices and certifications",
}

const SECURITY_FEATURES = [
    {
        icon: Lock,
        title: "Data Encryption",
        description: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit",
        color: "emerald"
    },
    {
        icon: Server,
        title: "SOC 2 Type II",
        description: "Certified compliant with industry-standard security controls",
        color: "blue"
    },
    {
        icon: Key,
        title: "Access Control",
        description: "Role-based access control and multi-factor authentication",
        color: "purple"
    },
    {
        icon: Eye,
        title: "24/7 Monitoring",
        description: "Continuous security monitoring and intrusion detection",
        color: "amber"
    }
]

const COMPLIANCE_BADGES = [
    { name: "SOC 2 Type II", status: "Certified" },
    { name: "GDPR", status: "Compliant" },
    { name: "ISO 27001", status: "In Progress" },
    { name: "HIPAA", status: "Available on Enterprise" }
]

const SECURITY_DETAILS = [
    {
        icon: Shield,
        title: "Infrastructure Security",
        content: `Our infrastructure is hosted on enterprise-grade cloud providers with:

• Geographically distributed data centers
• Automatic failover and disaster recovery
• 99.9% uptime SLA
• DDoS protection and mitigation
• Regular backup and recovery testing
• Network segmentation and firewalls`
    },
    {
        icon: FileCheck,
        title: "Application Security",
        content: `Our development practices include:

• Secure Software Development Lifecycle (SSDLC)
• Regular code reviews and security audits
• Automated vulnerability scanning
• Dependency security monitoring
• Penetration testing by third-party firms
• Bug bounty program for responsible disclosure`
    },
    {
        icon: Key,
        title: "Authentication & Access",
        content: `We implement robust access controls:

• Multi-factor authentication (MFA) support
• Single Sign-On (SSO) for Enterprise plans
• Session management with automatic timeouts
• IP allowlisting for sensitive operations
• Audit logs for all account activities
• API key management with scoped permissions`
    },
    {
        icon: AlertTriangle,
        title: "Incident Response",
        content: `Our security team maintains:

• 24/7 security operations center
• Documented incident response procedures
• Regular tabletop exercises and drills
• Customer notification within 72 hours of confirmed breaches
• Post-incident reviews and remediation
• Transparent communication policy`
    }
]

export default function SecurityPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-medium">Enterprise-Grade Security</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Security at CircuitIQ
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Your diagrams and data are protected by industry-leading security practices
                        </p>
                    </div>

                    {/* Security Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {SECURITY_FEATURES.map((feature) => {
                            const Icon = feature.icon
                            const colorClasses = {
                                emerald: "bg-emerald-500/10 text-emerald-400",
                                blue: "bg-blue-500/10 text-blue-400",
                                purple: "bg-purple-500/10 text-purple-400",
                                amber: "bg-amber-500/10 text-amber-400"
                            }
                            return (
                                <Card key={feature.title} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm text-center">
                                    <CardContent className="p-6">
                                        <div className={`mx-auto w-12 h-12 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-400">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Compliance Badges */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-12">
                        <CardContent className="p-8">
                            <h2 className="text-xl font-semibold text-white mb-6 text-center">Compliance & Certifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {COMPLIANCE_BADGES.map((badge) => (
                                    <div key={badge.name} className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                        <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                                        <p className="font-medium text-white">{badge.name}</p>
                                        <p className="text-sm text-slate-400">{badge.status}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Sections */}
                    <div className="space-y-6">
                        {SECURITY_DETAILS.map((section, index) => {
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
                            <h2 className="text-xl font-semibold text-white mb-4">Report a Security Issue</h2>
                            <p className="text-slate-300 mb-4">
                                If you discover a security vulnerability, please report it responsibly:
                            </p>
                            <p className="text-amber-400 font-medium">security@circuitiq.com</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
