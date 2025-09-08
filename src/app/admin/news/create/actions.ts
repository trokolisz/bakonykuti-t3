'use server';
import { db } from '~/server/db';
import { news } from '~/server/db/schema';
import { auth } from '~/auth';

export async function updateLastModified(title: string, url: string, description: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('User not found');
    }

    const username = session.user.name || session.user.email;
    console.log(username);
    console.log("updateLastModified");

    // MySQL/MariaDB doesn't support .returning()
    await db.insert(news).values({
      title: title,
      thumbnail: url,
      content: description,
      creatorName: username,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error in updateLastModified:', error);
    throw new Error('Failed to create news item');
  }
}
