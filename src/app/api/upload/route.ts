import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadPDFToCloudinary, uploadImageToCloudinary } from '@/lib/cloudinary';
import { trackUsage, checkUsageLimit } from '@/lib/usage-tracking';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        // Authenticate user
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check usage limits (don't block upload if this fails)
        try {
            const usageCheck = await checkUsageLimit(session.user.id, 'DIAGRAM_UPLOAD');
            if (!usageCheck.allowed) {
                return NextResponse.json(
                    {
                        error: 'Upload limit reached',
                        message: `You've reached your upload limit of ${usageCheck.limit} diagrams this month. Please upgrade your plan to upload more.`,
                        current: usageCheck.current,
                        limit: usageCheck.limit,
                        percentage: usageCheck.percentage,
                    },
                    { status: 429 } // Too Many Requests
                );
            }
        } catch (limitError) {
            console.error('Error checking usage limits:', limitError);
            // Continue with upload even if limit check fails
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const vehicleType = formData.get('vehicleType') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF, PNG, and JPG files are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (32MB max)
        const maxSize = 32 * 1024 * 1024; // 32MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 32MB.' },
                { status: 400 }
            );
        }

        console.log(`📤 Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        let fileUrl: string;
        let imageUrl: string;
        let cloudinaryPublicId: string;
        const isPDF = file.type === 'application/pdf';

        if (isPDF) {
            // Upload PDF to Cloudinary - gets automatic image conversion!
            console.log('📄 PDF detected - uploading to Cloudinary for conversion...');

            const cloudinaryResult = await uploadPDFToCloudinary(fileBuffer, file.name);

            if (!cloudinaryResult.success) {
                throw new Error(cloudinaryResult.error || 'PDF upload failed');
            }

            fileUrl = cloudinaryResult.pdfUrl!;
            imageUrl = cloudinaryResult.imageUrl!;
            cloudinaryPublicId = cloudinaryResult.publicId!;

            console.log('✅ PDF uploaded and converted to image!');
            console.log('   PDF URL:', file Url);
            console.log('   Image URL:', imageUrl);
        } else {
            // Upload image to Cloudinary
            console.log('🖼️ Image detected - uploading to Cloudinary...');

            const cloudinaryResult = await uploadImageToCloudinary(fileBuffer, file.name);

            if (!cloudinaryResult.success) {
                throw new Error(cloudinaryResult.error || 'Image upload failed');
            }

            fileUrl = cloudinaryResult.imageUrl!;
            imageUrl = cloudinaryResult.imageUrl!;
            cloudinaryPublicId = cloudinaryResult.publicId!;

            console.log('✅ Image uploaded!');
        }

        // Create database record
        const diagram = await prisma.diagram.create({
            data: {
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                fileUrl: fileUrl, // Cloudinary URL
                fileKey: cloudinaryPublicId, // Cloudinary public ID
                fileSize: file.size,
                fileType: file.type,
                vehicleType: (vehicleType as any) || 'AIRCRAFT',
                manufacturer: 'Unknown', // User can update later
                model: 'Unknown', // User can update later  
                system: 'Electrical', // Default system
                uploadedById: session.user.id,
                status: 'COMPLETED', // File is ready immediately after upload
                // Store image URL for AI vision (converted from PDF if needed)
                analysisImageUrl: imageUrl,
                analysisImageKey: cloudinaryPublicId,
            },
        });

        // Track usage (don't block on this)
        trackUsage({
            userId: session.user.id,
            action: 'DIAGRAM_UPLOAD',
            resourceId: diagram.id,
            metadata: {
                fileSize: file.size,
                fileType: file.type,
                isPDF: isPDF,
                hasAIImage: true, // Cloudinary always provides an image
                cloudinary: true,
            },
        }).catch(err => console.error('Failed to track usage:', err));

        return NextResponse.json({
            success: true,
            diagram: {
                id: diagram.id,
                url: fileUrl,
                imageUrl: imageUrl, // Image URL for AI analysis
                name: file.name,
                size: file.size,
                isPDF: isPDF,
                hasAIImage: true,
            },
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );
    }
}
