import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '~/lib/api-auth';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { generateImageAccessReport, autoFixImageAccess, testClientImageAccess } from '~/lib/image-debug';

export async function GET(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'report';

    switch (action) {
      case 'report':
        return await generateDebugReport();
      case 'test':
        const testUrl = url.searchParams.get('url');
        if (!testUrl) {
          return NextResponse.json({ error: 'URL parameter required for test' }, { status: 400 });
        }
        return await testSingleImage(testUrl);
      case 'fix':
        return await performAutoFix();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateDebugReport() {
  try {
    // Get all images from database
    const allImages = await db.select().from(images);
    
    // Convert to format expected by debug function
    const imageList = allImages.map(img => ({
      url: img.url,
      localPath: img.localPath || undefined
    }));

    // Generate comprehensive report
    const report = await generateImageAccessReport(imageList);

    // Add database info
    const enhancedReport = {
      ...report,
      databaseInfo: {
        totalImagesInDb: allImages.length,
        imagesWithLocalPath: allImages.filter(img => img.localPath).length,
        imagesWithoutLocalPath: allImages.filter(img => !img.localPath).length,
        externalImages: allImages.filter(img => img.url.startsWith('http')).length,
        localImages: allImages.filter(img => !img.url.startsWith('http')).length,
      },
      sampleImages: allImages.slice(0, 5).map(img => ({
        id: img.id,
        url: img.url,
        localPath: img.localPath,
        title: img.title,
        visible: img.visible,
        gallery: img.gallery
      }))
    };

    return NextResponse.json({
      success: true,
      report: enhancedReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating debug report:', error);
    return NextResponse.json(
      { error: 'Failed to generate debug report' },
      { status: 500 }
    );
  }
}

async function testSingleImage(imageUrl: string) {
  try {
    const result = await testClientImageAccess(imageUrl);
    
    return NextResponse.json({
      success: true,
      imageUrl,
      test: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error testing image:', error);
    return NextResponse.json(
      { error: 'Failed to test image access' },
      { status: 500 }
    );
  }
}

async function performAutoFix() {
  try {
    const result = await autoFixImageAccess();
    
    return NextResponse.json({
      success: true,
      autoFix: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error performing auto-fix:', error);
    return NextResponse.json(
      { error: 'Failed to perform auto-fix' },
      { status: 500 }
    );
  }
}

// POST endpoint for batch testing multiple images
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { imageUrls } = body;

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json({ error: 'imageUrls must be an array' }, { status: 400 });
    }

    const results = [];
    for (const url of imageUrls) {
      try {
        const test = await testClientImageAccess(url);
        results.push({
          url,
          ...test
        });
      } catch (error) {
        results.push({
          url,
          accessible: false,
          error: `Test failed: ${error}`,
          suggestions: ['Unable to test this image']
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        accessible: results.filter(r => r.accessible).length,
        inaccessible: results.filter(r => !r.accessible).length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
