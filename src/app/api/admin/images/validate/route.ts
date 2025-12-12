import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '~/lib/api-auth';
import { 
  validateAllImages, 
  cleanupOrphanedImages, 
  getImageHealthCheck,
  checkImageExists 
} from '~/lib/image-validation';

// GET - Get image validation report
export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'health';
    const imageUrl = searchParams.get('url');

    switch (action) {
      case 'health':
        const healthCheck = await getImageHealthCheck();
        return NextResponse.json({
          success: true,
          health: healthCheck
        });

      case 'full':
        const validation = await validateAllImages();
        return NextResponse.json({
          success: true,
          validation
        });

      case 'test':
        if (!imageUrl) {
          return NextResponse.json(
            { error: 'URL parameter is required for test action' },
            { status: 400 }
          );
        }
        
        const testResult = await checkImageExists(imageUrl);
        return NextResponse.json({
          success: true,
          url: imageUrl,
          result: testResult
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: health, full, or test' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Image validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate images' },
      { status: 500 }
    );
  }
}

// POST - Cleanup orphaned images
export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { action, dryRun = true } = body;

    if (action !== 'cleanup') {
      return NextResponse.json(
        { error: 'Invalid action. Use: cleanup' },
        { status: 400 }
      );
    }

    const result = await cleanupOrphanedImages(dryRun);
    
    return NextResponse.json({
      success: true,
      dryRun,
      result,
      message: dryRun 
        ? `Dry run completed. Would remove ${result.removed} orphaned images`
        : `Cleanup completed. Removed ${result.removed} orphaned images`
    });

  } catch (error) {
    console.error('Image cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup images' },
      { status: 500 }
    );
  }
}
