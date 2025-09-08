/**
 * Comprehensive Image Access Debugging and Error Handling
 * Helps identify and resolve image access issues
 */

import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export interface ImageDebugInfo {
  url: string;
  localPath?: string;
  exists: boolean;
  accessible: boolean;
  fileSize?: number;
  permissions?: string;
  error?: string;
  suggestions: string[];
}

export interface ImageAccessReport {
  totalImages: number;
  accessibleImages: number;
  inaccessibleImages: number;
  issues: ImageDebugInfo[];
  systemInfo: {
    uploadDir: string;
    publicDir: string;
    baseUrl: string;
    serverRunning: boolean;
  };
}

/**
 * Debug a single image's accessibility
 */
export async function debugImageAccess(imageUrl: string, localPath?: string): Promise<ImageDebugInfo> {
  const debug: ImageDebugInfo = {
    url: imageUrl,
    localPath,
    exists: false,
    accessible: false,
    suggestions: []
  };

  try {
    // Check if it's a local file path or URL
    if (imageUrl.startsWith('http')) {
      // External URL - test HTTP access
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        debug.accessible = response.ok;
        debug.fileSize = parseInt(response.headers.get('content-length') || '0');
        
        if (!response.ok) {
          debug.error = `HTTP ${response.status}: ${response.statusText}`;
          debug.suggestions.push('Check if the external service is accessible');
          debug.suggestions.push('Verify the URL is correct');
        }
      } catch (error) {
        debug.error = `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        debug.suggestions.push('Check internet connection');
        debug.suggestions.push('Verify the external service is online');
      }
    } else {
      // Local file - check file system access
      const filePath = localPath || path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
      debug.localPath = filePath;

      try {
        const stats = await fs.stat(filePath);
        debug.exists = true;
        debug.fileSize = stats.size;
        debug.permissions = stats.mode.toString(8);

        // Check if file is in public directory
        const publicDir = path.join(process.cwd(), 'public');
        const isInPublic = filePath.startsWith(publicDir);
        
        if (isInPublic) {
          debug.accessible = true;
        } else {
          debug.accessible = false;
          debug.suggestions.push('File is not in the public directory');
          debug.suggestions.push('Move file to public directory or create a proper API endpoint');
        }

        // Check file permissions
        try {
          await fs.access(filePath, fs.constants.R_OK);
        } catch {
          debug.accessible = false;
          debug.suggestions.push('File exists but is not readable - check permissions');
        }

      } catch (error) {
        debug.exists = false;
        debug.error = `File system error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        debug.suggestions.push('File does not exist at the expected location');
        debug.suggestions.push('Check if the upload process completed successfully');
        debug.suggestions.push('Verify the file path is correct');
      }
    }

    // Add general suggestions based on the URL pattern
    if (imageUrl.includes('utfs.io')) {
      debug.suggestions.push('This appears to be an UploadThing URL - ensure UploadThing service is configured correctly');
    } else if (imageUrl.startsWith('/uploads/')) {
      debug.suggestions.push('Local upload detected - ensure /uploads directory exists in public folder');
      debug.suggestions.push('Check if Next.js static file serving is working');
    }

  } catch (error) {
    debug.error = `Debug error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    debug.suggestions.push('Contact system administrator');
  }

  return debug;
}

/**
 * Generate comprehensive image access report
 */
export async function generateImageAccessReport(images: Array<{ url: string; localPath?: string }>): Promise<ImageAccessReport> {
  const report: ImageAccessReport = {
    totalImages: images.length,
    accessibleImages: 0,
    inaccessibleImages: 0,
    issues: [],
    systemInfo: {
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      publicDir: path.join(process.cwd(), 'public'),
      baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      serverRunning: true
    }
  };

  // Check system directories
  try {
    await fs.access(report.systemInfo.publicDir);
  } catch {
    report.issues.push({
      url: 'SYSTEM',
      exists: false,
      accessible: false,
      error: 'Public directory does not exist',
      suggestions: ['Create public directory in project root']
    });
  }

  try {
    await fs.access(report.systemInfo.uploadDir);
  } catch {
    report.issues.push({
      url: 'SYSTEM',
      exists: false,
      accessible: false,
      error: 'Uploads directory does not exist',
      suggestions: ['Create public/uploads directory', 'Ensure upload process creates necessary directories']
    });
  }

  // Debug each image
  for (const image of images) {
    const debug = await debugImageAccess(image.url, image.localPath);
    
    if (debug.accessible) {
      report.accessibleImages++;
    } else {
      report.inaccessibleImages++;
      report.issues.push(debug);
    }
  }

  return report;
}

/**
 * Test image accessibility from client perspective
 */
export async function testClientImageAccess(imageUrl: string): Promise<{
  accessible: boolean;
  status?: number;
  error?: string;
  suggestions: string[];
}> {
  const result = {
    accessible: false,
    suggestions: [] as string[]
  };

  try {
    // Construct full URL if relative
    const fullUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${imageUrl}`;

    const response = await fetch(fullUrl, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Image-Debug-Tool'
      }
    });

    result.accessible = response.ok;
    result.status = response.status;

    if (!response.ok) {
      result.error = `HTTP ${response.status}: ${response.statusText}`;
      
      if (response.status === 404) {
        result.suggestions.push('Image file not found - check if upload completed');
        result.suggestions.push('Verify the URL path is correct');
        result.suggestions.push('Check if file exists in public directory');
      } else if (response.status === 403) {
        result.suggestions.push('Access forbidden - check file permissions');
        result.suggestions.push('Ensure web server can read the file');
      } else if (response.status >= 500) {
        result.suggestions.push('Server error - check server logs');
        result.suggestions.push('Verify web server configuration');
      }
    }

  } catch (error) {
    result.error = `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    result.suggestions.push('Check if the server is running');
    result.suggestions.push('Verify network connectivity');
    result.suggestions.push('Check firewall settings');
  }

  return result;
}

/**
 * Fix common image access issues automatically
 */
export async function autoFixImageAccess(): Promise<{
  fixed: string[];
  failed: string[];
  suggestions: string[];
}> {
  const result = {
    fixed: [] as string[],
    failed: [] as string[],
    suggestions: [] as string[]
  };

  try {
    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    try {
      await fs.access(publicDir);
      result.fixed.push('Public directory exists');
    } catch {
      try {
        await fs.mkdir(publicDir, { recursive: true });
        result.fixed.push('Created public directory');
      } catch (error) {
        result.failed.push(`Failed to create public directory: ${error}`);
      }
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(publicDir, 'uploads');
    try {
      await fs.access(uploadsDir);
      result.fixed.push('Uploads directory exists');
    } catch {
      try {
        await fs.mkdir(uploadsDir, { recursive: true });
        result.fixed.push('Created uploads directory');
      } catch (error) {
        result.failed.push(`Failed to create uploads directory: ${error}`);
      }
    }

    // Create subdirectories for different content types
    const subdirs = ['gallery', 'news', 'events', 'documents'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(uploadsDir, subdir);
      try {
        await fs.access(subdirPath);
        result.fixed.push(`${subdir} directory exists`);
      } catch {
        try {
          await fs.mkdir(subdirPath, { recursive: true });
          result.fixed.push(`Created ${subdir} directory`);
        } catch (error) {
          result.failed.push(`Failed to create ${subdir} directory: ${error}`);
        }
      }
    }

  } catch (error) {
    result.failed.push(`Auto-fix error: ${error}`);
  }

  // Add general suggestions
  result.suggestions.push('Restart the Next.js server after directory changes');
  result.suggestions.push('Check file permissions on created directories');
  result.suggestions.push('Verify Next.js static file serving configuration');

  return result;
}
