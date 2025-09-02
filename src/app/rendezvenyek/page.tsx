import { db } from "~/server/db"
import EventList from "./event_list"

const ITEMS_PER_PAGE = 5

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const allEvents = (await db.query.events.findMany()).reverse()
  
  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE)

  return <EventList initialEvents={allEvents} itemsPerPage={ITEMS_PER_PAGE} totalPages={totalPages} />
}