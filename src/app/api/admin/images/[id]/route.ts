import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "~/lib/api-auth";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { deleteFileByUrl } from "~/lib/file-management-server";

// PATCH - Update image metadata (title, carousel status, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const imageId = parseInt(id);
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, isCarousel, visible } = body;

    // Check if image exists
    const existingImage = await db.query.images.findFirst({
      where: eq(images.id, imageId),
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
    }
    if (isCarousel !== undefined) {
      updateData.isCarousel = isCarousel;
    }
    if (visible !== undefined) {
      updateData.visible = visible;
    }

    // Update the image
    await db.update(images)
      .set(updateData)
      .where(eq(images.id, imageId));

    return NextResponse.json({
      success: true,
      message: 'Image updated successfully',
      image: {
        id: imageId,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const imageId = parseInt(id);
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    // Get image info first
    const image = await db.query.images.findFirst({
      where: eq(images.id, imageId),
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete file from local storage first
    const fileResult = await deleteFileByUrl(image.url);
    
    // Delete from database
    await db.delete(images).where(eq(images.id, imageId));

    return NextResponse.json({ 
      success: true, 
      fileDeleted: fileResult.success,
      message: fileResult.success 
        ? 'Image and file deleted successfully' 
        : 'Image deleted from database, but file deletion failed'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
