import { cn } from "@/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-muted/50",
                "before:absolute before:inset-0",
                "before:-translate-x-full",
                "before:animate-[shimmer_2s_infinite]",
                "before:bg-gradient-to-r",
                "before:from-transparent before:via-white/10 before:to-transparent",
                className
            )}
            {...props}
        />
    )
}

export function StatCardSkeleton() {
    return (
        <div className="relative overflow-hidden border border-white/5 bg-card/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
        </div>
    )
}

export function DiagramCardSkeleton() {
    return (
        <div className="relative overflow-hidden border border-white/5 bg-card/40 backdrop-blur-sm rounded-xl p-4">
            <div className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-white/5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
        </div>
    )
}
