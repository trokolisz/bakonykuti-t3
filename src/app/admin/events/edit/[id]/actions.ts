"use server";

import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { events } from "~/server/db/schema";

export async function updateLastModified(
  id: number,
  title: string,
  thumbnail: string,
  content: string,
  type: string,
) {
  await db
    .update(events)
    .set({
      title: title,
      thumbnail: thumbnail,   
      type: type,  
      content: content,
    })
    .where(eq(events.id, id));
}
