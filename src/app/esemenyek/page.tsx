import { db } from "~/server/db"
import EventList from "./event_list"

const ITEMS_PER_PAGE = 5

export default async function NewsPage() {
  const allEvents = (await db.query.events.findMany()).reverse()
  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE)

  return <EventList initialEvents={allEvents} itemsPerPage={ITEMS_PER_PAGE} totalPages={totalPages} />
}