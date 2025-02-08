'use server';
import { db } from '~/server/db';
import { documents } from '~/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm';

export async function deleteDocument(id: number) {

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  await db.delete(documents).where(eq(documents.id, id))

}
