"use client"

import { Bell, Settings, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackDialog } from "@/components/feedback/feedback-dialog"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    return (
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-slate-900/80">
            <div>
                {/* Page title rendered by content */}
            </div>
            <div className="flex items-center gap-2">
                <FeedbackDialog />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-[300px] overflow-y-auto">
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center gap-2 w-full">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                    <span className="font-medium text-sm">System Update Complete</span>
                                </div>
                                <p className="text-xs text-slate-400 pl-6">Core diagnostic engine updated to v2.4.0</p>
                                <span className="text-[10px] text-slate-500 pl-6 pt-1">Just now</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center gap-2 w-full">
                                    <Bell className="w-4 h-4 text-blue-500 mt-0.5" />
                                    <span className="font-medium text-sm">New Wiring Diagram</span>
                                </div>
                                <p className="text-xs text-slate-400 pl-6">Ford F-150 dataset processing finished.</p>
                                <span className="text-[10px] text-slate-500 pl-6 pt-1">2 hours ago</span>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-xs text-slate-400 cursor-pointer">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Settings size={20} />
                    </Button>
                </Link>
            </div>
        </header>
    )
}
