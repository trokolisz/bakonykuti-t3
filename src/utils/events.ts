import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import { events } from "~/server/db/schema"

export type EventType = 'community' | 'cultural' | 'sports' | 'education' | 'lőtér'

export type Event = {
  id: string
  title: string
  description: string
  date: Date
  type: EventType
  createdBy: string
  createdAt: Date
}

export const eventTypeColors: Record<EventType, string> = {
  community: 'bg-emerald-500',
  cultural: 'bg-purple-500',
  sports: 'bg-blue-500',
  education: 'bg-amber-500',
  lőtér: 'bg-gray-500',
}

export const eventTypeLabels: Record<EventType, string> = {
  community: 'Community Event',
  cultural: 'Cultural Event',
  sports: 'Sports Event',
  education: 'Educational Event',
  lőtér: 'Lőtér Event',
}

// In-memory storage for events
export const getAllEvents = async (): Promise<Event[]> => {
    const dbEvents = await db.query.events.findMany();
    return [...dbEvents].map(event => ({
        ...event,
        description: event.description ?? '',
        type: event.type as EventType ?? 'community',
        createdBy: event.createdBy ?? ''
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export const getEventsByDate = async (date: Date): Promise<Event[]> => {
    const dbEvents = await db.query.events.findMany({
        where: eq(events.date, date)
    });

    return dbEvents.map(event => ({
        ...event,
        description: event.description ?? '',
        type: event.type as EventType ?? 'community',
        createdBy: event.createdBy ?? ''
    }))
}

export const createEvent = async (event: Omit<Event, 'id' | 'createdAt'>): Promise<Event> => {
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date()
  }
  await db.insert(events).values(newEvent)
  return newEvent
}

export const deleteEvent = async (id: string): Promise<boolean> => {
  await db.delete(events).where(eq(events.id, id))
  return true
}