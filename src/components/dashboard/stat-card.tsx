import { LucideIcon } from "lucide-react"
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
        <Card className="border-slate-700 hover:border-slate-600 transition-all">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">{label}</p>
                        <p className="text-3xl font-bold mt-2">{value}</p>
                        {trend && (
                            <p className="text-sm text-emerald-400 mt-2">↑ {trend} from last month</p>
                        )}
                    </div>
                    <div className={cn("p-3 rounded-lg", color)}>
                        <Icon size={24} className="text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
