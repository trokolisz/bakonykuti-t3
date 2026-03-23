"use server";

import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { pages } from "~/server/db/schema";

function normalizeSlug(input: string): string {
  return input.trim().replace(/^\/+|\/+$/g, "");
}

export async function createPageAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = normalizeSlug(String(formData.get("slug") ?? ""));
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !slug || !content) {
    redirect("/admin/pages/new?error=missing");
  }

  try {
    await db.insert(pages).values({
      title,
      slug,
      thumbnail,
      content,
      lastModified: new Date(),
    });
  } catch {
    redirect("/admin/pages/new?error=duplicate");
  }

  redirect(`/admin/pages/edit/${slug}`);
}
