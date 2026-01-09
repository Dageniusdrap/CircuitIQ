import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log('📤 Test Upload - File:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Simple upload test
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        console.log('✅ Upload successful:', blob.url);

        return NextResponse.json({
            success: true,
            url: blob.url,
            pathname: blob.pathname,
            size: file.size,
            type: file.type,
            name: file.name,
        });
    } catch (error) {
        console.error('❌ Test upload error:', error);
        return NextResponse.json(
            {
                error: 'Upload failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}
