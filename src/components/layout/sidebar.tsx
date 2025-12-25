"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserButton } from "@/components/auth/user-button"
import {
    Layers,
    Upload,
    FileText,
    MessageSquare,
    Search,
    ChevronLeft,
    BookOpen,
    CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const routes = [
    {
        label: "Dashboard",
        icon: Layers,
        href: "/dashboard",
    },
    {
        label: "Upload",
        icon: Upload,
        href: "/upload",
    },
    {
        label: "Diagrams",
        icon: FileText,
        href: "/diagrams",
    },
    {
        label: "Diagnostics",
        icon: MessageSquare,
        href: "/diagnostics",
    },
    {
        label: "Procedures",
        icon: BookOpen,
        href: "/procedures",
    },
    {
        label: "Search",
        icon: Search,
        href: "/search",
    },
    {
        label: "Pricing",
        icon: CreditCard,
        href: "/pricing",
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div
            className={cn(
                "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col relative z-20",
                isOpen ? "w-64" : "w-20"
            )}
        >
            {/* Toggle Button - Floating */}
            <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-8 rounded-full h-6 w-6 border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent z-50 hidden md:flex"
            >
                <ChevronLeft className={cn("h-3 w-3 transition-transform", !isOpen && "rotate-180")} />
            </Button>

            {/* Logo */}
            <div className="p-6 pb-2 flex items-center justify-between h-20">
                <Link href="/dashboard" className={cn("flex items-center gap-3 transition-opacity duration-200", !isOpen && "justify-center w-full")}>
                    <div className="relative w-9 h-9 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="CircuitIQ"
                            fill
                            className="object-contain"
                        />
                    </div>
                    {isOpen && (
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-foreground">CircuitIQ</span>
                            <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full w-fit flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                GOLD
                            </span>
                        </div>
                    )}
                </Link>
                {isOpen && <ThemeToggle />}
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {routes.map((route) => {
                    const isActive = pathname.startsWith(route.href)

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                !isOpen && "justify-center px-2"
                            )}
                        >
                            <route.icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-slate-500 group-hover:text-sidebar-foreground")} />

                            {isOpen && (
                                <span className={cn("text-sm truncate")}>{route.label}</span>
                            )}

                            {!isOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-border whitespace-nowrap z-50">
                                    {route.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
                <UserButton isOpen={isOpen} />
            </div>
        </div>
    )
}
