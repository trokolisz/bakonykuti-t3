# Comprehensive File Management System

This document describes the comprehensive file management system implemented for the Bakonykúti T3 application. The system provides complete tracking, management, and cleanup capabilities for all uploaded files.

## Overview

The file management system consists of:

1. **Database Schema**: A new `files` table that tracks all uploaded files with comprehensive metadata
2. **API Routes**: RESTful endpoints for file operations (list, delete, bulk operations, cleanup)
3. **Admin Interface**: Web-based interface for browsing, managing, and cleaning up files
4. **Utility Functions**: Helper functions for file operations, orphan detection, and cleanup
5. **Migration Scripts**: Tools to migrate existing files and maintain the system
6. **Integration**: Automatic file tracking in existing upload routes

## Database Schema

### Files Table (`bakonykuti-t3_file`)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Unique file identifier |
| `original_name` | VARCHAR(512) | Original filename as uploaded |
| `filename` | VARCHAR(512) | Generated unique filename |
| `file_path` | VARCHAR(1024) | Full path from project root |
| `public_url` | VARCHAR(1024) | URL for web access |
| `mime_type` | VARCHAR(128) | MIME type of the file |
| `file_size` | INT | File size in bytes |
| `upload_type` | VARCHAR(64) | Type: gallery, news, events, documents |
| `uploaded_by` | VARCHAR(255) | User ID who uploaded the file |
| `associated_entity` | VARCHAR(64) | Related entity type (image, document) |
| `associated_entity_id` | INT | ID of the associated entity |
| `is_orphaned` | BOOLEAN | Whether file is orphaned |
| `last_accessed_at` | TIMESTAMP | Last access time |
| `created_at` | TIMESTAMP | Upload timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Indexes

- `file_path_idx`: For efficient path lookups
- `upload_type_idx`: For filtering by upload type
- `uploaded_by_idx`: For user-specific queries
- `associated_entity_idx`: For entity associations
- `orphaned_idx`: For orphan detection queries

## API Endpoints

### File Management API (`/api/admin/files`)

#### GET `/api/admin/files`
List all files or filter by type.

**Query Parameters:**
- `type`: Filter by upload type (gallery, news, events, documents)
- `action=orphans`: Get orphaned files report

**Response:**
```json
{
  "success": true,
  "files": [...],
  "total": 123
}
```

#### DELETE `/api/admin/files?id={fileId}`
Delete a specific file (both physical file and database record).

#### POST `/api/admin/files`
Bulk operations and cleanup.

**Body:**
```json
{
  "action": "cleanup|bulk_delete",
  "fileIds": [1, 2, 3],  // For bulk_delete
  "deleteFiles": true    // For cleanup
}
```

### Individual File API (`/api/admin/files/[id]`)

#### GET `/api/admin/files/[id]`
Get detailed information about a specific file.

#### PUT `/api/admin/files/[id]`
Update file metadata.

#### DELETE `/api/admin/files/[id]`
Delete a specific file.

## Admin Interface

### File Management Dashboard (`/admin/files`)

The admin interface provides:

1. **Statistics Cards**: Overview of total files, storage used, orphaned files
2. **File Browser**: Searchable and filterable list of all files
3. **Bulk Operations**: Select multiple files for batch deletion
4. **Orphan Detection**: Identify files without database records and vice versa
5. **Cleanup Tools**: Automated cleanup operations with confirmation dialogs

### Features

- **Search**: Find files by name or filename
- **Filter**: Filter by upload type (gallery, news, events, documents)
- **Sort**: Files sorted by creation date (newest first)
- **Preview**: View images directly in the interface
- **Bulk Selection**: Select all or individual files for batch operations
- **Safety Confirmations**: Confirmation dialogs for destructive operations

## Utility Functions

### Core Functions (`src/lib/file-management.ts`)

- `createFileRecord()`: Create a new file record
- `updateFileRecord()`: Update file metadata
- `deleteFileRecord()`: Delete database record
- `deletePhysicalFile()`: Delete physical file from disk
- `deleteFileCompletely()`: Delete both record and physical file
- `findOrphanedFiles()`: Detect orphaned files and records
- `cleanupOrphanedFiles()`: Perform cleanup operations
- `getMimeTypeFromExtension()`: Determine MIME type from filename
- `formatFileSize()`: Format file size for display

### File Operations

