'use server';
import { db } from '~/server/db';
import { news } from '~/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'


export async function updateLastModified(title: string, url: string, description: string) {

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  const username = user.username
  console.log(username)  
  console.log("updateLastModified");
  await db.insert(news).values({
    title: title,
    thumbnail: url,
    content: description,
    creatorName: username,
    createdAt: new Date(),
  });
}
