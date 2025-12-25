"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    FileText,
    Upload,
    Search,
    Settings,
    MessageSquare,
    Home,
    LogOut,
    Moon,
    Sun,
    User
} from "lucide-react"
import { useTheme } from "next-themes"
import { logout } from "@/actions/auth"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { setTheme } = useTheme()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Quick Actions">
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard"))}
                    >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Go to Dashboard</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/upload"))}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Diagram</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/diagrams"))}
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Browse Diagrams</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/diagnostics"))}
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Run Diagnostics</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/search"))}
                    >
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search Library</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Settings">
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/profile"))}
                    >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/settings"))}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Theme">
                    <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light Mode</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Account">
                    <CommandItem
                        onSelect={() => runCommand(() => logout())}
                        className="text-destructive"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
