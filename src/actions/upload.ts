"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

/**
 * Server action to force refresh the upload page after new diagrams are uploaded
 */
export async function refreshUploadPage() {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    // Revalidate both upload and diagrams pages
    revalidatePath("/upload")
    revalidatePath("/diagrams")

    return { success: true }
}
