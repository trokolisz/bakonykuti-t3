import { db } from "~/server/db"
import GalleryPageClient from "./viewer"
import { eq, and } from 'drizzle-orm';
import { images } from "~/server/db/schema"
import { AdminGalleryButton } from "~/components/admin/admin-gallery-button"

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const gallery_images = await db.query.images.findMany(
    {
      where: and(eq(images.gallery, true), eq(images.visible, true))
    }
  );

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Képgaléria</h1>
        <AdminGalleryButton />
      </div>

      <GalleryPageClient images={gallery_images} />
    </div>
  )
}