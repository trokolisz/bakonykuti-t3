import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { stat } from 'fs/promises';

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

// Get MIME type from file extension
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Log image access attempts for debugging
function logImageAccess(imagePath: string, success: boolean, error?: string) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    path: imagePath,
    success,
    error,
    userAgent: 'API-Request'
  };
  
  console.log(`[IMAGE-ACCESS] ${JSON.stringify(logEntry)}`);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    // Reconstruct the file path from the URL segments
    const requestedPath = pathSegments.join('/');
    
    // Security: Prevent directory traversal attacks
    if (requestedPath.includes('..') || requestedPath.includes('\\')) {
      logImageAccess(requestedPath, false, 'Directory traversal attempt');
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Construct the full file path
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, requestedPath);

    // Ensure the file is within the public directory
    const normalizedFilePath = path.normalize(filePath);
    const normalizedPublicDir = path.normalize(publicDir);
    
    if (!normalizedFilePath.startsWith(normalizedPublicDir)) {
      logImageAccess(requestedPath, false, 'Path outside public directory');
      return new NextResponse('Forbidden', { status: 403 });
    }

    try {
      // Check if file exists and get stats
      const fileStats = await stat(normalizedFilePath);
      
      if (!fileStats.isFile()) {
        logImageAccess(requestedPath, false, 'Not a file');
        return new NextResponse('Not Found', { status: 404 });
      }

      // Read the file
      const fileBuffer = await fs.readFile(normalizedFilePath);
      
      // Get MIME type
      const mimeType = getMimeType(normalizedFilePath);
      
      // Log successful access
      logImageAccess(requestedPath, true);

      // Set appropriate headers
      const headers = new Headers({
        'Content-Type': mimeType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Last-Modified': fileStats.mtime.toUTCString(),
        'ETag': `"${fileStats.size}-${fileStats.mtime.getTime()}"`,
      });

      // Handle conditional requests (If-None-Match, If-Modified-Since)
      const ifNoneMatch = request.headers.get('if-none-match');
      const ifModifiedSince = request.headers.get('if-modified-since');
      const etag = headers.get('ETag');
      
      if (ifNoneMatch === etag || 
          (ifModifiedSince && new Date(ifModifiedSince) >= fileStats.mtime)) {
        return new NextResponse(null, { status: 304, headers });
      }

      return new NextResponse(fileBuffer, { headers });

    } catch (fileError) {
      // File doesn't exist or can't be read
      const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown file error';
      logImageAccess(requestedPath, false, errorMessage);
      
      // Return detailed error in development, generic in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      const responseMessage = isDevelopment 
        ? `File not found: ${requestedPath} (${errorMessage})`
        : 'Not Found';
      
      return new NextResponse(responseMessage, { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache'
        }
      });
    }

  } catch (error) {
    // General server error
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    logImageAccess(pathSegments.join('/'), false, `Server error: ${errorMessage}`);
    
    console.error('Image serving error:', error);
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    const responseMessage = isDevelopment 
      ? `Server error: ${errorMessage}`
      : 'Internal Server Error';
    
    return new NextResponse(responseMessage, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

// Handle HEAD requests for image testing
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const requestedPath = pathSegments.join('/');
    
    // Security checks (same as GET)
    if (requestedPath.includes('..') || requestedPath.includes('\\')) {
      return new NextResponse(null, { status: 403 });
    }

    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, requestedPath);
    const normalizedFilePath = path.normalize(filePath);
    const normalizedPublicDir = path.normalize(publicDir);
    
    if (!normalizedFilePath.startsWith(normalizedPublicDir)) {
      return new NextResponse(null, { status: 403 });
    }

    try {
      const fileStats = await stat(normalizedFilePath);
      
      if (!fileStats.isFile()) {
        return new NextResponse(null, { status: 404 });
      }

      const mimeType = getMimeType(normalizedFilePath);
      
      const headers = new Headers({
        'Content-Type': mimeType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Last-Modified': fileStats.mtime.toUTCString(),
        'ETag': `"${fileStats.size}-${fileStats.mtime.getTime()}"`,
      });

      return new NextResponse(null, { status: 200, headers });

    } catch (fileError) {
      return new NextResponse(null, { status: 404 });
    }

  } catch (error) {
    console.error('Image HEAD request error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
