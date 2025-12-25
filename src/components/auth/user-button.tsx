"use client"

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
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface UserButtonProps {
    isOpen?: boolean
}

export function UserButton({ isOpen = true }: UserButtonProps) {
    const user = useCurrentUser()

    const handleLogout = () => {
        logout()
    }

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
                            <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate font-medium">
                                {user?.role || "Team Member"}
                            </p>
                        </div>
                    )}

                    {isOpen && (
                        <Settings size={16} className="text-muted-foreground opacity-0 group-hover:opacity-50 transition-opacity" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
