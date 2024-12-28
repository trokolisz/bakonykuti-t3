import { db } from "~/server/db"
import { eq } from "drizzle-orm"
import { news } from "~/server/db/schema"
import { NewsComponent } from "./news_component"
import "~/styles/markdown.css"

interface Props {
  params: Promise<{ id: string[] }>
}

export default async function NewsItemPage({ params }: Props) {
  const {id} = await params
  const newsItem = await db.query.news.findFirst({
    where: eq(news.id, Number(id))
  })
  
  if (!newsItem) return null

  return <NewsComponent newsItem={newsItem} />
}