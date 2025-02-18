"use server";

import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { news } from "~/server/db/schema";

export async function updateLastModified(
  title: string,
  id: number,
  content: string,
) {
  await db
    .update(news)
    .set({
      title: title,  
      content: content,
    })
    .where(eq(news.id, id));
}
