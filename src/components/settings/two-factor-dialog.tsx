"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateTwoFactorSecret, enableTwoFactor, disableTwoFactor } from "@/actions/auth-security"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2, Shield, AlertTriangle } from "lucide-react"

interface TwoFactorDialogProps {
    status: boolean
}

export function TwoFactorDialog({ status }: TwoFactorDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<"INTRO" | "QR" | "VERIFY">("INTRO")
    const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string } | null>(null)
    const [token, setToken] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const startSetup = async () => {
        setIsLoading(true)
        try {
            const data = await generateTwoFactorSecret()
            setQrData(data)
            setStep("QR")
        } catch (error) {
            toast.error("Failed to generate 2FA secret")
        } finally {
            setIsLoading(false)
        }
    }

    const verifyAndEnable = async () => {
        if (!qrData || token.length !== 6) return

        setIsLoading(true)
        try {
            await enableTwoFactor(token, qrData.secret)
            toast.success("Two-factor authentication enabled successfully")
            setIsOpen(false)
            setStep("INTRO")
            setToken("")
            // Force text reload/update if needed by parent, but server action revalidates
        } catch (error) {
            toast.error("Invalid code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const disable = async () => {
        setIsLoading(true)
        try {
            await disableTwoFactor()
            toast.success("Two-factor authentication disabled")
            setIsOpen(false)
        } catch (error) {
            toast.error("Failed to disable 2FA")
        } finally {
            setIsLoading(false)
        }
    }

    // If enabled, show disable dialog
    if (status) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">
                        Enabled
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-slate-800 bg-slate-950">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="h-5 w-5" />
                            Disable Two-Factor Authentication
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure? This will reduce your account security and is not recommended for Enterprise accounts.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={disable} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disable 2FA"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    // Setup Flow
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">Configure</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-slate-800 bg-slate-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        Setup Two-Factor Authentication
                    </DialogTitle>
                    <DialogDescription>
                        Protect your account with an extra layer of security using an authenticator app.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === "INTRO" && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300">
                                enhanced security powered by Time-based One-Time Password (TOTP).
                                You will need an app like Google Authenticator or Authy.
                            </p>
                            <Button onClick={startSetup} className="w-full bg-blue-600 hover:bg-blue-500" disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Begin Setup
                            </Button>
                        </div>
                    )}

                    {step === "QR" && qrData && (
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="bg-white p-2 rounded-lg">
                                <Image
                                    src={qrData.qrCodeUrl}
                                    alt="2FA QR Code"
                                    width={180}
                                    height={180}
                                />
                            </div>
                            <div className="w-full space-y-2">
                                <Label>Verify Code</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="font-mono text-center tracking-widest text-lg"
                                        onKeyDown={(e) => e.key === "Enter" && verifyAndEnable()}
                                    />
                                    <Button onClick={verifyAndEnable} disabled={token.length !== 6 || isLoading}>
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 text-center">
                                    Scan the QR code with your authenticator app and enter the 6-digit code.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
