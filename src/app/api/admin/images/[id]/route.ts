import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/auth";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { deleteFileByUrl } from "~/lib/file-management";

// DELETE - Delete specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const imageId = parseInt(params.id);
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
