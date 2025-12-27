import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CommandPalette } from "@/components/ui/command-palette"
import { DashboardClientComponents } from "@/components/dashboard/dashboard-client"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen bg-slate-900">
            <CommandPalette />
            <DashboardClientComponents />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
