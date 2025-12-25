"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import {
    Moon,
    Sun,
    Shield,
    Zap,
    Mail,
    Globe,
    Award,
    Cpu,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TwoFactorDialog } from "./two-factor-dialog"

interface SettingsDashboardProps {
    twoFactorEnabled: boolean
}

export function SettingsDashboard({ twoFactorEnabled }: SettingsDashboardProps) {
    const [emailDetails, setEmailDetails] = useState(true)
    const { setTheme, theme } = useTheme()
    const [sessionId, setSessionId] = useState("")

    // Avoid hydration mismatch
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
        setSessionId(Date.now().toString().slice(-8))
    }, [])

    const handleEmailToggle = (checked: boolean) => {
        setEmailDetails(checked)
        toast.success(checked ? "Email notifications enabled" : "Email notifications disabled")
    }

    const handleThemeToggle = (checked: boolean) => {
        setTheme(checked ? "dark" : "light")
        toast.success(checked ? "Dark Mode Enabled" : "Light Mode Enabled")
    }

    if (!mounted) return null

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Settings & Preferences
                </h1>
                <p className="text-slate-400">
                    Manage your workspace environment and notification preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Settings */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Appearance & Notifications */}
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-800/60 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Zap className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">General Preferences</CardTitle>
                                    <CardDescription>Customize your interface and alerts</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-2 rounded-full transition-colors",
                                        theme === "dark" ? "bg-slate-800 text-yellow-400" : "bg-slate-200 text-slate-700"
                                    )}>
                                        {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-base font-medium cursor-pointer group-hover:text-blue-400 transition-colors">
                                            Interface Theme
                                        </Label>
                                        <p className="text-sm text-slate-500">
                                            {theme === "dark" ? "Dark mode is active (Recommended)" : "Light mode is active"}
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={theme === "dark"}
                                    onCheckedChange={handleThemeToggle}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>

                            <div className="h-px bg-slate-800/60" />

                            {/* Email Notifications */}
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-2 rounded-full transition-colors",
                                        emailDetails ? "bg-purple-500/10 text-purple-400" : "bg-slate-800 text-slate-500"
                                    )}>
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-base font-medium cursor-pointer group-hover:text-purple-400 transition-colors">
                                            Email Notifications
                                        </Label>
                                        <p className="text-sm text-slate-500">
                                            Get updates on diagram processing and system alerts.
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailDetails}
                                    onCheckedChange={handleEmailToggle}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Security (Mockup) */}
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-800/60 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Shield className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Security & Access</CardTitle>
                                    <CardDescription>Manage your account security settings</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/30">
                                <div className="flex items-center gap-3">
                                    <Shield className={cn("h-4 w-4", twoFactorEnabled ? "text-emerald-500 flex-shrink-0" : "text-amber-500 flex-shrink-0")} />
                                    <div>
                                        <span className="text-sm font-medium block">Two-Factor Authentication</span>
                                        <span className="text-xs text-slate-500">
                                            {twoFactorEnabled ? "Protected with authenticator app" : "Not configured"}
                                        </span>
                                    </div>
                                </div>
                                <TwoFactorDialog status={twoFactorEnabled} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/30">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">Active Sessions</span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400">View All</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Status & Plan */}
                <div className="space-y-6">

                    {/* Plan Status Card */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award className="h-32 w-32 text-amber-500 rotate-12" />
                        </div>

                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-amber-500 border-amber-500/50 bg-amber-500/10">
                                    ENTERPRISE
                                </Badge>
                                <Cpu className="h-5 w-5 text-slate-500" />
                            </div>
                            <CardTitle className="text-xl text-amber-50 bg-amber-500/10 inline-block px-2 py-1 rounded">
                                Gold Star Edition
                            </CardTitle>
                            <CardDescription className="text-amber-500/60">
                                Your workspace is running on premium infrastructure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">AI Tokens</span>
                                    <span className="text-slate-200">Unlimited</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Storage</span>
                                    <span className="text-slate-200">500TB / 1PB</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full w-[5%]" />
                                </div>
                            </div>
                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white border-0">
                                Manage Subscription
                            </Button>
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-400">System Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-slate-300">API Gateway</span>
                                <span className="ml-auto text-xs text-emerald-500 font-mono">ONLINE</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-slate-300">AI Engine (GPT-4)</span>
                                <span className="ml-auto text-xs text-emerald-500 font-mono">OPERATIONAL</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-slate-300">Database</span>
                                <span className="ml-auto text-xs text-emerald-500 font-mono">CONNECTED</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center text-xs text-slate-600 font-mono">
                        Build ID: v1.0.0-gold-rc1<br />
                        Session: {sessionId}
                    </div>
                </div>
            </div>
        </div>
    )
}
