import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '~/lib/api-auth';
import {
  getFileRecord,
  updateFileRecord,
  deleteFileCompletely,
  fileExistsAsync,
  getFileStats,
  type FileRecord
} from '~/lib/file-management-server';

// GET - Get specific file details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const fileId = parseInt(id);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const fileRecord = await getFileRecord(fileId);
    if (!fileRecord) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if physical file exists and get stats
    const physicalExists = await fileExistsAsync(fileRecord.filePath);
    const fileStats = physicalExists ? await getFileStats(fileRecord.filePath) : null;

    return NextResponse.json({
      success: true,
      file: fileRecord,
      physicalFile: {
        exists: physicalExists,
        stats: fileStats,
      },
    });
  } catch (error) {
    console.error('Error fetching file details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file details' },
      { status: 500 }
    );
  }
}

// PUT - Update file metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const fileId = parseInt(id);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { originalName, isOrphaned, associatedEntity, associatedEntityId } = body;

    // Validate that file exists
    const existingFile = await getFileRecord(fileId);
    if (!existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Prepare updates
    const updates: Partial<FileRecord> = {};
    if (originalName !== undefined) updates.originalName = originalName;
    if (isOrphaned !== undefined) updates.isOrphaned = isOrphaned;
    if (associatedEntity !== undefined) updates.associatedEntity = associatedEntity;
    if (associatedEntityId !== undefined) updates.associatedEntityId = associatedEntityId;

    await updateFileRecord(fileId, updates);

    // Get updated record
    const updatedFile = await getFileRecord(fileId);

    return NextResponse.json({
      success: true,
      message: 'File updated successfully',
      file: updatedFile,
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const fileId = parseInt(id);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const result = await deleteFileCompletely(fileId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
        warning: result.error,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
