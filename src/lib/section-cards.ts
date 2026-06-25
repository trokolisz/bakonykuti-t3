import { type Card as CardType } from "~/types";

export type SectionPage = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
};

type BuildSectionCardsOptions = {
  pages: SectionPage[];
  sectionSlug: string;
  fallbackCardImages?: Record<string, string>;
  sortBy?: "id" | "title";
};

const DEFAULT_CARD_IMAGE = "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&auto=format&fit=crop&q=80";

export function buildSectionCards({
  pages,
  sectionSlug,
  fallbackCardImages = {},
  sortBy = "id",
}: BuildSectionCardsOptions): CardType[] {
  const normalizedSectionSlug = sectionSlug.replace(/^\/+|\/+$/g, "");

  const filtered = pages.filter((page) =>
    page.slug.startsWith(`${normalizedSectionSlug}/`),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title, "hu");
    }

    return a.id - b.id;
  });

  return sorted.map((page, index) => ({
    id: page.id ?? index + 1,
    title: page.title,
    href: `/${page.slug}`,
    image:
      page.thumbnail ??
      fallbackCardImages[page.slug] ??
      DEFAULT_CARD_IMAGE,
  }));
}
