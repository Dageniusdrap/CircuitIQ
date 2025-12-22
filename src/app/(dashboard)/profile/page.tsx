import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
    const session = await auth()
    const user = session?.user

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="text-2xl bg-blue-600">
                            {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-xl font-medium">{user?.name}</h3>
                        <p className="text-slate-400">{user?.email}</p>
                        <div className="pt-2">
                            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-400 text-sm">No recent activity to show.</p>
                </CardContent>
            </Card>
        </div>
    )
}
