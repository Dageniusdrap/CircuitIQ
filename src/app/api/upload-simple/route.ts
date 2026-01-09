import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * SIMPLIFIED UPLOAD - RELIABLE & FAST
 * 
 * This version:
 * 1. Uploads file to Vercel Blob
 * 2. Saves record to database
 * 3. Returns success immediately
 * 
 * PDF conversion happens asynchronously (future enhancement)
 */
export async function POST(request: Request) {
    try {
        // 1. Authenticate user
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please sign in to upload diagrams' },
                { status: 401 }
            );
        }

        // 2. Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const vehicleType = (formData.get('vehicleType') as string) || 'AIRCRAFT';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // 3. Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF, PNG, and JPG files are allowed.' },
                { status: 400 }
            );
        }

        // 4. Validate file size (32MB max)
        const maxSize = 32 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 32MB.' },
                { status: 400 }
            );
        }

        console.log(`📤 Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

        // 5. Upload to Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        console.log(`✅ Uploaded to Blob: ${blob.url}`);

        // 6. Extract metadata from filename
        const fileName = file.name.replace(/\.(pdf|png|jpg|jpeg)$/i, '');
        const isPDF = file.type === 'application/pdf';

        // 7. Create database record
        const diagram = await prisma.diagram.create({
            data: {
                title: fileName,
                fileUrl: blob.url,
                fileKey: blob.pathname,
                fileType: file.type,
                fileSize: file.size,
                vehicleType: vehicleType.toUpperCase(),
                manufacturer: 'Unknown', // Will be extracted by AI later
                model: fileName,
                system: 'Unknown', // Will be extracted by AI later
                status: isPDF ? 'PROCESSING' : 'READY', // PDFs need conversion
                confidence: 0,
                uploadedById: session.user.id,
            },
        });

        console.log(`✅ Database record created: ${diagram.id}`);

        // 8. Track usage (non-blocking)
        try {
            // Import here to avoid circular dependencies
            const { trackUsage } = await import('@/lib/usage-tracking');
            await trackUsage(session.user.id, 'DIAGRAM_UPLOAD');
        } catch (trackingError) {
            console.error('Usage tracking failed (non-critical):', trackingError);
        }

        // 9. Return success
        return NextResponse.json({
            success: true,
            diagram: {
                id: diagram.id,
                title: diagram.title,
                fileUrl: diagram.fileUrl,
                status: diagram.status,
                vehicleType: diagram.vehicleType,
                isPDF,
            },
            message: isPDF
                ? 'PDF uploaded successfully! Processing will complete shortly.'
                : 'Diagram uploaded successfully!',
        });

    } catch (error) {
        console.error('❌ Upload error:', error);

        return NextResponse.json(
            {
                error: 'Upload failed',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
