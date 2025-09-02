import { db } from "~/server/db"
import NewsList from "./news_list"

const ITEMS_PER_PAGE = 5

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const allNews = (await db.query.news.findMany()).reverse()
  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE)

  return <NewsList initialNews={allNews} itemsPerPage={ITEMS_PER_PAGE} totalPages={totalPages} />
}