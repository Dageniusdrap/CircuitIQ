import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentAnalyses({ userId }: { userId: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-500 text-sm">No recent activity found.</p>
                <p className="text-xs text-slate-700 mt-2">Displaying activity for user {userId}</p>
            </CardContent>
        </Card>
    )
}
