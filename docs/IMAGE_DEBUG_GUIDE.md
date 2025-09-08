# Image Access Debugging Guide

## Overview

This guide explains how to diagnose and fix image access issues in the Bakonykuti T3 application. When images are uploaded successfully but clients can't see them, use these debugging tools to identify and resolve the problem.

## Common Symptoms

- ✅ Images upload successfully (no errors in upload process)
- ❌ Images don't display on the website (broken image icons)
- ❌ Direct image URLs return 404 errors
- ❌ Gallery shows empty spaces where images should be

## Quick Diagnosis

### 1. Access the Debug Dashboard
Navigate to: `/admin/debug/images`

### 2. Generate System Report
Click "Generate Image Access Report" to get a comprehensive overview of:
- Total images in database vs accessible images
- System directory status
- Database configuration
- Sample problematic images

### 3. Test Individual Images
Use the "Test Single Image" tab to check specific image URLs:
- Enter the image URL (e.g., `/uploads/gallery/image.jpg`)
- Get detailed accessibility information
- Receive specific suggestions for fixing issues

## Common Issues & Solutions

### Issue 1: Missing Upload Directories

**Symptoms:**
- Upload succeeds but images aren't accessible
- 404 errors when accessing image URLs

**Solution:**
1. Go to `/admin/debug/images`
2. Click "Auto-Fix Issues" tab
3. Click "Run Auto-Fix" to create missing directories

**Manual Fix:**
```bash
mkdir -p public/uploads/gallery
mkdir -p public/uploads/news
mkdir -p public/uploads/events
mkdir -p public/uploads/documents
```

### Issue 2: Incorrect File Paths

**Symptoms:**
- Images stored outside public directory
- Database contains wrong URLs

**Diagnosis:**
- Check the system report for "Images with Local Path" vs "Images without Local Path"
- Look for images with URLs not starting with `/uploads/`

**Solution:**
- Re-upload affected images
- Update database entries to correct paths

### Issue 3: File Permission Issues

**Symptoms:**
- Files exist but return 403 Forbidden errors
- Server can't read uploaded files

**Diagnosis:**
- System report shows files exist but aren't accessible
- HTTP status 403 in test results

**Solution:**
```bash
# Fix file permissions (Linux/Mac)
chmod -R 644 public/uploads/
chmod -R 755 public/uploads/*/

# Fix directory permissions
find public/uploads -type d -exec chmod 755 {} \;
find public/uploads -type f -exec chmod 644 {} \;
```

### Issue 4: Next.js Static File Serving

**Symptoms:**
- Files exist in correct location
- Direct file access works but Next.js Image component fails

**Solution:**
1. Restart the Next.js development server
2. Clear browser cache
3. Check Next.js configuration in `next.config.js`

## Debug Tools Reference

### API Endpoints

#### GET `/api/debug/images?action=report`
Generates comprehensive system report

#### GET `/api/debug/images?action=test&url={imageUrl}`
Tests accessibility of a specific image

#### GET `/api/debug/images?action=fix`
Automatically fixes common issues

#### POST `/api/debug/images`
Batch tests multiple images
```json
{
  "imageUrls": ["/uploads/gallery/image1.jpg", "/uploads/gallery/image2.jpg"]
}
```

### Debug Components

#### `<DebugImage>` Component
Enhanced image component with built-in debugging:

```tsx
import DebugImage from '~/components/ui/debug-image';

<DebugImage
  src="/uploads/gallery/image.jpg"
  alt="Gallery image"
  width={400}
  height={300}
  showDebugInfo={true} // Shows debug info by default
  onError={(error) => console.log('Image error:', error)}
  onLoad={() => console.log('Image loaded successfully')}
/>
```

Features:
- Automatic error detection and retry
- Visual debug information overlay
- Direct links to debug tools
- Detailed error messages and suggestions

### Image Serving API

#### `/api/images/[...path]`
Custom image serving endpoint with enhanced logging and error handling:

- Serves images from `public/` directory
- Provides detailed error messages in development
- Logs all access attempts for debugging
- Supports conditional requests (caching)
- Security checks against directory traversal

## Troubleshooting Workflow

### Step 1: Initial Assessment
1. Go to `/admin/debug/images`
2. Generate system report
3. Check the summary statistics:
   - If "Inaccessible Images" > 0, proceed to Step 2
   - If all images are accessible, the issue might be client-side

### Step 2: Identify Root Cause
Look at the "Issues Found" section in the report:
- **404 errors**: Files don't exist or wrong paths
- **403 errors**: Permission issues
- **Network errors**: Server or configuration problems

### Step 3: Apply Fixes
1. Try "Auto-Fix" first for common issues
2. For specific issues, follow the suggestions in the report
3. Re-run the report to verify fixes

### Step 4: Test Individual Images
1. Use "Test Single Image" for problematic images
2. Check if the issue is resolved
3. If not, follow the specific suggestions provided

### Step 5: Verify Client Access
1. Open image URLs directly in browser
2. Check if images display in the application
3. Clear browser cache if needed

## Prevention

### Best Practices
1. **Always use the upload API endpoints** instead of manual file copying
2. **Monitor the debug dashboard** regularly for issues
3. **Set up proper file permissions** on the server
4. **Use the `<DebugImage>` component** in development for early issue detection

### Monitoring
- Check `/admin/debug/images` weekly
- Monitor server logs for `[IMAGE-ACCESS]` entries
- Set up alerts for high numbers of 404/403 errors

## Advanced Debugging

### Server Logs
Look for entries like:
```
[IMAGE-ACCESS] {"timestamp":"2024-01-01T12:00:00.000Z","path":"uploads/gallery/image.jpg","success":false,"error":"File not found"}
```

### Database Queries
Check image records in the database:
```sql
SELECT id, title, url, localPath, visible, gallery 
FROM bakonykuti-t3_image 
WHERE visible = true 
ORDER BY createdAt DESC 
LIMIT 10;
```

### File System Check
Verify files exist:
```bash
ls -la public/uploads/gallery/
find public/uploads -name "*.jpg" -type f | head -10
```

## Getting Help

If issues persist after following this guide:

1. **Collect Debug Information:**
   - System report from `/admin/debug/images`
   - Server logs with `[IMAGE-ACCESS]` entries
   - Browser console errors
   - Network tab showing failed requests

2. **Check Common Causes:**
   - Server restart needed
   - File system permissions
   - Database inconsistencies
   - Next.js configuration issues

3. **Contact Support:**
   - Include all collected debug information
   - Specify exact error messages
   - Provide steps to reproduce the issue
