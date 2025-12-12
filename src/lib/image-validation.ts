import { promises as fs } from 'fs';
import path from 'path';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export interface ImageValidationResult {
  id: number;
  url: string;
  title: string;
  exists: boolean;
  fileSize?: number;
  error?: string;
  isOrphaned: boolean;
}

export interface ValidationSummary {
  total: number;
  valid: number;
  missing: number;
  orphaned: number;
  results: ImageValidationResult[];
}

/**
 * Check if an image file exists on the filesystem
 */
export async function checkImageExists(imagePath: string): Promise<{ exists: boolean; fileSize?: number; error?: string }> {
  try {
    // Handle both absolute and relative paths
    const fullPath = imagePath.startsWith('/') 
      ? path.join(process.cwd(), 'public', imagePath)
      : path.join(process.cwd(), 'public', '/', imagePath);
    
    const stats = await fs.stat(fullPath);
    
    if (!stats.isFile()) {
      return { exists: false, error: 'Path exists but is not a file' };
    }
    
    return { exists: true, fileSize: stats.size };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { exists: false, error: errorMessage };
  }
}

/**
 * Validate all images in the database
 */
export async function validateAllImages(): Promise<ValidationSummary> {
  try {
    // Get all images from database
    const allImages = await db.select().from(images);
    
    const results: ImageValidationResult[] = [];
    
    for (const image of allImages) {
      const { exists, fileSize, error } = await checkImageExists(image.url);
      
      results.push({
        id: image.id,
        url: image.url,
        title: image.title || 'Untitled',
        exists,
        fileSize,
        error,
        isOrphaned: !exists
      });
    }
    
    const summary: ValidationSummary = {
      total: results.length,
      valid: results.filter(r => r.exists).length,
      missing: results.filter(r => !r.exists).length,
      orphaned: results.filter(r => r.isOrphaned).length,
      results
    };
    
    return summary;
  } catch (error) {
    console.error('Error validating images:', error);
    throw new Error(`Failed to validate images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Remove orphaned image records from database
 */
export async function cleanupOrphanedImages(dryRun: boolean = true): Promise<{ removed: number; errors: string[] }> {
  try {
    const validation = await validateAllImages();
    const orphanedImages = validation.results.filter(r => r.isOrphaned);
    
    if (dryRun) {
      return { 
        removed: orphanedImages.length, 
        errors: [`DRY RUN: Would remove ${orphanedImages.length} orphaned records`] 
      };
    }
    
    const errors: string[] = [];
    let removed = 0;
    
    for (const orphan of orphanedImages) {
      try {
        await db.delete(images).where(eq(images.id, orphan.id));
        removed++;
      } catch (error) {
        const errorMsg = `Failed to remove image ${orphan.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
    
    return { removed, errors };
  } catch (error) {
    console.error('Error cleaning up orphaned images:', error);
    throw new Error(`Failed to cleanup orphaned images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a quick health check of the image system
 */
export async function getImageHealthCheck(): Promise<{
  status: 'healthy' | 'warning' | 'error';
  message: string;
  stats: {
    total: number;
    valid: number;
    missing: number;
    healthPercentage: number;
  };
}> {
  try {
    const validation = await validateAllImages();
    const healthPercentage = validation.total > 0 ? (validation.valid / validation.total) * 100 : 100;
    
    let status: 'healthy' | 'warning' | 'error';
    let message: string;
    
    if (healthPercentage >= 95) {
      status = 'healthy';
      message = 'Image system is healthy';
    } else if (healthPercentage >= 80) {
      status = 'warning';
      message = `${validation.missing} images are missing (${(100 - healthPercentage).toFixed(1)}% failure rate)`;
    } else {
      status = 'error';
      message = `Critical: ${validation.missing} images are missing (${(100 - healthPercentage).toFixed(1)}% failure rate)`;
    }
    
    return {
      status,
      message,
      stats: {
        total: validation.total,
        valid: validation.valid,
        missing: validation.missing,
        healthPercentage: Math.round(healthPercentage * 100) / 100
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to check image health: ${error instanceof Error ? error.message : 'Unknown error'}`,
      stats: { total: 0, valid: 0, missing: 0, healthPercentage: 0 }
    };
  }
}
