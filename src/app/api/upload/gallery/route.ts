import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '~/lib/api-auth';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { processMultipleFiles, type UploadResponse } from '~/lib/file-upload';
import { createFileRecord, getMimeTypeFromExtension } from '~/lib/file-management-server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Gallery upload request received');

    // Check authentication
    const { session, error } = await requireAuth(request);
    if (error) {
      console.log('❌ Authentication failed');
      return error;
    }
    console.log('✅ Authentication successful for user:', session.user.id);

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    console.log(`📁 Received ${files.length} files for upload`);
    files.forEach((file, index) => {
      console.log(`  File ${index + 1}: ${file.name} (${file.size} bytes, ${file.type})`);
    });

    if (!files || files.length === 0) {
      console.log('❌ No files provided');
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process file uploads (max 5 files for gallery)
    console.log('🔄 Processing file uploads...');
    const uploadResults = await processMultipleFiles(files, 'gallery', 5);

    console.log('📊 Upload results:', uploadResults.map(r => ({
      success: r.success,
      url: r.url,
      error: r.error
    })));

    // Check if any uploads failed
    const failedUploads = uploadResults.filter(result => !result.success);
    if (failedUploads.length > 0) {
      console.log('❌ Some uploads failed:', failedUploads);
      return NextResponse.json(
        {
          error: 'Some uploads failed',
          details: failedUploads.map(f => f.error)
        },
        { status: 400 }
      );
    }

    // Save successful uploads to database
    console.log('💾 Saving uploads to database...');
    const savedImages = [];
    for (const result of uploadResults) {
      if (result.success && result.url) {
        console.log(`💾 Inserting image: ${result.url}`);
        try {
          // Insert the image (MySQL/MariaDB doesn't support .returning())
          await db.insert(images).values({
            title: result.filename || '',
            url: result.url,
            gallery: true,
            visible: true, // New images are visible by default
            localPath: result.url, // Store the public URL as local path for now
            image_size: result.size || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`✅ Successfully inserted image: ${result.url}`);
        } catch (dbError) {
          console.error(`❌ Database insertion failed for ${result.url}:`, dbError);
          throw dbError;
        }

        // Get the inserted image by URL (since we can't use returning())
        console.log(`🔍 Looking up inserted image: ${result.url}`);
        const savedImage = await db.query.images.findFirst({
          where: eq(images.url, result.url),
        });

        if (savedImage) {
          console.log(`✅ Found inserted image with ID: ${savedImage.id}`);
          // Create file record for tracking
          try {
            await createFileRecord({
              originalName: result.filename || 'unknown',
              filename: result.filename || 'unknown',
              filePath: `public${result.url}`,
              publicUrl: result.url,
              mimeType: getMimeTypeFromExtension(result.filename || ''),
              fileSize: result.size || 0,
              uploadType: 'gallery',
              uploadedBy: session.user.id,
              associatedEntity: 'image',
              associatedEntityId: savedImage.id,
              isOrphaned: false,
            });
          } catch (error) {
            console.error('❌ Error creating file record:', error);
            // Continue even if file record creation fails
          }
        } else {
          console.log(`⚠️  Could not find inserted image: ${result.url}`);
        }

        savedImages.push({
          id: savedImage?.id,
          url: result.url,
          filename: result.filename,
          size: result.size,
        });
        console.log(`✅ Added to savedImages: ${result.url}`);
      }
    }

    console.log(`🎉 Upload complete! Saved ${savedImages.length} images`);
    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${savedImages.length} image(s)`,
      images: savedImages,
    });

  } catch (error) {
    console.error('❌ Gallery upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle file deletion
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { session, error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get image from database
    const image = await db.query.images.findFirst({
      where: eq(images.id, parseInt(imageId)),
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from database first
    await db.delete(images).where(eq(images.id, parseInt(imageId)));

    // Try to delete the physical file (don't fail if file doesn't exist)
    try {
      const { deleteFileByUrl } = await import('~/lib/file-management');
      await deleteFileByUrl(image.url);
    } catch (fileError) {
      console.warn('Could not delete physical file:', fileError);
      // Continue anyway since database record is deleted
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Gallery delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
