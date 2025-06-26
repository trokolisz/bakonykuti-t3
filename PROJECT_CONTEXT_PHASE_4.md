# Project Context for Phase 4: Update Admin Interfaces

## Project Overview
This is a Next.js T3 stack application (bakonykuti-t3) that is replacing UploadThing external image storage with a local file storage solution. We have completed Phases 1-3 and are ready to start Phase 4.

## Technology Stack
- **Framework**: Next.js 14 with App Router
- **Database**: MariaDB (running in Docker, database: `bakonykuti-mariadb`)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth
- **Package Manager**: Bun (preferred over npm)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety throughout

## User Preferences (from memories)
- User prefers Bun as package manager instead of npm
- User prefers using local MariaDB database (bakonykuti-mariadb on port 3306) instead of Vercel Postgres
- User prefers using Leaflet instead of Google Maps for map functionality
- User prefers local file storage over external services like UploadThing for image management
- User wants to replace Clerk authentication with NextAuth and use users from their own database

## Completed Phases Summary

### Phase 1: Setup Local Storage Infrastructure ✅ COMPLETED
**Created upload directories:**
- `/public/uploads/gallery/` - for gallery images
- `/public/uploads/news/` - for news images  
- `/public/uploads/events/` - for event images
- `/public/uploads/documents/` - for PDF documents

**Created file upload utilities:**
- `src/lib/file-upload.ts` - Core file upload functionality
- `src/lib/file-management.ts` - File management utilities

**Created API routes:**
- `src/app/api/upload/gallery/route.ts` - Gallery uploads (max 5 files, 4MB each)
- `src/app/api/upload/news/route.ts` - News uploads (max 1 file, 4MB)
- `src/app/api/upload/events/route.ts` - Event uploads (max 1 file, 4MB)
- `src/app/api/upload/documents/route.ts` - Document uploads (max 1 file, 4MB)

### Phase 2: Update Database Schema ✅ COMPLETED
**Enhanced images table with new columns:**
```sql
ALTER TABLE `bakonykuti-t3_image` 
ADD COLUMN `visible` BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN `local_path` VARCHAR(1024) NULL;
```

**Migration scripts created:**
- `scripts/enhanced-mariadb-migration.ts` - Complete migration process
- `scripts/verify-database-state.ts` - Database verification
- `MIGRATION_GUIDE.md` - Comprehensive migration documentation

**Database state verified:**
- All 43 existing images preserved with `visible = TRUE`
- New columns working with Drizzle ORM
- Full compatibility confirmed

### Phase 3: Create New Upload Components ✅ COMPLETED
**Created reusable components:**
- `src/components/file-upload/ImageUpload.tsx` - Advanced drag-and-drop image upload
- `src/components/file-upload/DocumentUpload.tsx` - Specialized document upload
- `src/components/file-upload/UploadButton.tsx` - Drop-in UploadThing replacement
- `src/components/file-upload/index.ts` - Component exports
- `src/utils/local-upload.ts` - UploadThing compatibility utilities

**Updated all admin components:**
- `src/app/admin/gallery/upload/UploadForm.tsx` ✅ Updated
- `src/app/admin/news/create/UpdateButton.tsx` ✅ Updated
- `src/app/admin/news/edit/[id]/UpdateButton.tsx` ✅ Updated
- `src/app/admin/events/create/UpdateButton.tsx` ✅ Updated
- `src/app/admin/documents/create/UpdateButton.tsx` ✅ Updated

## Current Database Schema

