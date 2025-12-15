import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// File validation constants
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

// Upload directories
export const UPLOAD_DIRS = {
  gallery: 'public/uploads/gallery',
  news: 'public/uploads/news',
  events: 'public/uploads/events',
  documents: 'public/uploads/documents',
} as const;

export type UploadType = keyof typeof UPLOAD_DIRS;

// File validation functions
export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function validateImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function validateDocumentType(file: File): boolean {
  return ALLOWED_DOCUMENT_TYPES.includes(file.type);
}

export function validateFile(file: File, type: 'image' | 'document'): { valid: boolean; error?: string } {
  if (!validateFileSize(file)) {
    return { valid: false, error: 'File size must be less than 4MB' };
  }

  if (type === 'image' && !validateImageType(file)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  if (type === 'document' && !validateDocumentType(file)) {
    return { valid: false, error: 'Only PDF documents are allowed' };
  }

  return { valid: true };
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
  const uuid = uuidv4().split('-')[0]; // Use first part of UUID for shorter names
  return `${sanitizedName}_${uuid}${ext}`;
}

// Ensure upload directory exists
export async function ensureUploadDir(uploadType: UploadType): Promise<void> {
  const dir = UPLOAD_DIRS[uploadType];
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

// Save file to local storage
export async function saveFileToLocal(
  file: File,
  uploadType: UploadType
): Promise<{ success: boolean; filePath?: string; publicUrl?: string; error?: string }> {
  try {
    console.log(`📁 Saving file: ${file.name} (${file.size} bytes) to ${uploadType}`);

    // Validate file type
    const fileType = uploadType === 'documents' ? 'document' : 'image';
    const validation = validateFile(file, fileType);
    if (!validation.valid) {
      console.log(`❌ File validation failed: ${validation.error}`);
      return { success: false, error: validation.error };
    }
    console.log(`✅ File validation passed`);

    // Ensure upload directory exists
    await ensureUploadDir(uploadType);
    console.log(`✅ Upload directory ensured: ${UPLOAD_DIRS[uploadType]}`);

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const uploadDir = UPLOAD_DIRS[uploadType];
    const filePath = path.join(uploadDir, filename);
    console.log(`📝 Generated filename: ${filename}`);
    console.log(`📂 Full file path: ${filePath}`);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    console.log(`💾 File saved successfully to: ${filePath}`);

    // Generate public URL through API route for proper serving
    const publicUrl = `/api/images/${uploadDir.replace('public/', '')}/${filename}`;
    console.log(`🌐 Generated public URL: ${publicUrl}`);

    return {
      success: true,
      filePath,
      publicUrl,
    };
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return {
      success: false,
      error: `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Upload response type
export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  error?: string;
}

// Process multiple files upload
export async function processMultipleFiles(
  files: File[],
  uploadType: UploadType,
  maxFiles: number = 5
): Promise<UploadResponse[]> {
  if (files.length > maxFiles) {
    return [{ success: false, error: `Maximum ${maxFiles} files allowed` }];
  }

  const results: UploadResponse[] = [];

  for (const file of files) {
    const result = await saveFileToLocal(file, uploadType);
    
    if (result.success && result.publicUrl) {
      results.push({
        success: true,
        url: result.publicUrl,
        filename: file.name,
        size: file.size,
      });
    } else {
      results.push({
        success: false,
        error: result.error || 'Upload failed',
      });
    }
  }

  return results;
}
