import { Metadata } from "next"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, CreditCard, Shield, Users, Ban, Gavel } from "lucide-react"

export const metadata: Metadata = {
    title: "Terms of Service | CircuitIQ",
    description: "Terms and conditions for using CircuitIQ",
}

const TERMS_SECTIONS = [
    {
        icon: FileText,
        title: "1. Acceptance of Terms",
        content: `By accessing or using CircuitIQ ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, you agree to be bound by these Terms. If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization.`
    },
    {
        icon: Users,
        title: "2. User Accounts",
        content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.

You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.

You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`
    },
    {
        icon: Shield,
        title: "3. Intellectual Property",
        content: `The Service and its original content, features, and functionality are and will remain the exclusive property of CircuitIQ and its licensors. The Service is protected by copyright, trademark, and other laws.

You retain all rights to any diagrams, documents, or other content you upload to the Service. By uploading content, you grant CircuitIQ a limited license to process and analyze your content solely for the purpose of providing the Service.

Our AI models may learn from anonymized patterns in data to improve diagnostic accuracy, but we never share your specific proprietary diagrams with third parties.`
    },
    {
        icon: Ban,
        title: "4. Prohibited Uses",
        content: `You agree not to use the Service:

• For any unlawful purpose or in violation of any laws
• To upload viruses, malware, or other malicious code
• To attempt to gain unauthorized access to our systems
• To interfere with or disrupt the Service
• To impersonate others or provide false information
• To reverse engineer or attempt to extract our AI models
• To use automated systems to access the Service without permission
• To share your account credentials with unauthorized users`
    },
    {
        icon: CreditCard,
        title: "5. Billing and Payments",
        content: `Certain features of the Service require payment. By subscribing to a paid plan, you agree to pay all applicable fees.

• Subscription fees are billed in advance on a monthly or annual basis
• All fees are non-refundable except as required by law
• We may change our fees at any time with 30 days' notice
• Failure to pay may result in suspension or termination of your account
• You are responsible for all taxes associated with your subscription`
    },
    {
        icon: AlertTriangle,
        title: "6. Limitation of Liability",
        content: `CircuitIQ provides diagnostic suggestions and analysis tools. However:

• The Service is provided "as is" without warranties of any kind
• Diagnostic results should be verified by qualified professionals
• We are not liable for decisions made based on Service outputs
• CircuitIQ is not responsible for any electrical or mechanical work performed based on our suggestions
• Always follow proper safety procedures and manufacturer guidelines

In no event shall CircuitIQ be liable for any indirect, incidental, special, consequential, or punitive damages.`
    },
    {
        icon: Gavel,
        title: "7. Termination",
        content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms.

Upon termination:
• Your right to use the Service will immediately cease
• You may request export of your data within 30 days
• We may delete your data after 30 days unless legally required to retain it

All provisions of these Terms which should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.`
    },
    {
        icon: Scale,
        title: "8. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.

Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`
    }
]

export default function TermsPage() {
    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                            <Scale className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">Legal Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Terms of Service
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Last updated: December 26, 2024
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {TERMS_SECTIONS.map((section, index) => {
                            const Icon = section.icon
                            return (
                                <Card key={index} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-blue-500/10 shrink-0">
                                                <Icon className="h-6 w-6 text-blue-400" />
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
                            <h2 className="text-xl font-semibold text-white mb-4">Questions About Our Terms?</h2>
                            <p className="text-slate-300 mb-4">
                                Contact our legal team at:
                            </p>
                            <p className="text-amber-400 font-medium">legal@circuitiq.com</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
