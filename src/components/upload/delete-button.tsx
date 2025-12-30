"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteDiagram } from "@/actions/diagram"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    diagramId: string
    title: string
}

export function DeleteButton({ diagramId, title }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return
        }

        startTransition(async () => {
            const result = await deleteDiagram(diagramId)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Diagram deleted successfully")
                router.refresh()
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
            onClick={handleDelete}
            disabled={isPending}
            title="Delete Diagram"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
        </Button>
    )
}
