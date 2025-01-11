import { Card, CardContent } from "~/components/ui/card"
import { formatDate } from "~/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Plus } from "lucide-react"
import { db } from "~/server/db"
import { SignedIn } from "@clerk/nextjs"
import { images } from "~/server/db/schema"


export default async function GalleryPage() {
  const images = await db.query.images.findMany()
  
 

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Képgaléria</h1>
        <SignedIn>
          <Link href="/admin/gallery/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </Link>
        </SignedIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images
          .filter((image) => image.gallery === true)
          .map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square">
          <Link href={image.url}>
            <Image
              src={image.url}
              alt={image.title?? 'Uploaded image'}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </Link>
              </div>
              <CardContent className="p-4">
          <h3 className="font-semibold mb-1">{image.title}</h3>
          <p className="text-xs text-muted-foreground">
            Added on {formatDate(image.createdAt)}
          </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}