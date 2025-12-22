"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Zap } from "lucide-react"

export function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button asChild className="w-full justify-start" size="lg">
                    <Link href="/upload">
                        <Upload className="mr-2 h-5 w-5" />
                        Upload New Diagram
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                    <Link href="/diagrams">
                        <FileText className="mr-2 h-5 w-5" />
                        View Library
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                    <Link href="/diagnostics">
                        <Zap className="mr-2 h-5 w-5" />
                        Start Diagnostic Chat
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
