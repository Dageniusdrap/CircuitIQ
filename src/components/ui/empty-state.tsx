import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Animated icon container */}
            <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-white/5 backdrop-blur-sm">
                    <Icon className="h-16 w-16 text-primary/60" strokeWidth={1.5} />
                </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {title}
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                {description}
            </p>

            {/* Action button */}
            {actionLabel && actionHref && (
                <Button asChild size="lg" className="gap-2">
                    <Link href={actionHref}>
                        {actionLabel}
                    </Link>
                </Button>
            )}
        </div>
    )
}
