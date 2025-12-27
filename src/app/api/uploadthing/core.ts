import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const f = createUploadthing()

export const ourFileRouter = {
    diagramUploader: f({
        pdf: { maxFileSize: "32MB", maxFileCount: 20 },
        image: { maxFileSize: "16MB", maxFileCount: 20 },
        blob: { maxFileSize: "64MB", maxFileCount: 10 }, // For DWG and others
    })
        .input(z.object({
            vehicleType: z.enum(["AIRCRAFT", "AUTOMOTIVE", "MARINE", "ELECTRIC_VEHICLE"])
        }))
        .middleware(async ({ input }) => {
            const session = await auth()

            if (!session?.user) {
                throw new Error("Unauthorized - Please login to upload files")
            }

            // Check user role permissions
            const allowedRoles = ["ADMIN", "ENGINEER", "TECHNICIAN"]
            // if (!allowedRoles.includes(session.user.role)) {
            //     throw new Error("Insufficient permissions to upload files")
            // }

            return {
                userId: session.user.id,
                userRole: session.user.role,
                vehicleType: input.vehicleType,
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId)
            console.log("File URL:", file.url)
            console.log("File key:", file.key)
            console.log("Vehicle type:", metadata.vehicleType)

            // Create initial diagram record with PENDING status
            let diagramId = "";
            try {
                const diagram = await prisma.diagram.create({
                    data: {
                        title: file.name,
                        fileUrl: file.url,
                        fileKey: file.key,
                        fileType: file.type,
                        fileSize: file.size,
                        status: "PENDING",
                        vehicleType: metadata.vehicleType,
                        manufacturer: "Unknown",
                        model: "Unknown",
                        system: "Unknown",
                        uploadedById: metadata.userId,
                    },
                })
                diagramId = diagram.id;

                console.log("Diagram record created, ready for AI processing")
            } catch (error) {
                console.error("Error creating diagram record:", error)
                // Use UploadThingError to send message to client
                throw new Error("Failed to save diagram record to database")
            }

            return {
                uploadedBy: metadata.userId,
                fileUrl: file.url,
                fileKey: file.key,
                diagramId: diagramId
            }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
