import { db } from "~/server/db"
import { images } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import GalleryPageClient from "./viewer"
import { revalidatePath } from "next/cache"
import Link from "next/link"

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
      <h1 className="text-3xl font-bold mb-8">Gallery Management</h1>
      <Link href="/admin/gallery/upload" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Upload New Image
      </Link>
      <GalleryPageClient 
        images={imageList} 
        onDelete={deleteImage}
        onUpdate={updateImage}
      />
    </div>
  )
}