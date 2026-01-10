import { NextRequest, NextResponse } from 'next/server';
import { convertPDFToPNG } from '@/lib/pdf-converter';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Convert PDF URL to PNG for AI Vision analysis
 * 
 * This endpoint:
 * 1. Fetches the PDF from the URL
 * 2. Converts first page to PNG
 * 3. Returns the PNG as base64 data URL
 */
export async function POST(request: NextRequest) {
    try {
        const { pdfUrl } = await request.json();

        if (!pdfUrl) {
            return NextResponse.json(
                { error: 'PDF URL is required' },
                { status: 400 }
            );
        }

        // Fetch the PDF
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const pdfBuffer = Buffer.from(await response.arrayBuffer());

        // Convert to PNG
        const conversion = await convertPDFToPNG(pdfBuffer, {
            scale: 2.0, // Good quality for AI
            format: 'dataUrl' // Return as data URL
        });

        if (!conversion.success || !conversion.pngDataUrl) {
            throw new Error(conversion.error || 'PDF conversion failed');
        }

        return NextResponse.json({
            success: true,
            imageUrl: conversion.pngDataUrl,
            width: conversion.width,
            height: conversion.height,
        });

    } catch (error) {
        console.error('PDF to PNG conversion error:', error);
        return NextResponse.json(
            {
                error: 'Conversion failed',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
