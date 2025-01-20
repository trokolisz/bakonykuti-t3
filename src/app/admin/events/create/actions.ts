'use server';
import { db } from '~/server/db';
import { events } from '~/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'


export async function updateLastModified(title: string, url: string, description: string, _type: string, _date: string) {

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  const username = user.username
  console.log(username)  
  console.log("updateLastModified");
  await db.insert(events).values({
    title,
    thumbnail: url,
    content: description,
    date: new Date(_date),
    type: _type,
    createdBy: user.username,
    createdAt: new Date(),
  });
}

