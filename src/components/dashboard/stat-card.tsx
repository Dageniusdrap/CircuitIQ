import { LucideIcon, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    icon: LucideIcon
    label: string
    value: string
    trend?: string
    color: string
}

export function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    color,
}: StatCardProps) {
    return (
        <Card className="group relative overflow-hidden border-white/5 bg-card/40 backdrop-blur-sm hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Subtle mesh pattern */}
            <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            <CardContent className="relative pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                                {value}
                            </p>
                            {trend && (
                                <div className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
                                    <TrendingUp size={14} />
                                    <span>{trend}</span>
                                </div>
                            )}
                        </div>
                        {trend && (
                            <p className="text-xs text-muted-foreground/60 mt-2">vs last period</p>
                        )}
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                        color
                    )}>
                        <Icon size={24} className="text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
