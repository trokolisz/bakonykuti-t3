import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '~/lib/api-auth';
import {
  getAllFileRecords,
  getFilesByType,
  deleteFileCompletely,
  findOrphanedFiles,
  cleanupOrphanedFiles,
  type FileRecord
} from '~/lib/file-management-server';

// GET - List all files or files by type
export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const uploadType = searchParams.get('type');
    const action = searchParams.get('action');

    // Handle special actions
    if (action === 'orphans') {
      const orphans = await findOrphanedFiles();
      return NextResponse.json({
        success: true,
        orphans,
        count: orphans.length,
      });
    }

    // Get files by type or all files
    let files: FileRecord[];
    if (uploadType) {
      files = await getFilesByType(uploadType);
    } else {
      files = await getAllFileRecords();
    }

    return NextResponse.json({
      success: true,
      files,
      total: files.length,
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific file
export async function DELETE(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteFileCompletely(parseInt(fileId));

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

// POST - Bulk operations and cleanup
export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { action, fileIds, deleteFiles } = body;

    switch (action) {
      case 'cleanup':
        const cleanupResult = await cleanupOrphanedFiles(deleteFiles === true);
        return NextResponse.json({
          success: true,
          result: cleanupResult,
          message: `Cleanup completed. Files deleted: ${cleanupResult.filesDeleted}, Records deleted: ${cleanupResult.recordsDeleted}`,
        });

      case 'bulk_delete':
        if (!fileIds || !Array.isArray(fileIds)) {
          return NextResponse.json(
            { error: 'File IDs array is required for bulk delete' },
            { status: 400 }
          );
        }

        const deleteResults = [];
        const errors = [];

        for (const fileId of fileIds) {
          try {
            const result = await deleteFileCompletely(parseInt(fileId));
            deleteResults.push({ fileId, success: result.success, error: result.error });
            if (!result.success) {
              errors.push(`File ${fileId}: ${result.error}`);
            }
          } catch (error) {
            errors.push(`File ${fileId}: ${error}`);
            deleteResults.push({ fileId, success: false, error: String(error) });
          }
        }

        const successCount = deleteResults.filter(r => r.success).length;
        
        return NextResponse.json({
          success: errors.length === 0,
          message: `Bulk delete completed. ${successCount}/${fileIds.length} files deleted successfully.`,
          results: deleteResults,
          errors,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}
