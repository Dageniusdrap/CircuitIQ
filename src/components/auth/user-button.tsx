"use client"

import { useState } from "react"
import { logout } from "@/actions/auth"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
    LogOut,
    Settings,
    User,
    CreditCard,
    Shield,
    HelpCircle,
    Zap,
    Crown,
    ChevronUp,
    Loader2,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { showLogoutSuccess } from "@/lib/auth-toasts"

interface UserButtonProps {
    isOpen?: boolean
}

const planBadge = {
    FREE: { label: "Free", color: "bg-slate-600 text-slate-200", icon: null },
    PROFESSIONAL: { label: "Pro", color: "bg-blue-500/20 text-blue-400", icon: Zap },
    ENTERPRISE: { label: "Enterprise", color: "bg-amber-500/20 text-amber-400", icon: Crown },
}

export function UserButton({ isOpen = true }: UserButtonProps) {
    const user = useCurrentUser()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        showLogoutSuccess()

        // Small delay to show toast
        setTimeout(() => {
            logout()
        }, 300)
    }

    const userPlan = (user?.plan as keyof typeof planBadge) || "FREE"
    const badge = planBadge[userPlan]
    const BadgeIcon = badge.icon

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn(
                    "flex items-center gap-3 p-2 rounded-xl transition-all outline-none group w-full",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    !isOpen && "justify-center"
                )}>
                    <Avatar className="h-9 w-9 border-2 border-sidebar-border group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>

                    {isOpen && (
                        <div className="text-left flex-1 overflow-hidden">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                    {user?.name || "User"}
                                </p>
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1",
                                    badge.color
                                )}>
                                    {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
                                    {badge.label}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate font-medium">
                                {user?.role || "Team Member"}
                            </p>
                        </div>
                    )}

                    {isOpen && (
                        <ChevronUp size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64" side="right" sideOffset={10}>
                {/* User Info Header */}
                <div className="px-3 py-3 bg-muted/30 rounded-t-md -mx-1 -mt-1 mb-1">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Account
                </DropdownMenuLabel>

                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/settings#security" className="cursor-pointer w-full flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Security & Privacy
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Billing
                </DropdownMenuLabel>

                <DropdownMenuItem asChild>
                    <Link href="/settings#billing" className="cursor-pointer w-full flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Subscription
                        <span className={cn(
                            "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded",
                            badge.color
                        )}>
                            {badge.label}
                        </span>
                    </Link>
                </DropdownMenuItem>

                {userPlan === "FREE" && (
                    <DropdownMenuItem asChild>
                        <Link href="/pricing?upgrade=true" className="cursor-pointer w-full flex items-center text-blue-400 hover:text-blue-300">
                            <Zap className="mr-2 h-4 w-4" />
                            Upgrade to Pro
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                            <Link href="/docs" className="cursor-pointer">
                                Documentation
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/help" className="cursor-pointer">
                                Help Center
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/contact" className="cursor-pointer">
                                Contact Support
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                    {isLoggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
