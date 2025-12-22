"use client"

import { useState } from "react"
import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
    name: string
    url: string
    key: string
    status: "uploading" | "processing" | "completed" | "error"
    progress: number
}

export function UploadZone() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div className="space-y-6">
            <Card className="border-2 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
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
                            console.log("Files: ", res)
                            toast.success("Upload completed!")

                            // Add files to the list with completed status
                            const newFiles: UploadedFile[] = res.map(file => ({
                                name: file.name,
                                url: file.url,
                                key: file.key,
                                status: "processing",
                                progress: 100,
                            }))

                            setUploadedFiles(prev => [...prev, ...newFiles])
                            setIsUploading(false)
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`)
                            setIsUploading(false)
                        }}
                        onUploadBegin={(name) => {
                            console.log("Uploading: ", name)
                            setIsUploading(true)

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
                            console.log("Progress: ", progress)
                            // Update progress for the last file
                            setUploadedFiles(prev => {
                                const newFiles = [...prev]
                                if (newFiles.length > 0) {
                                    newFiles[newFiles.length - 1].progress = progress
                                }
                                return newFiles
                            })
                        }}
                        appearance={{
                            button: "bg-blue-600 hover:bg-blue-700",
                            container: "border-slate-700",
                        }}
                    />
                </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Processing Queue</CardTitle>
                        <CardDescription>
                            {uploadedFiles.filter(f => f.status === "completed").length} of {uploadedFiles.length} files processed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-sm">{file.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {file.status === "uploading" && "Uploading..."}
                                                {file.status === "processing" && "Processing with AI..."}
                                                {file.status === "completed" && "Completed"}
                                                {file.status === "error" && "Error"}
                                            </p>
                                        </div>
                                    </div>
                                    {file.status === "uploading" && (
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    )}
                                    {file.status === "processing" && (
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    )}
                                    {file.status === "completed" && (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    {file.status === "error" && (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <Progress value={file.progress} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
