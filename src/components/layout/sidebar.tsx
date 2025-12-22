"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserButton } from "@/components/auth/user-button"
import {
    Layers,
    Upload,
    FileText,
    MessageSquare,
    Search,
    Zap,
    Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
        label: "Search",
        icon: Search,
        href: "/search",
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div
            className={cn(
                "bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col",
                isOpen ? "w-64" : "w-20"
            )}
        >
            {/* Logo */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                {isOpen && (
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                            <Zap size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">CircuitIQ</h1>
                            <p className="text-xs text-slate-400">Pro</p>
                        </div>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="hover:bg-slate-800"
                >
                    <Menu size={20} />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                            pathname === route.href
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <route.icon size={20} />
                        {isOpen && (
                            <span className="font-medium">{route.label}</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-slate-800">
                <UserButton />
            </div>
        </div>
    )
}
