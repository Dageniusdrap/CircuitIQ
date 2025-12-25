import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { Diagram } from "@prisma/client"

export function DiagramCard({ diagram }: { diagram: Diagram }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-start gap-2">
                    <span className="truncate text-lg">{diagram.title}</span>
                    <Badge variant={diagram.status === "COMPLETED" ? "default" : "secondary"}>
                        {diagram.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">System:</span>
                    <span>{diagram.system || "Unknown"}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span>{diagram.manufacturer} {diagram.model}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/diagrams/${diagram.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
