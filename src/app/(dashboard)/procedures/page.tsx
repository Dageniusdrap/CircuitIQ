import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProcedureLibrary } from "@/components/procedures/procedure-library"

export const metadata: Metadata = {
    title: "Procedures | CircuitIQ",
    description: "Operational procedures and system guides",
}

export default async function ProceduresPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                    System Procedures
                </h1>
                <p className="text-muted-foreground text-lg">
                    Step-by-step operational guides to help you understand electrical systems
                </p>
            </div>

            <ProcedureLibrary />
        </div>
    )
}
