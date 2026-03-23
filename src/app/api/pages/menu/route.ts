import { NextResponse } from "next/server";

import { db } from "~/server/db";

type MenuItem = {
  title: string;
  href: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const pages = await db.query.pages.findMany();

  const grouped: Record<string, MenuItem[]> = {};

  for (const page of pages) {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, "");
    const parts = normalizedSlug.split("/").filter(Boolean);

    // Menu groups are the first path segment, subsection pages are group/child.
    if (parts.length < 2) {
      continue;
    }

    const group = parts[0];
    const href = `/${normalizedSlug}`;

    if (!grouped[group]) {
      grouped[group] = [];
    }

    grouped[group].push({ title: page.title, href });
  }

  for (const group of Object.keys(grouped)) {
    grouped[group]!.sort((a, b) => a.title.localeCompare(b.title, "hu"));
  }

  return NextResponse.json(grouped);
}
