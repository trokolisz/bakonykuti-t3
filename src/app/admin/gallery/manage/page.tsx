import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import FileStatistics from "~/components/admin/FileStatistics";
import ImageManagementClient from "./ImageManagementClient";

// Force dynamic rendering to prevent static generation issues with auth()
export const dynamic = 'force-dynamic';

export default async function AdminGalleryManagePage() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      redirect('/api/auth/signin');
    }

    // Fetch all images for admin
    const allImages = await db.select().from(images).orderBy(desc(images.createdAt));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/gallery">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Image Management</h1>
        </div>
        <Link href="/admin/gallery/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload New Images
          </Button>
        </Link>
      </div>

      <FileStatistics images={allImages} />

      <ImageManagementClient images={allImages} />
    </div>
  );
  } catch (error) {
    console.error('Error in AdminGalleryManagePage:', error);
    redirect('/api/auth/signin');
  }
}
