'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

export function AdminGalleryButton() {
  const { data: session } = useSession();
  
  if (session?.user?.role !== 'admin') {
    return null;
  }
  
  return (
    <Link href="/admin/gallery/upload">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Upload Image
      </Button>
    </Link>
  );
}
