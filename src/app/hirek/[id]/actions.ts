'use server';
import { db } from '~/server/db';
import { news } from '~/server/db/schema';
import { auth } from '~/auth';
import { eq } from 'drizzle-orm';

export async function deleteNews(id: number) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.delete(news).where(eq(news.id, id));
}
