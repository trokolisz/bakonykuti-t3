import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/auth';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { processMultipleFiles, type UploadResponse } from '~/lib/file-upload';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to upload' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process file uploads (max 5 files for gallery)
    const uploadResults = await processMultipleFiles(files, 'gallery', 5);

    // Check if any uploads failed
    const failedUploads = uploadResults.filter(result => !result.success);
    if (failedUploads.length > 0) {
      return NextResponse.json(
        { 
          error: 'Some uploads failed',
          details: failedUploads.map(f => f.error)
        },
        { status: 400 }
      );
    }

    // Save successful uploads to database
    const savedImages = [];
    for (const result of uploadResults) {
      if (result.success && result.url) {
        const [savedImage] = await db.insert(images).values({
          title: result.filename || '',
          url: result.url,
          gallery: true,
          visible: true, // New images are visible by default
          localPath: result.url, // Store the public URL as local path for now
          image_size: result.size || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        savedImages.push({
          id: savedImage?.id,
          url: result.url,
          filename: result.filename,
          size: result.size,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${savedImages.length} image(s)`,
      images: savedImages,
    });

  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle file deletion
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to delete files' },
        { status: 401 }
      );
    }

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
