'use server';
import { db } from '~/server/db';
import { documents } from '~/server/db/schema';
import { currentUser } from '@clerk/nextjs/server';

export async function updateDocument(title: string, category: string, date: string, fileUrl: string, fileSize: string) {
  const user = await currentUser();
  if (!user) throw new Error('User not found');

  await db.insert(documents).values({
    id: crypto.randomUUID(),
    title,
    category,
    date: new Date(date),
    fileUrl,
    fileSize,
  });
}

