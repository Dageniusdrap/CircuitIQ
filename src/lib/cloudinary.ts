import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured (lazy initialization)
function ensureCloudinaryConfigured() {
    if (!cloudinary.config().cloud_name) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
}

/**
 * Upload PDF to Cloudinary and get JPG conversion URL
 * 
 * Cloudinary automatically converts PDFs to images!
 */
export async function uploadPDFToCloudinary(
    pdfBuffer: Buffer,
    filename: string
): Promise<{
    success: boolean;
    pdfUrl?: string;
    imageUrl?: string;
    publicId?: string;
    error?: string;
}> {
    ensureCloudinaryConfigured();
    try {
        // Upload PDF to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'circuitiq/diagrams',
                    public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension
                    format: 'pdf',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(pdfBuffer);
        });

        // Get the PDF URL
        const pdfUrl = uploadResult.secure_url;

        // Generate image URL from PDF (first page as JPG)
        const imageUrl = cloudinary.url(uploadResult.public_id, {
            format: 'jpg',
            page: 1, // First page
            quality: 'auto:best',
            fetch_format: 'auto',
        });

        return {
            success: true,
            pdfUrl,
            imageUrl,
            publicId: uploadResult.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImageToCloudinary(
    imageBuffer: Buffer,
    filename: string
): Promise<{
    success: boolean;
    imageUrl?: string;
    publicId?: string;
    error?: string;
}> {
    ensureCloudinaryConfigured();
    try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'circuitiq/diagrams',
                    public_id: filename.replace(/\.[^/.]+$/, ''),
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(imageBuffer);
        });

        return {
            success: true,
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Get image URL from PDF public ID
 */
export function getPDFImageUrl(publicId: string, page: number = 1): string {
    return cloudinary.url(publicId, {
        format: 'jpg',
        page,
        quality: 'auto:best',
        fetch_format: 'auto',
    });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}

export default cloudinary;
