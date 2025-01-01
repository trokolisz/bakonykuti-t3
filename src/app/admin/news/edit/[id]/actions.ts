"use server";

import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { news } from "~/server/db/schema";

export async function updateLastModified(
  id: number,
  title: string,
  thumbnail: string,
  content: string,
) {
  await db
    .update(news)
    .set({
      title: title,
      thumbnail: thumbnail,     
      content: content,
    })
    .where(eq(news.id, id));
}
