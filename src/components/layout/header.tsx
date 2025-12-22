"use client"

import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
            <div>
                {/* Page title will be rendered by individual pages */}
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Settings size={20} />
                </Button>
            </div>
        </header>
    )
}
