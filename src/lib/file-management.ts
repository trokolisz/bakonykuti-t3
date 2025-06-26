import { unlink, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { UPLOAD_DIRS, type UploadType } from './file-upload';

// File info interface
export interface FileInfo {
  filename: string;
  path: string;
  publicUrl: string;
  size: number;
  createdAt: Date;
  type: string;
}

// Delete file from local storage
export async function deleteLocalFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Ensure the file path is within our upload directories for security
    const normalizedPath = path.normalize(filePath);
    const isInUploadDir = Object.values(UPLOAD_DIRS).some(dir => 
      normalizedPath.startsWith(path.normalize(dir))
    );

    if (!isInUploadDir) {
      return { success: false, error: 'Invalid file path' };
    }

    if (!existsSync(normalizedPath)) {
      return { success: false, error: 'File not found' };
    }

    await unlink(normalizedPath);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

// Delete file by public URL
export async function deleteFileByUrl(publicUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert public URL back to file path
    const filePath = path.join('public', publicUrl);
    return await deleteLocalFile(filePath);
  } catch (error) {
    console.error('Error deleting file by URL:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

// List all files in an upload directory
export async function listFiles(uploadType: UploadType): Promise<FileInfo[]> {
  try {
    const uploadDir = UPLOAD_DIRS[uploadType];
    
    if (!existsSync(uploadDir)) {
      return [];
    }

    const files = await readdir(uploadDir);
    const fileInfos: FileInfo[] = [];

    for (const filename of files) {
      const filePath = path.join(uploadDir, filename);
      const stats = await stat(filePath);
      
      if (stats.isFile()) {
        const publicUrl = `/${uploadDir.replace('public/', '')}/${filename}`;
        const ext = path.extname(filename).toLowerCase();
        
        let type = 'unknown';
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          type = 'image';
        } else if (ext === '.pdf') {
          type = 'document';
        }

        fileInfos.push({
          filename,
          path: filePath,
          publicUrl,
          size: stats.size,
          createdAt: stats.birthtime,
          type,
        });
      }
    }

    // Sort by creation date (newest first)
    return fileInfos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}

// Get file info by public URL
export async function getFileInfo(publicUrl: string): Promise<FileInfo | null> {
  try {
    const filePath = path.join('public', publicUrl);
    
    if (!existsSync(filePath)) {
      return null;
    }

    const stats = await stat(filePath);
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let type = 'unknown';
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      type = 'image';
    } else if (ext === '.pdf') {
      type = 'document';
    }

    return {
      filename,
      path: filePath,
      publicUrl,
      size: stats.size,
      createdAt: stats.birthtime,
      type,
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
}

// Clean up orphaned files (files that exist locally but not in database)
export async function cleanupOrphanedFiles(
  uploadType: UploadType,
  validUrls: string[]
): Promise<{ deleted: string[]; errors: string[] }> {
  const deleted: string[] = [];
  const errors: string[] = [];

  try {
    const allFiles = await listFiles(uploadType);
    
    for (const file of allFiles) {
      if (!validUrls.includes(file.publicUrl)) {
        const result = await deleteLocalFile(file.path);
        if (result.success) {
          deleted.push(file.filename);
        } else {
          errors.push(`Failed to delete ${file.filename}: ${result.error}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Error during cleanup: ${error}`);
  }

  return { deleted, errors };
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if file exists
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

// Get file extension
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

// Sanitize filename for safe storage
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-_]/g, '_');
}
