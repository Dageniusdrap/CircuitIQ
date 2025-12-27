"use client"

import { useState, useEffect } from "react"
import {
    Shield,
    Smartphone,
    Key,
    AlertTriangle,
    Check,
    Loader2,
    Eye,
    EyeOff,
    Lock,
    Monitor,
    Smartphone as Phone,
    Tablet,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    getTwoFactorStatus,
    generateTwoFactorSecret,
    enableTwoFactor,
    disableTwoFactor,
    getActiveSessions,
    terminateSession,
    terminateAllOtherSessions
} from "@/actions/auth-security"
import { changePassword } from "@/lib/auth-utils"
import { useSession } from "next-auth/react"
import { show2FAEnabled, showAuthError } from "@/lib/auth-toasts"
import { toast } from "sonner"

export function SecuritySettings() {
    const { data: session } = useSession()
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [setup2FAOpen, setSetup2FAOpen] = useState(false)
    const [changePasswordOpen, setChangePasswordOpen] = useState(false)

    useEffect(() => {
        const load2FAStatus = async () => {
            try {
                const status = await getTwoFactorStatus()
                setTwoFactorEnabled(status.enabled)
            } catch (error) {
                console.error("Failed to get 2FA status:", error)
            } finally {
                setIsLoading(false)
            }
        }
        load2FAStatus()
    }, [])

    return (
        <div className="space-y-6" id="security">
            <div>
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account security and authentication preferences
                </p>
            </div>

            <div className="grid gap-4">
                {/* Two-Factor Authentication */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Smartphone className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-white">
                                        Two-Factor Authentication
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Add an extra layer of security to your account
                                    </CardDescription>
                                </div>
                            </div>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : twoFactorEnabled ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                                    <Check className="h-3 w-3" /> Enabled
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
                                    <AlertTriangle className="h-3 w-3" /> Disabled
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={setup2FAOpen} onOpenChange={setSetup2FAOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant={twoFactorEnabled ? "outline" : "default"}
                                    className={twoFactorEnabled ? "" : "bg-gradient-to-r from-blue-500 to-cyan-500"}
                                    disabled={isLoading}
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    {twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <Setup2FADialog
                                    isEnabled={twoFactorEnabled}
                                    onComplete={(enabled) => {
                                        setTwoFactorEnabled(enabled)
                                        setSetup2FAOpen(false)
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Key className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-white">
                                    Password
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Change your account password
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <ChangePasswordDialog
                                    userId={session?.user?.id || ""}
                                    onComplete={() => setChangePasswordOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Shield className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-white">
                                        Active Sessions
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Manage devices where you&apos;re logged in
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    terminateAllOtherSessions().then(() => {
                                        toast.success("All other sessions terminated")
                                    })
                                }}
                                className="text-xs"
                            >
                                Sign out all others
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ActiveSessionsList />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Active Sessions List Component
function ActiveSessionsList() {
    const [sessions, setSessions] = useState<Array<{
        id: string
        device: string
        location: string
        lastActive: Date
        isCurrent: boolean
    }>>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const data = await getActiveSessions()
                setSessions(data)
            } catch (error) {
                console.error("Failed to load sessions:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSessions()
    }, [])

    const getDeviceIcon = (device: string) => {
        const lowerDevice = device.toLowerCase()
        if (lowerDevice.includes("mobile") || lowerDevice.includes("phone")) {
            return <Phone className="h-4 w-4" />
        }
        if (lowerDevice.includes("tablet") || lowerDevice.includes("ipad")) {
            return <Tablet className="h-4 w-4" />
        }
        return <Monitor className="h-4 w-4" />
    }

    const handleTerminate = async (sessionId: string) => {
        try {
            await terminateSession(sessionId)
            setSessions(prev => prev.filter(s => s.id !== sessionId))
            toast.success("Session terminated")
        } catch {
            toast.error("Failed to terminate session")
        }
    }

    const formatLastActive = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - new Date(date).getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (sessions.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-4">
                No active sessions found
            </p>
        )
    }

    return (
        <div className="space-y-2">
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${session.isCurrent ? "bg-emerald-400" : "bg-slate-500"}`} />
                        <div className="p-2 bg-slate-600/50 rounded-lg">
                            {getDeviceIcon(session.device)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">
                                {session.device}
                                {session.isCurrent && (
                                    <span className="ml-2 text-xs text-emerald-400">(Current)</span>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {session.location} • {formatLastActive(session.lastActive)}
                            </p>
                        </div>
                    </div>
                    {session.isCurrent ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                            Active
                        </span>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTerminate(session.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
                For security, sign out when using shared devices.
            </p>
        </div>
    )
}

// 2FA Setup Dialog
function Setup2FADialog({
    isEnabled,
    onComplete
}: {
    isEnabled: boolean
    onComplete: (enabled: boolean) => void
}) {
    const [step, setStep] = useState<"start" | "scan" | "verify">("start")
    const [secret, setSecret] = useState("")
    const [qrCode, setQrCode] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [disablePassword, setDisablePassword] = useState("")

    const handleStartSetup = async () => {
        setIsLoading(true)
        try {
            const { secret, qrCodeUrl } = await generateTwoFactorSecret()
            setSecret(secret)
            setQrCode(qrCodeUrl)
            setStep("scan")
        } catch {
            setError("Failed to generate 2FA secret")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        if (verificationCode.length !== 6) {
            setError("Please enter a 6-digit code")
            return
        }

        setIsLoading(true)
        setError("")
        try {
            const result = await enableTwoFactor(verificationCode)
            if (result.success) {
                show2FAEnabled()
                onComplete(true)
            } else {
                setError(result.error || "Invalid verification code. Please try again.")
            }
        } catch {
            setError("Invalid verification code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisable = async () => {
        if (!disablePassword) {
            setError("Please enter your password to disable 2FA")
            return
        }

        setIsLoading(true)
        setError("")
        try {
            const result = await disableTwoFactor(disablePassword)
            if (result.success) {
                toast.success("Two-factor authentication disabled")
                onComplete(false)
            } else {
                setError(result.error || "Failed to disable 2FA")
            }
        } catch {
            showAuthError("Failed to disable 2FA")
        } finally {
            setIsLoading(false)
        }
    }

    if (isEnabled) {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        Your account is protected with 2FA
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Alert className="bg-emerald-500/10 border-emerald-500/20">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <AlertDescription className="text-emerald-400">
                            Two-factor authentication is currently enabled
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Label htmlFor="disablePassword">Enter your password to disable 2FA</Label>
                        <Input
                            id="disablePassword"
                            type="password"
                            value={disablePassword}
                            onChange={(e) => setDisablePassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-slate-700/50"
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        variant="destructive"
                        onClick={handleDisable}
                        disabled={isLoading || !disablePassword}
                        className="w-full"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Disable 2FA
                    </Button>
                </div>
            </>
        )
    }

    if (step === "start") {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        Secure your account with an authenticator app
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You&apos;ll need an authenticator app like Google Authenticator,
                        Authy, or 1Password to complete setup.
                    </p>
                    <Button
                        onClick={handleStartSetup}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Started
                    </Button>
                </div>
            </>
        )
    }

    if (step === "scan") {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription>
                        Open your authenticator app and scan this code
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCode} alt="QR Code" className="h-48 w-48" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                            Or enter this code manually:
                        </Label>
                        <code className="block p-2 bg-slate-700/50 rounded text-xs text-center font-mono break-all">
                            {secret}
                        </code>
                    </div>
                    <Button onClick={() => setStep("verify")} className="w-full">
                        Continue
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Enter Verification Code</DialogTitle>
                <DialogDescription>
                    Enter the 6-digit code from your authenticator app
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                        id="code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength={6}
                    />
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button
                    onClick={handleVerify}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify & Enable
                </Button>
            </div>
        </>
    )
}

// Change Password Dialog
function ChangePasswordDialog({
    userId,
    onComplete
}: {
    userId: string
    onComplete: () => void
}) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswords, setShowPasswords] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match")
            return
        }

        setIsLoading(true)
        try {
            const result = await changePassword(userId, currentPassword, newPassword)
            if (result.success) {
                toast.success("Password changed successfully")
                onComplete()
            } else {
                setError(result.error || "Failed to change password")
            }
        } catch {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                    Enter your current password and choose a new one
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Change Password
                </Button>
            </form>
        </>
    )
}
