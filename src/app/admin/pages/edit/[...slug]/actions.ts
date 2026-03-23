"use server";

import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { pages } from "~/server/db/schema";

export async function updateLastModified(
  title: string,
  currentSlug: string,
  newSlug: string,
  thumbnail: string,
  content: string,
) {
  await db
    .update(pages)
    .set({
      title: title,
      slug: newSlug,
      thumbnail: thumbnail,
      lastModified: new Date(),
      content: content,
    })
    .where(eq(pages.slug, currentSlug));
}
