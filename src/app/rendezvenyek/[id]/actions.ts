'use server';
import { db } from '~/server/db';
import { events } from '~/server/db/schema';
import { auth } from '~/auth';
import { eq } from 'drizzle-orm';

export async function deleteEvent(id: number) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.delete(events).where(eq(events.id, id));
}
