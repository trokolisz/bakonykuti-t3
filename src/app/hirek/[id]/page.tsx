import { db } from "~/server/db"
import { eq } from "drizzle-orm"
import { news } from "~/server/db/schema"
import { NewsComponent } from "./news_component"



export default async function NewsItemPage({ params }: { params: { id: string } }) {
  console.log(params.id);
  const newsItem = await db.query.news.findFirst({
    where: eq(news.id, Number(params.id))
  })
  console.log(newsItem?.content);
  if (!newsItem) return null

  return <NewsComponent newsItem={newsItem} />
}