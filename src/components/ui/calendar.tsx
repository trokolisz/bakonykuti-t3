"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

export type CalendarProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  modifiers?: Record<string, (date: Date) => boolean>
  modifiersStyles?: Record<string, React.CSSProperties>
  components?: {
    DayContent?: React.ComponentType<{ date: Date }>
  }
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  modifiers = {},
  modifiersStyles = {},
  components = {},
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (date: Date) => {
    onSelect?.(date)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const renderDay = (date: Date) => {
    const isSelected = selected?.toDateString() === date.toDateString()
    const modifierClasses = Object.entries(modifiers).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: fn(date),
      }),
      {}
    )

    const dayStyle = Object.entries(modifierClasses).reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...(value ? modifiersStyles[key] : {}),
      }),
      {}
    )

    const DayContent = components.DayContent

    return (
      <Button
        key={date.toISOString()}
        variant="ghost"
        className={cn(
          "h-9 w-9",
          isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          "hover:bg-accent hover:text-accent-foreground"
        )}
        style={dayStyle}
        onClick={() => handleDateClick(date)}
      >
        {DayContent ? (
          <DayContent date={date} />
        ) : (
          date.getDate()
        )}
      </Button>
    )
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            i + 1
          )
          return renderDay(date)
        })}
      </div>
    </div>
  )
}