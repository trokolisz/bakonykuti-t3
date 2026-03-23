import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAuth } from '~/lib/api-auth';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { processMultipleFiles } from '~/lib/file-upload';
import { createFileRecord, getMimeTypeFromExtension } from '~/lib/file-management-server';

export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAuth(request);
    if (error) return error;

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadResults = await processMultipleFiles(files, 'news', 1);

    const result = uploadResults[0];
    if (!result?.success) {
      return NextResponse.json(
        {
          error: result?.error ?? 'Upload failed'
        },
        { status: 400 }
      );
    }

    await db.insert(images).values({
      title: result.filename ?? '',
      url: result.url!,
      gallery: false,
      image_size: result.size ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedImage = await db.query.images.findFirst({
      where: eq(images.url, result.url!),
    });

    if (savedImage) {
      try {
        await createFileRecord({
          originalName: result.filename ?? 'unknown',
          filename: result.filename ?? 'unknown',
          filePath: `public${result.url}`,
          publicUrl: result.url!,
          mimeType: getMimeTypeFromExtension(result.filename ?? ''),
          fileSize: result.size ?? 0,
          uploadType: 'news',
          uploadedBy: session.user.id,
          associatedEntity: 'image',
          associatedEntityId: savedImage.id,
          isOrphaned: false,
        });
      } catch (recordError) {
        console.error('Error creating file record:', recordError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Page image uploaded successfully',
      image: {
        id: savedImage?.id,
        url: result.url,
        filename: result.filename,
        size: result.size,
      },
    });
  } catch (uploadError) {
    console.error('Page upload error:', uploadError);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
