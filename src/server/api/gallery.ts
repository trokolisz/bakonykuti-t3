import { db } from "~/server/db"
import { images } from "~/server/db/schema"
import { eq } from "drizzle-orm"

export interface GalleryStats {
    totalImages: number
    carouselImages: number
    storageUsed: number
    recentImages: {
        url: string
        title: string
        isCarousel: boolean
    }[]
}

export async function getExistingGalleryImages(): Promise<GalleryStats> {
    const allImages = await db.query.images.findMany({
        orderBy: (images, { desc }) => [desc(images.createdAt)],
        where: eq(images.gallery, true)
    })

    return {
        totalImages: allImages.length,
        carouselImages: allImages.filter(img => img.carousel).length,
        storageUsed: Math.round(allImages.reduce((acc, img) => acc + (img.image_size ?? 0), 0) / 1024 / 1024),
        recentImages: allImages.slice(0, 10).map(img => ({
            url: img.url,
            title: img.title ?? '',
            isCarousel: img.carousel ?? false
        }))
    }
}

export async function saveImage(imageData: {
    url: string
    title: string
    isCarousel: boolean
    size?: number
}) {
    return await db.insert(images).values({
        ...imageData,
        gallery: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    })
}

export async function updateImage(id: number, imageData: Partial<{
    title: string
    isCarousel: boolean
}>) {
    return await db
        .update(images)
        .set({
            ...imageData,
            updatedAt: new Date(),
        })
        .where(eq(images.id, id))
}

export async function deleteImage(id: number) {
    return await db
        .delete(images)
        .where(eq(images.id, id))
}
