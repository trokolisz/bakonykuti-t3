'use server';
import { db } from '~/server/db';
import { documents } from '~/server/db/schema';
import { auth } from '~/auth';

export async function updateDocument(title: string, category: string, date: string, fileUrl: string, fileSize: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('User not found');
  }

  await db.insert(documents).values({
    title,
    category,
    date: new Date(date),
    fileUrl,
    fileSize,
  });
}

