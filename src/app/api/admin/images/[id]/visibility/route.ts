import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "~/lib/api-auth";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// PATCH - Toggle image visibility
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const imageId = parseInt(params.id);
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const { visible } = await request.json();
    if (typeof visible !== 'boolean') {
      return NextResponse.json({ error: 'Invalid visibility value' }, { status: 400 });
    }

    // Check if image exists
    const existingImage = await db.query.images.findFirst({
      where: eq(images.id, imageId),
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Update visibility
    await db.update(images)
      .set({ visible, updatedAt: new Date() })
      .where(eq(images.id, imageId));

    return NextResponse.json({ 
      success: true,
      visible,
      message: `Image ${visible ? 'shown' : 'hidden'} in public gallery`
    });
  } catch (error) {
    console.error('Error updating image visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update image visibility' },
      { status: 500 }
    );
  }
}
