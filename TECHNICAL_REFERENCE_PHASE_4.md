# Technical Reference for Phase 4 Implementation

## Code Patterns and Examples

### Database Query Patterns

**Get all images with visibility status:**
```typescript
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Get all images for admin
const allImages = await db.select().from(images).orderBy(images.createdAt);

// Get only visible images for public gallery
const visibleImages = await db.select().from(images)
  .where(eq(images.visible, true))
  .orderBy(images.createdAt);

// Update image visibility
await db.update(images)
  .set({ visible: true })
  .where(eq(images.id, imageId));
```

### Authentication Pattern
```typescript
import { auth } from "~/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  // Admin content here
}

// For API routes
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // API logic here
}
```

### File Management Patterns
```typescript
import { deleteFileByUrl, listFiles } from "~/lib/file-management";

// Delete image and file
const result = await deleteFileByUrl(image.url);
if (result.success) {
  await db.delete(images).where(eq(images.id, imageId));
}

// List all files in gallery directory
const galleryFiles = await listFiles('gallery');
```

### Component Patterns

**Admin table with actions:**
```typescript
interface ImageWithActions {
  id: number;
  title: string;
  url: string;
  visible: boolean;
  createdAt: Date;
}

function ImageManagementTable({ images }: { images: ImageWithActions[] }) {
  const toggleVisibility = async (id: number, visible: boolean) => {
    // API call to toggle visibility
  };

  const deleteImage = async (id: number) => {
    // API call to delete image
  };

  return (
    <table className="w-full">
      {images.map(image => (
        <tr key={image.id}>
          <td>{image.title}</td>
          <td>
            <button onClick={() => toggleVisibility(image.id, !image.visible)}>
              {image.visible ? 'Hide' : 'Show'}
            </button>
          </td>
          <td>
            <button onClick={() => deleteImage(image.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </table>
  );
}
```

## API Route Examples

### Toggle Image Visibility
```typescript
// src/app/api/admin/images/[id]/visibility/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { visible } = await request.json();
  const imageId = parseInt(params.id);

  await db.update(images)
    .set({ visible, updatedAt: new Date() })
    .where(eq(images.id, imageId));

  return NextResponse.json({ success: true });
}
```

### Delete Image
```typescript
// src/app/api/admin/images/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const imageId = parseInt(params.id);
  
  // Get image info
  const image = await db.query.images.findFirst({
    where: eq(images.id, imageId),
  });

  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  // Delete file first
  const fileResult = await deleteFileByUrl(image.url);
  
  // Delete from database
  await db.delete(images).where(eq(images.id, imageId));

  return NextResponse.json({ 
    success: true, 
    fileDeleted: fileResult.success 
  });
}
```

## Existing Component References

### Current Gallery Viewer Structure
```typescript
// src/app/admin/gallery/viewer.tsx - Current structure to enhance
export default function GalleryViewer() {
  // Currently shows basic image grid
  // Needs enhancement for visibility controls
}
```

### Public Gallery Structure
```typescript
// src/app/galeria/page.tsx - Needs filtering update
export default async function GalleryPage() {
  // Currently shows all images
  // Needs to filter by visible = true
}
```

## UI Component Patterns

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

{isLoading ? (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="ml-2">Loading...</span>
  </div>
) : (
  // Content
)}
```

### Error Handling
```typescript
const [error, setError] = useState<string | null>(null);

{error && (
  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md">
    {error}
  </div>
)}
```

### Confirmation Dialogs
```typescript
const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this image?')) {
    return;
  }
  // Proceed with deletion
};
```

## File Structure for Phase 4

### New Files to Create
```
src/
├── app/
│   ├── api/
│   │   └── admin/
│   │       └── images/
│   │           ├── route.ts (list all images)
│   │           └── [id]/
│   │               ├── route.ts (delete image)
│   │               └── visibility/
│   │                   └── route.ts (toggle visibility)
│   └── admin/
│       └── gallery/
│           └── manage/
│               └── page.tsx (new admin management interface)
└── components/
    └── admin/
        ├── ImageManagementTable.tsx
        ├── FileStatistics.tsx
        └── BulkActions.tsx
```

### Files to Update
```
src/
├── app/
│   ├── admin/gallery/viewer.tsx (enhance with admin controls)
│   └── galeria/page.tsx (filter by visibility)
└── components/ (create admin-specific components)
```

## Styling Patterns

### Admin Interface Styling
```typescript
// Table styling
className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"

// Action buttons
className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90"

// Status badges
className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
  visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}`}
```

### Responsive Grid
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
```

## Testing Approach

### Manual Testing Checklist
1. ✅ Upload new images through admin interface
2. ✅ Verify images appear in admin management
3. ✅ Toggle visibility and check public gallery
4. ✅ Delete images and verify file removal
5. ✅ Test bulk operations
6. ✅ Verify responsive design
7. ✅ Test error handling

### Database Verification
```bash
# Check image counts
bun scripts/verify-database-state.ts

# Test database connection
bun run db:test-connection
```

## Performance Considerations

### Image Loading
- Use Next.js Image component for optimization
- Implement lazy loading for large galleries
- Consider pagination for admin interface

### File Operations
- Handle large file operations asynchronously
- Provide progress feedback for bulk operations
- Implement proper error recovery

This technical reference provides the specific patterns and examples needed to implement Phase 4 efficiently while maintaining code quality and consistency with the existing codebase.
