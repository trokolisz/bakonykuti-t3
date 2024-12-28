'use server';

import { db } from '~/server/db';
import { eq } from 'drizzle-orm';
import { pages } from '~/server/db/schema';

export async function updateLastModified(formData: FormData) {
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;

  console.log("updateLastModified");
  await db.update(pages)
    .set({
      lastModified: new Date(),
      content: content,
    })
    .where(eq(pages.slug, slug));
}
