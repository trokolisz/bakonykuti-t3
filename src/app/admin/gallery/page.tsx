import { db } from "~/server/db"
import { images } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import GalleryPageClient from "./viewer"
import { revalidatePath } from "next/cache"
import Link from "next/link"

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const imageList = await db.select().from(images).orderBy(images.createdAt)

  async function deleteImage(id: number) {
    "use server"
    await db.delete(images).where(eq(images.id, id))
    revalidatePath('/admin/gallery')
  }

  async function updateImage(id: number, data: Partial<typeof images.$inferSelect>) {
    "use server"
    await db.update(images)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(images.id, id))
    revalidatePath('/admin/gallery')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <div className="flex gap-4">
          <Link href="/admin/gallery/manage" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Advanced Management
          </Link>
          <Link href="/admin/gallery/upload" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Upload New Image
          </Link>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Quick View:</strong> This page shows a simplified view of your images.
          For advanced features like bulk operations, detailed statistics, and better visibility management,
          use the <Link href="/admin/gallery/manage" className="underline font-medium">Advanced Management</Link> interface.
        </p>
      </div>

      <GalleryPageClient
        images={imageList}
        onDelete={deleteImage}
        onUpdate={updateImage}
      />
    </div>
  )
}