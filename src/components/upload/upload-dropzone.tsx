"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface UploadedFile {
    id: string
    name: string
    size: number
    url: string
    status: 'uploading' | 'success' | 'error'
    progress: number
    error?: string
}

interface UploadDropzoneProps {
    vehicleType: string
    onUploadComplete?: (files: UploadedFile[]) => void
}

export function UploadDropzone({ vehicleType, onUploadComplete }: UploadDropzoneProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const uploadFile = async (file: File) => {
        const tempId = Math.random().toString(36)

        // Add file to state
        setFiles(prev => [...prev, {
            id: tempId,
            name: file.name,
            size: file.size,
            url: '',
            status: 'uploading',
            progress: 0,
        }])

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('vehicleType', vehicleType)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Upload failed')
            }

            const data = await response.json()

            // Update file status to success
            setFiles(prev => prev.map(f =>
                f.id === tempId
                    ? { ...f, status: 'success' as const, progress: 100, url: data.diagram.url, id: data.diagram.id }
                    : f
            ))

            toast.success(`${file.name} uploaded successfully!`)

            // Trigger callback to refresh recent uploads
            if (onUploadComplete) {
                onUploadComplete(files)
            }

        } catch (error) {
            // Update file status to error
            setFiles(prev => prev.map(f =>
                f.id === tempId
                    ? { ...f, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
                    : f
            ))

            toast.error(error instanceof Error ? error.message : 'Upload failed')
        }
    }

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return

        const validFiles = Array.from(fileList).filter(file => {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
            const maxSize = 32 * 1024 * 1024 // 32MB

            if (!validTypes.includes(file.type)) {
                toast.error(`${file.name}: Invalid file type`)
                return false
            }

            if (file.size > maxSize) {
                toast.error(`${file.name}: File too large (max 32MB)`)
                return false
            }

            return true
        })

        validFiles.forEach(uploadFile)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    "relative rounded-2xl border-2 border-dashed transition-all duration-300",
                    isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10"
                )}
            >
                <div className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                        {isDragging ? 'Drop files here' : 'Upload Wiring Diagrams'}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-6">
                        Drag and drop files here, or click to browse
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        // @ts-ignore - webkitdirectory is not in TypeScript types but works
                        webkitdirectory=""
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />

                    <div className="flex gap-3">
                        <Button
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.removeAttribute('webkitdirectory')
                                    fileInputRef.current.click()
                                }
                            }}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Files
                        </Button>

                        <Button
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.setAttribute('webkitdirectory', '')
                                    fileInputRef.current.click()
                                }
                            }}
                            variant="outline"
                            className="border-primary/30 hover:bg-primary/10"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Folder
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                        Supports: PDF, PNG, JPG • Max size: 32MB
                    </p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-3">
                    {files.map((file) => (
                        <Card key={file.id} className="border-white/5 bg-card/40">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div className={cn(
                                        "p-3 rounded-xl shrink-0",
                                        file.status === 'success' && "bg-green-500/10 text-green-500",
                                        file.status === 'error' && "bg-red-500/10 text-red-500",
                                        file.status === 'uploading' && "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {file.status === 'uploading' && <Loader2 className="w-5 h-5 animate-spin" />}
                                        {file.status === 'success' && <CheckCircle2 className="w-5 h-5" />}
                                        {file.status === 'error' && <AlertCircle className="w-5 h-5" />}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatFileSize(file.size)}
                                            {file.status === 'uploading' && ' • Uploading...'}
                                            {file.status === 'success' && ' • Upload complete'}
                                            {file.status === 'error' && ` • ${file.error}`}
                                        </p>
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0"
                                        onClick={() => removeFile(file.id)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