### Images Table (`bakonykuti-t3_image`)
```sql
CREATE TABLE `bakonykuti-t3_image` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `url` VARCHAR(1024) NOT NULL,
  `title` VARCHAR(256) NOT NULL DEFAULT '',
  `carousel` BOOLEAN NOT NULL DEFAULT false,
  `gallery` BOOLEAN NOT NULL DEFAULT true,
  `visible` BOOLEAN NOT NULL DEFAULT true,      -- NEW: Controls public visibility
  `local_path` VARCHAR(1024) NULL,              -- NEW: Tracks local file paths
  `image_size` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Other Tables
- `bakonykuti-t3_news` - News articles with thumbnail field
- `bakonykuti-t3_event` - Events (uses news uploader for thumbnails)
- `bakonykuti-t3_document` - Documents with fileUrl field
- `bakonykuti-t3_page` - Static pages
- `bakonykuti-t3_user` - User accounts
- `bakonykuti-t3_account`, `bakonykuti-t3_session`, `bakonykuti-t3_verificationToken` - Auth tables

## File Structure Status
```
src/
├── app/
│   ├── api/
│   │   └── upload/
│   │       ├── gallery/route.ts ✅ Created
│   │       ├── news/route.ts ✅ Created
│   │       ├── events/route.ts ✅ Created
│   │       └── documents/route.ts ✅ Created
│   ├── admin/
│   │   ├── gallery/
│   │   │   ├── upload/UploadForm.tsx ✅ Updated
│   │   │   └── viewer.tsx (needs Phase 4 updates)
│   │   ├── news/create/UpdateButton.tsx ✅ Updated
│   │   ├── news/edit/[id]/UpdateButton.tsx ✅ Updated
│   │   ├── events/create/UpdateButton.tsx ✅ Updated
│   │   └── documents/create/UpdateButton.tsx ✅ Updated
│   └── galeria/page.tsx (public gallery - needs Phase 4 updates)
├── components/
│   └── file-upload/ ✅ Created
│       ├── ImageUpload.tsx
│       ├── DocumentUpload.tsx
│       ├── UploadButton.tsx
│       └── index.ts
├── lib/
│   ├── file-upload.ts ✅ Created
│   └── file-management.ts ✅ Created
└── utils/
    └── local-upload.ts ✅ Created

public/
└── uploads/ ✅ Created
    ├── gallery/
    ├── news/
    ├── events/
    └── documents/
```

## Phase 4 Requirements: Update Admin Interfaces

### 4.1 Admin Gallery Management
**Create admin interface that displays ALL images from local storage:**
- Show all images with metadata (title, size, upload date, visibility status)
- Allow admins to toggle visibility for public gallery
- Provide delete functionality that removes files from local storage
- Add bulk operations (select multiple, bulk delete, bulk visibility toggle)

### 4.2 Update Public Gallery
**Modify public gallery to only show visible images:**
- Update `src/app/galeria/page.tsx` to filter by `visible = true`
- Ensure proper image loading from local paths
- Maintain existing UI/UX patterns

### 4.3 Admin Dashboard Enhancements
**Add file management statistics:**
- Total images count
- Storage usage
- Visibility distribution
- Recent uploads

### 4.4 File Cleanup Utilities
**Create admin tools for:**
- Finding orphaned files (exist locally but not in database)
- Finding missing files (in database but not locally)
- Cleanup operations with confirmation dialogs

## Key Implementation Notes

### Authentication
- All admin operations require authenticated users
- Use `auth()` from `~/auth` for session checking
- Admin routes should verify user permissions

### Database Operations
- Use Drizzle ORM with proper TypeScript types
- Import from `~/server/db` and `~/server/db/schema`
- Use `eq` from `drizzle-orm` for where clauses

### File Operations
- Use utilities from `~/lib/file-management.ts`
- Always handle errors gracefully
- Provide user feedback for operations

### UI/UX Consistency
- Follow existing admin interface patterns
- Use Tailwind CSS for styling
- Maintain responsive design
- Provide loading states and error messages

## Next Steps for Phase 4
1. Create admin gallery viewer with visibility controls
2. Update public gallery to respect visibility settings
3. Add file management dashboard
4. Implement cleanup utilities
5. Test all functionality thoroughly

## Important Files to Reference
- Database schema: `src/server/db/schema.ts`
- File utilities: `src/lib/file-upload.ts`, `src/lib/file-management.ts`
- Existing gallery viewer: `src/app/admin/gallery/viewer.tsx`
- Public gallery: `src/app/galeria/page.tsx`
- Upload components: `src/components/file-upload/`

## Testing Commands
- `bun run dev` - Start development server
- `bun run typecheck` - TypeScript validation
- `bun scripts/verify-database-state.ts` - Verify database
- `bun run db:test-connection` - Test database connection
