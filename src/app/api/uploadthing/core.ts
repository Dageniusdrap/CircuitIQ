import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const f = createUploadthing()

export const ourFileRouter = {
    diagramUploader: f({
        pdf: { maxFileSize: "32MB", maxFileCount: 20 },
        image: { maxFileSize: "16MB", maxFileCount: 20 },
        blob: { maxFileSize: "64MB", maxFileCount: 10 }, // For DWG and others
    })
        .middleware(async ({ req }) => {
            const session = await auth()

            if (!session?.user) {
                throw new Error("Unauthorized - Please login to upload files")
            }

            // Check user role permissions
            const allowedRoles = ["ADMIN", "ENGINEER", "TECHNICIAN"]
            if (!allowedRoles.includes(session.user.role)) {
                throw new Error("Insufficient permissions to upload files")
            }

            return {
                userId: session.user.id,
                userRole: session.user.role,
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId)
            console.log("File URL:", file.url)
            console.log("File key:", file.key)

            // Create initial diagram record with PENDING status
            try {
                await prisma.diagram.create({
                    data: {
                        title: file.name,
                        fileUrl: file.url,
                        fileKey: file.key,
                        fileType: file.type,
                        fileSize: file.size,
                        status: "PENDING",
                        vehicleType: "AIRCRAFT", // Default, will be updated later
                        manufacturer: "Unknown",
                        model: "Unknown",
                        system: "Unknown",
                        uploadedById: metadata.userId,
                    },
                })

                // Here you would typically trigger a background job to process the diagram
                // For now, we'll just log it
                console.log("Diagram record created, ready for AI processing")
            } catch (error) {
                console.error("Error creating diagram record:", error)
            }

            return {
                uploadedBy: metadata.userId,
                fileUrl: file.url,
                fileKey: file.key,
            }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
