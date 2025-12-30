"use client"

import { useState } from "react"
import { SessionMonitor } from "@/components/auth/session-monitor"
import { WelcomeTour } from "@/components/dashboard/welcome-tour"
import { HelpDialog } from "@/components/help/help-dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

/**
 * Client-side components for the dashboard that need access to session hooks
 */
export function DashboardClientComponents() {
    const [helpOpen, setHelpOpen] = useState(false)

    return (
        <>
            <SessionMonitor />
            <WelcomeTour />
            <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />

            {/* Floating Help Button */}
            <Button
                onClick={() => setHelpOpen(true)}
                size="icon"
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
                title="Help & Documentation"
            >
                <HelpCircle className="h-6 w-6" />
            </Button>
        </>
    )
}
