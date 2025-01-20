export type EventType = 'community' | 'cultural' | 'sports' | 'education' | 'gun_range'

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
  gun_range: 'bg-gray-500',
}

export const eventTypeLabels: Record<EventType, string> = {
  community: 'Community Event',
  cultural: 'Cultural Event',
  sports: 'Sports Event',
  education: 'Educational Event',
  gun_range: 'Lőtér Event',
}

// In-memory storage for events
let events: Event[] = [
  {
    id: "1",
    title: "Village Summer Fair",
    description: "Annual summer fair with local produce, crafts, and entertainment",
    date: new Date("2024-12-15"),
    type: "community",
    createdBy: "Admin User",
    createdAt: new Date()
  },
  {
    id: "2",
    title: "Local History Talk",
    description: "Learn about our village's fascinating medieval history",
    date: new Date("2024-12-20"),
    type: "cultural",
    createdBy: "Admin User",
    createdAt: new Date()
  }
]

export const getAllEvents = (): Event[] => {
  return [...events].sort((a, b) => a.date.getTime() - b.date.getTime())
}

export const getEventsByDate = (date: Date): Event[] => {
  return events.filter(event => 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  )
}

export const createEvent = (event: Omit<Event, 'id' | 'createdAt'>): Event => {
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date()
  }
  events.push(newEvent)
  return newEvent
}

export const deleteEvent = (id: string): boolean => {
  const initialLength = events.length
  events = events.filter(event => event.id !== id)
  return events.length !== initialLength
}