import path from 'path';

// Extended file info interface for comprehensive management
export interface FileInfo {
  filename: string;
  path: string;
  publicUrl: string;
  size: number;
  createdAt: Date;
  type: string;
}

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

// Client-safe utility functions for file management

// MIME type detection (client-safe)
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

// Client-safe file size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}