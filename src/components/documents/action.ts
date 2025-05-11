'use server';
import { db } from '~/server/db';
import { documents } from '~/server/db/schema';
import { auth } from '~/auth';
import { eq } from 'drizzle-orm';

export async function deleteDocument(id: number) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.delete(documents).where(eq(documents.id, id));
}
