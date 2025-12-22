import { Metadata } from "next"
import { UploadZone } from "@/components/upload/upload-zone"

export const metadata: Metadata = {
    title: "Upload Diagrams | CircuitIQ",
    description: "Upload and process wiring diagrams",
}

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Upload Diagrams</h1>
                <p className="text-slate-400 mt-1">
                    Upload and process new wiring diagrams with AI
                </p>
            </div>

            <UploadZone />
        </div>
    )
}
