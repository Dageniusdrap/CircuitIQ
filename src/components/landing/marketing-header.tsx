"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Procedures", href: "/procedures" },
]

export function MarketingHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Track scroll position for enhanced header styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-slate-950/20"
                    : "bg-slate-950/60 backdrop-blur-md border-b border-slate-800/30"
            )}
        >
            <nav className="container mx-auto px-6 h-18 flex items-center justify-between py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <Image
                            src="/icon.png"
                            alt="CircuitIQ"
                            width={40}
                            height={40}
                            className="rounded-xl shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow duration-300"
                        />
                        {/* Premium glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                        CircuitIQ
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200 group"
                        >
                            {link.name}
                            {/* Hover underline effect */}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-slate-200 hover:text-white hover:bg-slate-800/50 font-medium"
                    >
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                    >
                        <Link href="/register" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Get Started
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/50 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-xl border-b border-slate-700/50 transition-all duration-300 shadow-xl",
                    mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}
            >
                <div className="container mx-auto px-6 py-6 space-y-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block text-slate-200 hover:text-white transition-colors py-3 font-medium text-lg border-b border-slate-800/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-3">
                        <Button asChild variant="ghost" className="w-full justify-center text-slate-200 hover:text-white hover:bg-slate-800/50">
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-lg"
                        >
                            <Link href="/register" className="flex items-center justify-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Get Started
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
