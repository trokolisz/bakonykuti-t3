"use client"

import { useState } from "react"
import { Calendar } from "~/components/ui/calendar"
import { Card, CardContent } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import { Event, getEventsByDate, eventTypeColors, eventTypeLabels } from "~/lib/events"

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)

  const modifiers = {
    event: (date: Date) => getEventsByDate(date).length > 0,
  }

  const modifiersStyles = {
    event: {
      fontWeight: "bold",
    },
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        components={{
          DayContent: ({ date }) => (
            <div onClick={() => setDialogOpen(true)}>
              <DayWithEvents date={date} />
            </div>
          ),
        }}
        className="rounded-md border"
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Események {date?.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {date && getEventsByDate(date).map((event) => (
            <Card key={event.id}>
              <CardContent className="p-3">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {event.description}
                </div>
                <div className="mt-1">
                  <span className={cn(
                    "inline-block px-2 py-0.5 text-xs rounded-full text-white",
                    eventTypeColors[event.type]
                  )}>
                    {eventTypeLabels[event.type]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DayWithEvents({ date }: { date: Date }) {
  const events = getEventsByDate(date)
  const hasEvents = events.length > 0

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div>{date.getDate()}</div>
      {hasEvents && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {events.map((event) => (
            <div
              key={event.id}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                eventTypeColors[event.type]
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}