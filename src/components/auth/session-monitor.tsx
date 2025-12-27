"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { showSessionExpiring } from "@/lib/auth-toasts"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, RefreshCw } from "lucide-react"

const SESSION_WARNING_MINUTES = 5 // Show warning 5 minutes before expiry
const SESSION_CHECK_INTERVAL = 60000 // Check every minute

export function SessionMonitor() {
    const { data: session, update } = useSession()
    const [showWarning, setShowWarning] = useState(false)
    const [minutesRemaining, setMinutesRemaining] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const checkSession = useCallback(() => {
        if (!session?.expires) return

        const expiresAt = new Date(session.expires).getTime()
        const now = Date.now()
        const remainingMs = expiresAt - now
        const remainingMinutes = Math.floor(remainingMs / 60000)

        setMinutesRemaining(remainingMinutes)

        if (remainingMinutes <= SESSION_WARNING_MINUTES && remainingMinutes > 0) {
            setShowWarning(true)
            showSessionExpiring(remainingMinutes)
        } else if (remainingMinutes <= 0) {
            // Session expired - redirect to login
            window.location.href = "/login?expired=true"
        }
    }, [session?.expires])

    const handleRefreshSession = async () => {
        setIsRefreshing(true)
        try {
            await update()
            setShowWarning(false)
        } catch (error) {
            console.error("Failed to refresh session:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        // Initial check
        checkSession()

        // Set up interval for periodic checks
        const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL)

        return () => clearInterval(interval)
    }, [checkSession])

    return (
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <DialogTitle>Session Expiring Soon</DialogTitle>
                            <DialogDescription>
                                Your session will expire in {minutesRemaining} minute{minutesRemaining !== 1 ? "s" : ""}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-slate-400">
                        To keep your session active and prevent losing unsaved work,
                        click the button below to refresh your session.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowWarning(false)}
                    >
                        Dismiss
                    </Button>
                    <Button
                        onClick={handleRefreshSession}
                        disabled={isRefreshing}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                    >
                        {isRefreshing ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        {isRefreshing ? "Refreshing..." : "Refresh Session"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