- **Physical File Management**: Safe deletion with path validation
- **Database Operations**: CRUD operations for file records
- **Orphan Detection**: Compare database records with physical files
- **Cleanup Operations**: Automated maintenance with error handling

## Migration and Setup

### 1. Create Files Table

```bash
bun scripts/create-files-table.ts
```

Creates the `bakonykuti-t3_file` table with proper indexes.

### 2. Migrate Existing Files

```bash
bun scripts/migrate-existing-files.ts
```

Populates the files table with existing images and documents:
- Scans existing `images` and `documents` tables
- Creates file records for each entry
- Detects orphaned files (missing physical files)
- Handles errors gracefully and provides detailed reporting

### 3. File Cleanup

```bash
# Dry run (no changes)
bun scripts/cleanup-files.ts --dry-run

# Update orphaned status only
bun scripts/cleanup-files.ts

# Full cleanup (delete orphaned files and records)
bun scripts/cleanup-files.ts --delete-files --delete-records

# Quiet mode
bun scripts/cleanup-files.ts --quiet
```

**Cleanup Options:**
- `--dry-run`: Preview changes without making them
- `--delete-files`: Remove orphaned files from disk
- `--delete-records`: Remove orphaned database records
- `--no-update-status`: Skip updating orphaned status
- `--quiet`: Reduce output verbosity

## Integration with Existing System

### Upload Routes Integration

All existing upload routes have been updated to automatically create file records:

- `/api/upload/gallery` → Creates records with `uploadType: 'gallery'`
- `/api/upload/news` → Creates records with `uploadType: 'news'`
- `/api/upload/events` → Creates records with `uploadType: 'events'`
- `/api/upload/documents` → Creates records with `uploadType: 'documents'`

### Automatic Tracking

When files are uploaded through existing routes:
1. Physical file is saved to disk
2. Entity record is created (image/document)
3. File record is automatically created with:
   - Link to the entity record
   - User who uploaded the file
   - Complete metadata (size, MIME type, paths)
   - Orphaned status (initially false)

## Maintenance and Monitoring

### Regular Maintenance Tasks

1. **Weekly Orphan Scan**: Run cleanup script to identify orphaned files
2. **Monthly Full Cleanup**: Remove confirmed orphaned files and records
3. **Storage Monitoring**: Monitor total storage usage through admin interface
4. **Association Verification**: Check that file records properly link to entities

### Monitoring Queries

```sql
-- Check orphaned files
SELECT COUNT(*) FROM `bakonykuti-t3_file` WHERE is_orphaned = true;

-- Storage usage by type
SELECT upload_type, COUNT(*), SUM(file_size) as total_size 
FROM `bakonykuti-t3_file` 
GROUP BY upload_type;

-- Files without associations
SELECT COUNT(*) FROM `bakonykuti-t3_file` 
WHERE associated_entity IS NULL OR associated_entity_id IS NULL;
```

## Security Considerations

1. **Path Validation**: All file paths are validated to prevent directory traversal
2. **Admin Only**: File management operations require admin authentication
3. **Confirmation Dialogs**: Destructive operations require user confirmation
4. **Error Handling**: Comprehensive error handling prevents data corruption
5. **Audit Trail**: All operations are logged with timestamps and user information

## Troubleshooting

### Common Issues

1. **Orphaned Files**: Use the cleanup script with `--dry-run` first
2. **Missing Physical Files**: Check file paths and permissions
3. **Database Inconsistencies**: Run the migration script again
4. **Performance Issues**: Ensure database indexes are properly created

### Recovery Procedures

1. **Restore from Backup**: If cleanup goes wrong, restore from database backup
2. **Re-run Migration**: Safe to run migration script multiple times
3. **Manual Cleanup**: Use admin interface for selective cleanup
4. **Database Repair**: Check and repair database tables if needed

## Future Enhancements

Potential improvements to consider:

1. **File Versioning**: Track multiple versions of the same file
2. **Access Logging**: Detailed access logs for security auditing
3. **Automated Backups**: Scheduled backups of file metadata
4. **Storage Quotas**: Per-user or per-type storage limits
5. **CDN Integration**: Support for external storage providers
6. **Thumbnail Generation**: Automatic thumbnail creation for images
7. **File Compression**: Automatic compression for large files
8. **Duplicate Detection**: Identify and merge duplicate files
