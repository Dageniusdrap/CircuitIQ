import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentAnalyses } from "@/components/dashboard/recent-analyses"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { FileText, MessageSquare, CheckCircle, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Dashboard | CircuitIQ",
    description: "Your diagnostic dashboard",
}

export default async function DashboardPage() {
    const session = await auth()

    // Fetch stats
    const [diagramCount, analysisCount, resolvedCount] = await Promise.all([
        prisma.diagram.count({
            where: { uploadedById: session?.user?.id },
        }),
        prisma.analysis.count({
            where: { userId: session?.user?.id },
        }),
        prisma.analysis.count({
            where: {
                userId: session?.user?.id,
                successful: true,
            },
        }),
    ])

    const avgResolutionTime = 18 // Calculate from actual data

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-slate-400 mt-1">
                    Overview of your diagnostic activities
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={FileText}
                    label="Total Diagrams"
                    value={diagramCount.toString()}
                    trend="+12%"
                    color="bg-blue-600"
                />
                <StatCard
                    icon={MessageSquare}
                    label="Diagnostics Run"
                    value={analysisCount.toString()}
                    trend="+28%"
                    color="bg-emerald-600"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Issues Resolved"
                    value={resolvedCount.toString()}
                    trend="+18%"
                    color="bg-purple-600"
                />
                <StatCard
                    icon={Zap}
                    label="Avg Resolution Time"
                    value={`${avgResolutionTime} min`}
                    trend="+35%"
                    color="bg-amber-600"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentAnalyses userId={session?.user?.id!} />
                <QuickActions />
            </div>
        </div>
    )
}
