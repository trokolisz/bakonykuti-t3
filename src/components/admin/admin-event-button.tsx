'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function AdminEventButton() {
  const { data: session } = useSession();
  
  if (session?.user?.role !== 'admin') {
    return null;
  }
  
  return (
    <Link href="/admin/events">
      <Button variant="outline" size="sm">Kezelés</Button>
    </Link>
  );
}
