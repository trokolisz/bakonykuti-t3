import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/auth';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { processMultipleFiles } from '~/lib/file-upload';

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

    // Process file upload (max 1 file for events, using events directory)
    const uploadResults = await processMultipleFiles(files, 'events', 1);

    // Check if upload failed
    const result = uploadResults[0];
    if (!result || !result.success) {
      return NextResponse.json(
        { 
          error: result?.error || 'Upload failed'
        },
        { status: 400 }
      );
    }

    // Save to database (marked as not for gallery)
    const [savedImage] = await db.insert(images).values({
      title: result.filename || '',
      url: result.url!,
      gallery: false, // Event images are not shown in gallery by default
      image_size: result.size || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Event image uploaded successfully',
      image: {
        id: savedImage?.id,
        url: result.url,
        filename: result.filename,
        size: result.size,
      },
    });

  } catch (error) {
    console.error('Event upload error:', error);
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

    // Try to delete the physical file
    try {
      const { deleteFileByUrl } = await import('~/lib/file-management');
      await deleteFileByUrl(image.url);
    } catch (fileError) {
      console.warn('Could not delete physical file:', fileError);
    }

    return NextResponse.json({
      success: true,
      message: 'Event image deleted successfully',
    });

  } catch (error) {
    console.error('Event delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
