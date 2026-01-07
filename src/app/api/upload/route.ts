import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { convertPDFToPNG, isPDF } from '@/lib/pdf-converter';

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

        // Upload original file to Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        let pngUrl: string | null = null;
        let pngKey: string | null = null;

        // If PDF, convert to PNG for AI vision
        if (isPDF(file.type)) {
            console.log('PDF detected, converting to PNG for AI vision...');

            try {
                // Convert file to buffer
                const arrayBuffer = await file.arrayBuffer();
                const pdfBuffer = Buffer.from(arrayBuffer);

                // Convert first page to PNG (high quality for AI)
                const conversion = await convertPDFToPNG(pdfBuffer, {
                    scale: 2.5, // High quality for AI vision
                    format: 'buffer'
                });

                if (conversion.success && conversion.pngBuffer) {
                    // Upload PNG to Vercel Blob
                    const pngFileName = file.name.replace(/\.pdf$/i, '.png');
                    const pngBlob = await put(pngFileName, conversion.pngBuffer, {
                        access: 'public',
                        addRandomSuffix: true,
                        contentType: 'image/png',
                    });

                    pngUrl = pngBlob.url;
                    pngKey = pngBlob.pathname;

                    console.log('✅ PDF converted to PNG successfully');
                } else {
                    console.warn('⚠️ PDF conversion failed:', conversion.error);
                }
            } catch (conversionError) {
                console.error('PDF conversion error:', conversionError);
                // Continue with upload even if conversion fails
            }
        }

        // Create database record
        const diagram = await prisma.diagram.create({
            data: {
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                fileUrl: blob.url,
                fileKey: blob.pathname,
                fileSize: file.size,
                fileType: file.type,
                vehicleType: (vehicleType as any) || 'AIRCRAFT',
                manufacturer: 'Unknown', // User can update later
                model: 'Unknown', // User can update later  
                system: 'Electrical', // Default system
                uploadedById: session.user.id,
                status: 'COMPLETED', // File is ready immediately after upload
                // Store PNG URL for AI vision (if PDF was converted)
                analysisImageUrl: pngUrl,
                analysisImageKey: pngKey,
            },
        });

        return NextResponse.json({
            success: true,
            diagram: {
                id: diagram.id,
                url: blob.url,
                pngUrl: pngUrl, // Include PNG URL for AI vision
                name: file.name,
                size: file.size,
                isPDF: isPDF(file.type),
                hasAIImage: !!pngUrl,
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
