import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SecuritySettings } from "@/components/settings/security-settings";
import { Settings, Shield, Bell, User, CreditCard } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Settings | CircuitIQ",
    description: "Manage your account settings and security preferences",
};

function SettingsNav({ active }: { active: string }) {
    const items = [
        { id: "profile", label: "Profile", icon: User, href: "/settings" },
        { id: "security", label: "Security", icon: Shield, href: "/settings/security" },
        { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
        { id: "billing", label: "Billing", icon: CreditCard, href: "/settings/billing" },
    ];

    return (
        <nav className="flex flex-col gap-1">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active === item.id
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}

export default async function SecuritySettingsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login?callbackUrl=/settings/security");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                        <Settings className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                        <p className="text-slate-400">Manage your account and preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sticky top-24">
                            <SettingsNav active="security" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <SecuritySettings />
                    </div>
                </div>
            </div>
        </div>
    );
}
