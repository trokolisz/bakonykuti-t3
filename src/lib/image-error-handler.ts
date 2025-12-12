/**
 * Client-side image error handling utilities
 */

export interface ImageErrorInfo {
  url: string;
  error: string;
  timestamp: Date;
  userAgent: string;
  isPlaceholder?: boolean;
}

// Store image errors for debugging
const imageErrors: ImageErrorInfo[] = [];

/**
 * Log an image error for debugging purposes
 */
export function logImageError(url: string, error: string, isPlaceholder: boolean = false) {
  const errorInfo: ImageErrorInfo = {
    url,
    error,
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    isPlaceholder
  };
  
  imageErrors.push(errorInfo);
  
  // Keep only the last 50 errors to prevent memory issues
  if (imageErrors.length > 50) {
    imageErrors.shift();
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[IMAGE-ERROR] ${url}: ${error}`, errorInfo);
  }
}

/**
 * Get all logged image errors
 */
export function getImageErrors(): ImageErrorInfo[] {
  return [...imageErrors];
}

/**
 * Clear all logged image errors
 */
export function clearImageErrors() {
  imageErrors.length = 0;
}

/**
 * Check if an image is likely a placeholder (1x1 transparent PNG)
 */
export function isPlaceholderImage(img: HTMLImageElement): boolean {
  return img.naturalWidth === 1 && img.naturalHeight === 1;
}

/**
 * Test if an image URL is accessible
 */
export async function testImageUrl(url: string): Promise<{ accessible: boolean; status?: number; error?: string }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      accessible: response.ok,
      status: response.status,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      accessible: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Create a fallback image URL for broken images
 */
export function createFallbackImageUrl(originalUrl: string, width: number = 400, height: number = 300): string {
  // Create a data URL for a simple placeholder
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return originalUrl;
  
  // Draw a simple placeholder
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  
  // Draw border
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);
  
  // Draw icon (simple image icon)
  ctx.fillStyle = '#9ca3af';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Image not found', width / 2, height / 2 - 10);
  ctx.fillText(originalUrl.split('/').pop() || 'Unknown', width / 2, height / 2 + 10);
  
  return canvas.toDataURL();
}

/**
 * Enhanced image loading with error handling
 */
export function loadImageWithFallback(
  url: string, 
  fallbackUrl?: string
): Promise<{ success: boolean; finalUrl: string; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      // Check if it's a placeholder
      if (isPlaceholderImage(img)) {
        const error = 'Received placeholder image (file not found)';
        logImageError(url, error, true);
        
        if (fallbackUrl) {
          // Try fallback
          loadImageWithFallback(fallbackUrl).then(resolve);
        } else {
          resolve({ success: false, finalUrl: url, error });
        }
      } else {
        resolve({ success: true, finalUrl: url });
      }
    };
    
    img.onerror = () => {
      const error = 'Failed to load image';
      logImageError(url, error);
      
      if (fallbackUrl) {
        // Try fallback
        loadImageWithFallback(fallbackUrl).then(resolve);
      } else {
        resolve({ success: false, finalUrl: url, error });
      }
    };
    
    img.src = url;
  });
}

/**
 * Batch test multiple image URLs
 */
export async function batchTestImages(urls: string[]): Promise<Array<{
  url: string;
  accessible: boolean;
  status?: number;
  error?: string;
}>> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const result = await testImageUrl(url);
      return { url, ...result };
    })
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        url: urls[index]!,
        accessible: false,
        error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
      };
    }
  });
}
