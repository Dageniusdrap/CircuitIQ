/**
 * Migrate existing diagrams from Vercel Blob to Cloudinary
 * 
 * This script:
 * 1. Fetches all diagrams with PDFs
 * 2. Downloads from Vercel Blob
 * 3. Uploads to Cloudinary
 * 4. Updates database with Cloudinary URLs
 */

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { prisma } from '../src/lib/db';
import { uploadPDFToCloudinary, uploadImageToCloudinary } from '../src/lib/cloudinary';

async function migrateDiagrams() {
    console.log('🚀 Starting diagram migration to Cloudinary...\n');

    try {
        // Get all diagrams
        const diagrams = await prisma.diagram.findMany({
            select: {
                id: true,
                title: true,
                fileUrl: true,
                fileType: true,
                analysisImageUrl: true,
            }
        });

        console.log(`📊 Found ${diagrams.length} diagrams to check\n`);

        let migrated = 0;
        let skipped = 0;
        let failed = 0;

        for (const diagram of diagrams) {
            console.log(`\n🔄 Processing: ${diagram.title}`);
            console.log(`   Type: ${diagram.fileType}`);
            console.log(`   Current URL: ${diagram.fileUrl}`);

            // Skip if already has Cloudinary URL
            if (diagram.fileUrl.includes('cloudinary.com')) {
                console.log('   ✅ Already on Cloudinary - skipping');
                skipped++;
                continue;
            }

            try {
                // Download file from Vercel Blob
                console.log('   📥 Downloading from Vercel Blob...');
                const response = await fetch(diagram.fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to download: ${response.statusText}`);
                }

                const fileBuffer = Buffer.from(await response.arrayBuffer());
                console.log(`   ✅ Downloaded (${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB)`);

                const isPDF = diagram.fileType === 'application/pdf';
                let cloudinaryResult;

                if (isPDF) {
                    console.log('   📄 Uploading PDF to Cloudinary...');
                    cloudinaryResult = await uploadPDFToCloudinary(fileBuffer, diagram.title);
                } else {
                    console.log('   🖼️ Uploading image to Cloudinary...');
                    cloudinaryResult = await uploadImageToCloudinary(fileBuffer, diagram.title);
                }

                if (!cloudinaryResult.success) {
                    throw new Error(cloudinaryResult.error || 'Upload failed');
                }

                // Update database
                console.log('   💾 Updating database...');
                await prisma.diagram.update({
                    where: { id: diagram.id },
                    data: {
                        fileUrl: isPDF ? cloudinaryResult.pdfUrl! : cloudinaryResult.imageUrl!,
                        fileKey: cloudinaryResult.publicId!,
                        analysisImageUrl: cloudinaryResult.imageUrl!,
                        analysisImageKey: cloudinaryResult.publicId!,
                    }
                });

                console.log('   ✅ Migration complete!');
                console.log(`   📍 New URL: ${cloudinaryResult.imageUrl}`);
                migrated++;

            } catch (error) {
                console.error(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                failed++;
            }
        }

        console.log('\n\n📊 MIGRATION SUMMARY:');
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`   📈 Total: ${diagrams.length}`);

        if (migrated > 0) {
            console.log('\n🎉 Migration successful! All diagrams are now on Cloudinary!');
        }

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateDiagrams()
    .then(() => {
        console.log('\n✅ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
