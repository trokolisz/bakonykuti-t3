export type EventType = 'community' | 'cultural' | 'sports' | 'education' | 'gun_range'
import { db } from "~/server/db"
import { Event } from "~/server/db/schema"

export const eventTypeColors: Record<EventType, string> = {
  community: 'bg-emerald-500',
  cultural: 'bg-purple-500',
  sports: 'bg-blue-500',
  education: 'bg-amber-500',
  gun_range: 'bg-gray-500',
}

export const eventTypeLabels: Record<EventType, string> = {
  community: 'Community Event',
  cultural: 'Cultural Event',
  sports: 'Sports Event',
  education: 'Educational Event',
  gun_range: 'Lőtér Event',
}



export const getAllEvents = async (): Promise<Event[]> => {
  const events = await db.query.events.findMany()
  return events
}

export const getEventsByDate = async (date: Date): Promise<Event[]> => {
  const events = await db.query.events.findMany()
  return events.filter(event => 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  )
}


