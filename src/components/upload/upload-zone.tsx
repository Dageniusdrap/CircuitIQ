"use client"

import { useState } from "react"
import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// import Link from "next/link" // Ensure Link is imported
import Link from "next/link"
import { Upload, FileText, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
    name: string
    url: string
    key: string
    status: "uploading" | "processing" | "completed" | "error"
    progress: number
    diagramId?: string // We can't really get this back easily from uploadthing client callback without a custom server action return, but let's simulate or improve logic later.
}

export function UploadZone() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

    return (
        <div className="space-y-6">
            <Card className="border-2 border-dashed border-slate-700 bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-blue-500" />
                        Upload Wiring Diagrams
                    </CardTitle>
                    <CardDescription>
                        Upload PDF, PNG, JPG, or DWG files. Maximum 32MB per file.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadDropzone
                        endpoint="diagramUploader"
                        onClientUploadComplete={(res) => {

                            toast.success("Upload completed!")

                            // Add files to the list with completed status
                            const newFiles: UploadedFile[] = res.map(file => ({
                                name: file.name,
                                url: file.url,
                                key: file.key,
                                status: "completed",
                                progress: 100,
                                diagramId: (file.serverData as { diagramId?: string })?.diagramId
                            }))

                            setUploadedFiles(prev => {
                                // Remove the uploading placeholders
                                const filtered = prev.filter(f => f.status !== "uploading")
                                return [...filtered, ...newFiles]
                            })
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`)
                            setUploadedFiles(prev => prev.map(f => f.status === "uploading" ? { ...f, status: "error" } : f))
                        }}
                        onUploadBegin={(name) => {


                            // Add file to list with uploading status
                            setUploadedFiles(prev => [...prev, {
                                name,
                                url: "",
                                key: "",
                                status: "uploading",
                                progress: 0,
                            }])
                        }}
                        onUploadProgress={(progress) => {
                            // Update progress for the last file
                            setUploadedFiles(prev => {
                                const newFiles = [...prev]
                                const uploadingFile = newFiles.find(f => f.status === "uploading")
                                if (uploadingFile) {
                                    uploadingFile.progress = progress
                                }
                                return newFiles
                            })
                        }}
                        appearance={{
                            button: "bg-blue-600 hover:bg-blue-700 text-white",
                            container: "border-slate-700 hover:border-blue-500 transition-colors",
                            label: "text-blue-400 hover:text-blue-300",
                            allowedContent: "text-slate-400"
                        }}
                    />
                </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
                <Card className="border-slate-800 bg-slate-900">
                    <CardHeader>
                        <CardTitle>Processing Queue</CardTitle>
                        <CardDescription>
                            {uploadedFiles.filter(f => f.status === "completed").length} of {uploadedFiles.length} files processed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-900 rounded-md">
                                            <FileText className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-slate-200">{file.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {file.status === "uploading" && "Uploading..."}
                                                {file.status === "processing" && "AI Processing..."}
                                                {file.status === "completed" && "Ready for review"}
                                                {file.status === "error" && "Upload failed"}
                                            </p>
                                        </div>
                                    </div>
                                    {file.status === "uploading" && (
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    )}
                                    {file.status === "completed" && (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                                            <Button asChild size="sm" variant="secondary" className="h-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Link href={file.diagramId ? `/diagrams/${file.diagramId}` : "/diagrams"}>
                                                    {file.diagramId ? "Analyze Diagram" : "View Library"} <ArrowRight className="ml-2 h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                    {file.status === "error" && (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                {file.status === "uploading" && (
                                    <Progress value={file.progress} className="h-1 bg-slate-800" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
