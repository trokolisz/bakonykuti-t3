'use server';
import { db } from '~/server/db';
import { events, news } from '~/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm';

export async function deleteEvent(id: number) {

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  await db.delete(events).where(eq(events.id, id))

}
