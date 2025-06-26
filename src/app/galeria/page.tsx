import { Card, CardContent } from "~/components/ui/card"
import { formatDate } from "~/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Plus } from "lucide-react"
import { db } from "~/server/db"
import { auth } from "~/auth"
import GalleryPageClient from "./viewer"
import { eq, and } from 'drizzle-orm';
import { images } from "~/server/db/schema"

export default async function GalleryPage() {
  const gallery_images = await db.query.images.findMany(
    {
      where: and(eq(images.gallery, true), eq(images.visible, true))
    }
  );

  // Get session outside of JSX
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Képgaléria</h1>
        {isAdmin && (
          <Link href="/admin/gallery/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </Link>
        )}
      </div>

      <GalleryPageClient images={gallery_images} />
    </div>
  )
}