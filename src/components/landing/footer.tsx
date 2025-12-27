import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

const FOOTER_LINKS = {
    product: [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Documentation", href: "/docs" },
        { name: "API", href: "/api-docs" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
    ],
    legal: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Security", href: "/security" },
    ],
    support: [
        { name: "Help Center", href: "/help" },
        { name: "Community", href: "/community" },
        { name: "Status", href: "/status" },
    ],
}

export function Footer() {
    return (
        <footer className="border-t border-slate-800/50 bg-slate-950">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-5">
                        <Link href="/" className="flex items-center gap-3 group">
                            <Image
                                src="/icon.png"
                                alt="CircuitIQ"
                                width={40}
                                height={40}
                                className="rounded-xl shadow-lg shadow-amber-500/20"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                CircuitIQ
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            AI-powered wiring diagram analysis for aviation, automotive, marine, and electric vehicles.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://linkedin.com" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="https://github.com" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="mailto:hello@circuitiq.com" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">Product</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">Company</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">Support</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-5">Legal</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} CircuitIQ. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <span>🇺🇬 Made in Terego, Uganda</span>
                        <span className="hidden md:inline text-slate-700">•</span>
                        <span className="text-emerald-600 font-medium">SOC 2 Compliant</span>
                        <span className="hidden md:inline text-slate-700">•</span>
                        <span className="text-blue-500 font-medium">GDPR Ready</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
