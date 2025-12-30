import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentAnalyses } from "@/components/dashboard/recent-analyses"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UploadedDocumentsWidget } from "@/components/upload/uploaded-documents-widget"
import { FileText, MessageSquare, CheckCircle, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Dashboard | CircuitIQ",
    description: "Your diagnostic dashboard",
}

export default async function DashboardPage() {
    const session = await auth()

    // If no session, provide empty data
    if (!session?.user?.id) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Welcome! Please sign in to view your dashboard.
                    </p>
                </div>
            </div>
        )
    }

    // Fetch stats and diagrams in parallel
    const [diagramCount, analysisCount, resolvedCount, recentDiagrams] = await Promise.all([
        prisma.diagram.count({
            where: { uploadedById: session.user.id },
        }),
        prisma.analysis.count({
            where: { userId: session.user.id },
        }),
        prisma.analysis.count({
            where: {
                userId: session.user.id,
                successful: true,
            },
        }),
        prisma.diagram.findMany({
            where: { uploadedById: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
        }),
    ])

    const avgResolutionTime = 18 // Calculate from actual data

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                    Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}! Here&apos;s your diagnostic overview
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    <RecentAnalyses userId={session?.user?.id || ""} />
                    <QuickActions />
                </div>

                {/* Right Column - 1/3 width */}
                <div className="lg:col-span-1">
                    <UploadedDocumentsWidget
                        diagrams={recentDiagrams}
                        title="Recent Documents"
                        maxItems={8}
                        showSearch={false}
                        allowSelection={false}
                    />
                </div>
            </div>
        </div>
    )
}
