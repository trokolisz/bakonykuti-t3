import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/auth";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { desc } from "drizzle-orm";

// GET - List all images for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allImages = await db.select().from(images).orderBy(desc(images.createdAt));

    return NextResponse.json({ 
      success: true, 
      images: allImages,
      total: allImages.length 
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
