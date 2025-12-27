"use client"

import { SessionMonitor } from "@/components/auth/session-monitor"
import { WelcomeTour } from "@/components/dashboard/welcome-tour"

/**
 * Client-side components for the dashboard that need access to session hooks
 */
export function DashboardClientComponents() {
    return (
        <>
            <SessionMonitor />
            <WelcomeTour />
        </>
    )
}
