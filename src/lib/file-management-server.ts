// Server-side file management functions
// This file contains Node.js-specific code that can only run on the server

import { unlink, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { db } from '~/server/db';
import { files, images, documents } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';

// Re-export types from the main file-management module
export type {
  FileRecord,
  OrphanedFile,
  CleanupResult
} from './file-management';

// Database file record interface
export interface FileRecord {
  id: number;
  originalName: string;
  filename: string;
  filePath: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  uploadType: string;
  uploadedBy?: string;
  associatedEntity?: string;
  associatedEntityId?: number;
  isOrphaned: boolean;
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrphanedFile {
  type: 'file' | 'record';
  filePath?: string;
  fileId?: number;
  reason: string;
}

export interface CleanupResult {
  filesDeleted: number;
  recordsDeleted: number;
  errors: string[];
  orphanedFiles: OrphanedFile[];
}

// MIME type detection
export function getMimeTypeFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isDocumentFile(mimeType: string): boolean {
  return mimeType === 'application/pdf' || 
         mimeType.includes('document') || 
         mimeType === 'text/plain';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Database operations for file records
export async function createFileRecord(fileData: Omit<FileRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const result = await db.insert(files).values({
    originalName: fileData.originalName,
    filename: fileData.filename,
    filePath: fileData.filePath,
    publicUrl: fileData.publicUrl,
    mimeType: fileData.mimeType,
    fileSize: fileData.fileSize,
    uploadType: fileData.uploadType,
    uploadedBy: fileData.uploadedBy,
    associatedEntity: fileData.associatedEntity,
    associatedEntityId: fileData.associatedEntityId,
    isOrphaned: fileData.isOrphaned,
    lastAccessedAt: fileData.lastAccessedAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // For MySQL/MariaDB, get the inserted ID
  const insertedFile = await db.query.files.findFirst({
    where: and(
      eq(files.filePath, fileData.filePath),
      eq(files.filename, fileData.filename)
    ),
    orderBy: (files, { desc }) => [desc(files.createdAt)],
  });

  return insertedFile?.id || 0;
}

export async function updateFileRecord(fileId: number, updates: Partial<FileRecord>): Promise<void> {
  await db.update(files)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(files.id, fileId));
}

export async function deleteFileRecord(fileId: number): Promise<void> {
  await db.delete(files).where(eq(files.id, fileId));
}

export async function getFileRecord(fileId: number): Promise<FileRecord | null> {
  const file = await db.query.files.findFirst({
    where: eq(files.id, fileId),
  });
  return file || null;
}

export async function getFilesByType(uploadType: string): Promise<FileRecord[]> {
  return await db.query.files.findMany({
    where: eq(files.uploadType, uploadType),
    orderBy: (files, { desc }) => [desc(files.createdAt)],
  });
}

export async function getAllFileRecords(): Promise<FileRecord[]> {
  return await db.query.files.findMany({
    orderBy: (files, { desc }) => [desc(files.createdAt)],
  });
}

// Enhanced physical file operations (server-only)
export async function deletePhysicalFile(filePath: string): Promise<boolean> {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`Successfully deleted file: ${filePath}`);
      return true;
    } else {
      console.warn(`File not found for deletion: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
}

export async function fileExistsAsync(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getFileStats(filePath: string) {
  try {
    const stats = await stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
    };
  } catch (error) {
    return null;
  }
}

// Orphan detection and cleanup (server-only)
export async function findOrphanedFiles(): Promise<OrphanedFile[]> {
  const orphans: OrphanedFile[] = [];
  
  try {
    // Get all file records from database
    const fileRecords = await getAllFileRecords();
    
    // Check for files in database that don't exist on disk
    for (const record of fileRecords) {
      const exists = await fileExistsAsync(record.filePath);
      if (!exists) {
        orphans.push({
          type: 'record',
          fileId: record.id,
          reason: `Database record exists but file not found: ${record.filePath}`,
        });
      }
    }
    
    // Check for files on disk that aren't in database
    const uploadDirs = ['public/uploads/gallery', 'public/uploads/news', 'public/uploads/events', 'public/uploads/documents'];
    
    for (const dir of uploadDirs) {
      if (existsSync(dir)) {
        const diskFiles = await readdir(dir);
        const dbFilePaths = fileRecords
          .filter(f => f.filePath.includes(dir))
          .map(f => path.basename(f.filePath));
        
        for (const diskFile of diskFiles) {
          if (!dbFilePaths.includes(diskFile)) {
            const fullPath = path.join(dir, diskFile);
            orphans.push({
              type: 'file',
              filePath: fullPath,
              reason: `File exists on disk but no database record found: ${fullPath}`,
            });
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error finding orphaned files:', error);
  }
  
  return orphans;
}

export async function markFileAsOrphaned(fileId: number): Promise<void> {
  await updateFileRecord(fileId, { isOrphaned: true });
}

export async function cleanupOrphanedFiles(deleteFiles: boolean = false): Promise<CleanupResult> {
  const result: CleanupResult = {
    filesDeleted: 0,
    recordsDeleted: 0,
    errors: [],
    orphanedFiles: [],
  };
  
  try {
    const orphans = await findOrphanedFiles();
    result.orphanedFiles = orphans;
    
    if (deleteFiles) {
      // Delete orphaned database records (files that don't exist on disk)
      const orphanedRecords = orphans.filter(o => o.type === 'record' && o.fileId);
      for (const orphan of orphanedRecords) {
        try {
          if (orphan.fileId) {
            await deleteFileRecord(orphan.fileId);
            result.recordsDeleted++;
          }
        } catch (error) {
          result.errors.push(`Failed to delete record ${orphan.fileId}: ${error}`);
        }
      }
      
      // Delete orphaned files (files that don't have database records)
      const orphanedFiles = orphans.filter(o => o.type === 'file' && o.filePath);
      for (const orphan of orphanedFiles) {
        try {
          if (orphan.filePath && await deletePhysicalFile(orphan.filePath)) {
            result.filesDeleted++;
          }
        } catch (error) {
          result.errors.push(`Failed to delete file ${orphan.filePath}: ${error}`);
        }
      }
    }
    
  } catch (error) {
    result.errors.push(`Cleanup operation failed: ${error}`);
  }
  
  return result;
}

// Complete file deletion (both physical file and database record)
export async function deleteFileCompletely(fileId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const fileRecord = await getFileRecord(fileId);
    if (!fileRecord) {
      return { success: false, error: 'File record not found' };
    }
    
    // Delete physical file
    const fileDeleted = await deletePhysicalFile(fileRecord.filePath);
    
    // Delete database record
    await deleteFileRecord(fileId);
    
    return { 
      success: true, 
      error: fileDeleted ? undefined : 'Database record deleted but physical file was not found' 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
