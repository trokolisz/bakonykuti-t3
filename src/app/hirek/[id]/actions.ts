'use server';
import { db } from '~/server/db';
import { news } from '~/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm';

export async function deleteNews(id: number) {

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  await db.delete(news).where(eq(news.id, id))

}
