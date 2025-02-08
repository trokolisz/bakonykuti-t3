"use client";

import { useState } from "react";
import { format, isSameDay } from 'date-fns';
import { hu } from 'date-fns/locale';
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import Image from "next/image";
import { cn } from "~/lib/utils";

interface Event {
  id: number;
  title: string;
  thumbnail: string;
  content: string | null;
  date: Date;
  type: string;
  createdBy: string | null;
  createdAt: Date;
}

interface EventCalendarProps {
  events: Event[];
}

const EventCalendar = ({ events }: EventCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const selectedDateEvents = date 
    ? events.filter((event) => isSameDay(new Date(event.date), date))
    : [];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsDialogOpen(!!selectedDate && events.some(event => isSameDay(new Date(event.date), selectedDate)));
  };

  const hasEvent = (dayDate: Date) => {
    return events.some((event) => isSameDay(new Date(event.date), dayDate));
  };

  return (
    <div className="flex justify-center w-full">
      <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      locale={hu}
      modifiers={{ hasEvent: (date) => hasEvent(date) }}
      modifiersStyles={{
        hasEvent: {
        backgroundColor: "#e6f3ff",
        color: "#0066cc",
        transform: "scale(1.05)",
        transition: "all 0.2s",
        borderRadius: "0.375rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }
      }}
      className={cn(
        "w-full max-w-md rounded-md border shadow-sm overflow-hidden",
        "[&_.rdp-day:hover:not(.rdp-day_selected)]:bg-accent",
        "[&_.rdp-day:hover:not(.rdp-day_selected)]:text-accent-foreground",
        "[&_.rdp-day]:transition-all",
        "[&_.rdp-day]:duration-200",
        "[&_.rdp-day]:h-14 [&_.rdp-day]:w-14",
        "[&_.rdp-day_selected]:font-semibold",
        "[&_.rdp-caption_label]:text-xl font-semibold",
        "[&_.rdp-nav_button]:h-9 [&_.rdp-nav_button]:w-9",
      )}
      components={{
        DayContent: ({ date: dayDate }) => {
        const isEventDay = hasEvent(dayDate);
        return (
          <div
          className={cn(
            "h-full w-full relative flex items-center justify-center",
            isEventDay && "cursor-pointer font-medium"
          )}
          >
          {format(dayDate, "d")}
          </div>
        );
        },
      }}
      />

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="max-w-[90vw] md:max-w-[600px]">
        <DialogHeader>
        <DialogTitle>
          {date && format(date, 'yyyy. MMMM d.', { locale: hu })}
        </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
        <div className="space-y-4 p-4">
          {selectedDateEvents.map((event) => (
          <div key={event.id} className="flex gap-4 items-start border rounded-lg p-4">
            <div className="relative w-20 h-20">
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              className="object-cover rounded-md"
            />
            </div>
            <div className="flex-1">
            <h3 className="font-bold">{event.title}</h3>
            {event.content && (
              <p className="text-sm text-muted-foreground">
              {event.content}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Típus: {event.type}
            </p>
            </div>
          </div>
          ))}
          {selectedDateEvents.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nincsenek események ezen a napon.
          </p>
          )}
        </div>
        </ScrollArea>
      </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
