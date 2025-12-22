import { Metadata } from "next"
import { TeammateChat } from "@/components/diagnostics/teammate-chat"

export const metadata: Metadata = {
    title: "Diagnostics | CircuitIQ",
    description: "Chat with your AI diagnostic teammate",
}

export default function DiagnosticsPage() {
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Diagnostics</h1>
                <p className="text-slate-400">Collaborate with your AI teammate to solve complex issues</p>
            </div>
            <div className="flex-1 min-h-0">
                <TeammateChat vehicleInfo={{ make: "Boeing", model: "737", type: "aircraft" }} />
            </div>
        </div>
    )
}
