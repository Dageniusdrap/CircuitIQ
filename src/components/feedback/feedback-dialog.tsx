"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MessageSquarePlus, Bug, Lightbulb, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface FeedbackDialogProps {
    trigger?: React.ReactNode
}

export function FeedbackDialog({ trigger }: FeedbackDialogProps) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<"bug" | "feature" | "improvement" | "other">("bug")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [rating, setRating] = useState<number | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    title,
                    description,
                    page: window.location.pathname,
                    rating,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit feedback")
            }

            toast.success("Thank you for your feedback!", {
                description: "We'll review your suggestion and get back to you soon.",
            })

            // Reset form
            setTitle("")
            setDescription("")
            setRating(undefined)
            setType("bug")
            setOpen(false)
        } catch (error) {
            console.error("Feedback error:", error)
            toast.error("Failed to submit feedback", {
                description: "Please try again later.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm">
                        <MessageSquarePlus className="h-4 w-4 mr-2" />
                        Send Feedback
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Send Feedback</DialogTitle>
                    <DialogDescription>
                        Help us improve CircuitIQ by sharing your thoughts, reporting bugs, or suggesting features.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Feedback Type */}
                    <div className="space-y-3">
                        <Label>Feedback Type</Label>
                        <RadioGroup value={type} onValueChange={(value: any) => setType(value)} className="grid grid-cols-2 gap-3">
                            <div>
                                <RadioGroupItem value="bug" id="bug" className="peer sr-only" />
                                <Label
                                    htmlFor="bug"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <Bug className="mb-2 h-6 w-6" />
                                    <span className="font-medium">Bug Report</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="feature" id="feature" className="peer sr-only" />
                                <Label
                                    htmlFor="feature"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <Lightbulb className="mb-2 h-6 w-6" />
                                    <span className="font-medium">Feature Request</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="improvement" id="improvement" className="peer sr-only" />
                                <Label
                                    htmlFor="improvement"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <Sparkles className="mb-2 h-6 w-6" />
                                    <span className="font-medium">Improvement</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="other" id="other" className="peer sr-only" />
                                <Label
                                    htmlFor="other"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <AlertCircle className="mb-2 h-6 w-6" />
                                    <span className="font-medium">Other</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder={
                                type === "bug" ? "e.g., Upload page crashes when selecting large PDF" :
                                    type === "feature" ? "e.g., Add export to Excel functionality" :
                                        "Brief summary of your feedback"
                            }
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            placeholder={
                                type === "bug" ? "Please describe what happened, what you expected, and steps to reproduce..." :
                                    type === "feature" ? "Describe the feature you'd like to see and how it would help you..." :
                                        "Tell us more about your feedback..."
                            }
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={6}
                            maxLength={2000}
                        />
                        <p className="text-xs text-muted-foreground">
                            {description.length}/2000 characters
                        </p>
                    </div>

                    {/* Rating (Optional) */}
                    <div className="space-y-2">
                        <Label>Overall Experience (Optional)</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-colors ${rating && star <= rating ? "text-yellow-500" : "text-muted-foreground"
                                        } hover:text-yellow-400`}
                                >
                                    ★
                                </button>
                            ))}
                            {rating && (
                                <span className="text-sm text-muted-foreground ml-2">
                                    {rating}/5 stars
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
