'use server';

import { db } from '~/server/db';
import { eq } from 'drizzle-orm';
import { pages } from '~/server/db/schema';

export async function updateLastModified(title: string, slug: string, content: string) {

  console.log("updateLastModified");
  await db.update(pages)
    .set({
      title: title,
      lastModified: new Date(),
      content: content,
    })
    .where(eq(pages.slug, slug));
}
