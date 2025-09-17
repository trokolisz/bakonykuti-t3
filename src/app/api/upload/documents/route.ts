import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '~/lib/api-auth';
import { db } from '~/server/db';
import { documents } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { processMultipleFiles } from '~/lib/file-upload';
import { formatFileSize } from '~/lib/file-management';
import { createFileRecord, getMimeTypeFromExtension } from '~/lib/file-management-server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { session, error } = await requireAuth(request);
    if (error) return error;

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const date = formData.get('date') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!title || !category || !date) {
      return NextResponse.json(
        { error: 'Title, category, and date are required' },
        { status: 400 }
      );
    }

    // Process file upload (max 1 file for documents)
    const uploadResults = await processMultipleFiles(files, 'documents', 1);

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

    // Save to documents table (MySQL/MariaDB doesn't support .returning())
    await db.insert(documents).values({
      title,
      category,
      date: new Date(date),
      fileUrl: result.url!,
      fileSize: formatFileSize(result.size || 0),
    });

    // Get the inserted document by URL
    const savedDocument = await db.query.documents.findFirst({
      where: eq(documents.fileUrl, result.url!),
    });

    if (savedDocument) {
      // Create file record for tracking
      try {
        await createFileRecord({
          originalName: result.filename || 'unknown',
          filename: result.filename || 'unknown',
          filePath: `public${result.url}`,
          publicUrl: result.url!,
          mimeType: getMimeTypeFromExtension(result.filename || ''),
          fileSize: result.size || 0,
          uploadType: 'documents',
          uploadedBy: session.user.id,
          associatedEntity: 'document',
          associatedEntityId: savedDocument.id,
          isOrphaned: false,
        });
      } catch (error) {
        console.error('Error creating file record:', error);
        // Continue even if file record creation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: savedDocument?.id,
        title,
        category,
        date,
        fileUrl: result.url,
        fileSize: formatFileSize(result.size || 0),
        filename: result.filename,
      },
    });

  } catch (error) {
    console.error('Document upload error:', error);
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
    const { session, error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document from database
    const document = await db.query.documents.findFirst({
      where: eq(documents.id, parseInt(documentId)),
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete from database first
    await db.delete(documents).where(eq(documents.id, parseInt(documentId)));

    // Try to delete the physical file
    try {
      const { deleteFileByUrl } = await import('~/lib/file-management');
      await deleteFileByUrl(document.fileUrl);
    } catch (fileError) {
      console.warn('Could not delete physical file:', fileError);
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });

  } catch (error) {
    console.error('Document delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
