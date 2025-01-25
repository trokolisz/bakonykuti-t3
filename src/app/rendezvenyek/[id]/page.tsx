import { db } from "~/server/db"
import { eq } from "drizzle-orm"
import { news } from "~/server/db/schema"
import { EventComponent } from "./event_component"
import "~/styles/markdown.css"
import { deleteEvent } from './actions';

interface Props {
  params: Promise<{ id: string[] }>
}

export default async function NewsItemPage({ params }: Props) {
  const {id} = await params
  const eventItem = await db.query.events.findFirst({
    where: eq(news.id, Number(id))
  })
  
  if (!eventItem) return null

  return <EventComponent eventItem={eventItem} deleteEvent={deleteEvent} />
}