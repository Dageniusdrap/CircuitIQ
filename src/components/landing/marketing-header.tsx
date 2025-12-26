"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Procedures", href: "/procedures" },
]

export function MarketingHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold text-white">CircuitIQ</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm text-slate-300 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300",
                    mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}
            >
                <div className="container mx-auto px-4 py-4 space-y-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block text-slate-300 hover:text-white transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                        <Button asChild variant="ghost" className="w-full justify-start">
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild className="w-full">
                            <Link href="/register">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
