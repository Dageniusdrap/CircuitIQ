import * as pdfjsLib from 'pdfjs-dist';
import { createCanvas } from 'canvas';

// Configure PDF.js worker
if (typeof window === 'undefined') {
    // Server-side configuration
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface PDFConversionResult {
    success: boolean;
    pngBuffer?: Buffer;
    pngDataUrl?: string;
    width?: number;
    height?: number;
    error?: string;
}

/**
 * Convert first page of PDF to PNG image
 * High quality for AI vision analysis
 */
export async function convertPDFToPNG(
    pdfBuffer: Buffer,
    options: {
        scale?: number; // Default 2.0 for high quality
        format?: 'buffer' | 'dataUrl';
    } = {}
): Promise<PDFConversionResult> {
    const { scale = 2.0, format = 'buffer' } = options;

    try {
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(pdfBuffer),
        });

        const pdf = await loadingTask.promise;

        // Get first page
        const page = await pdf.getPage(1);

        // Get viewport
        const viewport = page.getViewport({ scale });

        // Create canvas
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');

        // Render PDF page to canvas
        const renderContext = {
            canvasContext: context as any,
            viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert to PNG
        if (format === 'dataUrl') {
            const dataUrl = canvas.toDataURL('image/png');
            return {
                success: true,
                pngDataUrl: dataUrl,
                width: viewport.width,
                height: viewport.height,
            };
        } else {
            const pngBuffer = canvas.toBuffer('image/png');
            return {
                success: true,
                pngBuffer,
                width: viewport.width,
                height: viewport.height,
            };
        }
    } catch (error) {
        console.error('PDF conversion error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Extract multiple pages from PDF as PNGs
 */
export async function convertPDFPagesToPNG(
    pdfBuffer: Buffer,
    options: {
        pages?: number[]; // Specific pages to convert (1-indexed)
        maxPages?: number; // Maximum number of pages
        scale?: number;
    } = {}
): Promise<{
    success: boolean;
    images?: Array<{ pageNumber: number; buffer: Buffer; width: number; height: number }>;
    error?: string;
}> {
    const { pages, maxPages = 10, scale = 2.0 } = options;

    try {
        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(pdfBuffer),
        });

        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        // Determine which pages to convert
        const pagesToConvert = pages ||
            Array.from({ length: Math.min(totalPages, maxPages) }, (_, i) => i + 1);

        const images = [];

        for (const pageNum of pagesToConvert) {
            if (pageNum > totalPages) continue;

            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            await page.render({
                canvasContext: context as any,
                viewport: viewport,
            }).promise;

            const buffer = canvas.toBuffer('image/png');

            images.push({
                pageNumber: pageNum,
                buffer,
                width: viewport.width,
                height: viewport.height,
            });
        }

        return {
            success: true,
            images,
        };
    } catch (error) {
        console.error('Multi-page PDF conversion error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Check if file is a PDF
 */
export function isPDF(fileType: string): boolean {
    return fileType === 'application/pdf';
}

/**
 * Get optimal quality settings for different purposes
 */
export function getConversionSettings(purpose: 'ai-vision' | 'preview' | 'thumbnail') {
    switch (purpose) {
        case 'ai-vision':
            return { scale: 2.5, quality: 'high' }; // High quality for AI
        case 'preview':
            return { scale: 2.0, quality: 'medium' }; // Good for viewing
        case 'thumbnail':
            return { scale: 0.5, quality: 'low' }; // Small for thumbnails
    }
}
