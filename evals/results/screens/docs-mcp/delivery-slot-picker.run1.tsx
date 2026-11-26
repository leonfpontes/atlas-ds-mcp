import { useState } from "react"
import { Ban, CalendarDays, Clock, Info, Truck } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"

// Two-hour windows: each entry starts a window and the next entry ends it.
const WINDOW_EDGES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]

interface DeliveryDay {
  id: string
  weekday: string
  date: string
  // Start times of windows that are fully booked for this day.
  fullStarts: string[]
}

const DELIVERY_DAYS: DeliveryDay[] = [
  { id: "mon", weekday: "Mon", date: "12 May", fullStarts: ["08:00", "16:00"] },
  { id: "tue", weekday: "Tue", date: "13 May", fullStarts: ["10:00", "12:00", "18:00"] },
  { id: "wed", weekday: "Wed", date: "14 May", fullStarts: [] },
  { id: "thu", weekday: "Thu", date: "15 May", fullStarts: ["14:00"] },
  { id: "fri", weekday: "Fri", date: "16 May", fullStarts: ["08:00", "10:00", "14:00", "16:00"] },
  { id: "sat", weekday: "Sat", date: "17 May", fullStarts: ["12:00", "14:00", "16:00", "18:00"] },
]

interface DeliverySlot {
  start: string
  end: string
  full: boolean
}

function buildSlots(day: DeliveryDay): DeliverySlot[] {
  return WINDOW_EDGES.slice(0, -1).map((start, index) => ({
    start,
    end: WINDOW_EDGES[index + 1],
    full: day.fullStarts.includes(start),
  }))
}

export default function DeliverySlotPicker() {
  const [dayId, setDayId] = useState<string | null>(null)
  const [slotStart, setSlotStart] = useState<string | null>(null)

  const selectedDay = DELIVERY_DAYS.find((day) => day.id === dayId) ?? null
  const slots = selectedDay ? buildSlots(selectedDay) : []
  const selectedSlot = slots.find((slot) => slot.start === slotStart) ?? null

  function handleSelectDay(id: string) {
    setDayId(id)
    // Slots belong to a day, so a previous time choice no longer applies.
    setSlotStart(null)
  }

  function handleConfirm() {
    if (!selectedDay || !selectedSlot) return
    toast.success(
      `Delivery set for ${selectedDay.weekday} ${selectedDay.date}, ${selectedSlot.start}–${selectedSlot.end}`
    )
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-4 text-foreground sm:p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5 text-muted-foreground" aria-hidden="true" />
            Choose a delivery slot
          </CardTitle>
          <CardDescription>
            Fernhill Market delivers in two-hour windows. Pick a day, then a time.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertTitle>Orders close 2 hours before the window starts</AlertTitle>
            <AlertDescription>
              Changes after that time need a call to the store.
            </AlertDescription>
          </Alert>

          <section className="flex flex-col gap-3" aria-labelledby="delivery-day-label">
            <h3
              id="delivery-day-label"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              Day
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {DELIVERY_DAYS.map((day) => {
                const isSelected = day.id === dayId
                return (
                  <Button
                    key={day.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    aria-pressed={isSelected}
                    onClick={() => handleSelectDay(day.id)}
                    className="flex h-auto flex-col gap-0.5 py-2"
                  >
                    <span className="text-xs font-normal opacity-80">{day.weekday}</span>
                    <span className="text-sm font-medium">{day.date}</span>
                  </Button>
                )
              })}
            </div>
          </section>

          <section className="flex flex-col gap-3" aria-labelledby="delivery-time-label">
            <h3
              id="delivery-time-label"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
              Time window
            </h3>

            {!selectedDay ? (
              <p className="text-sm text-muted-foreground">Pick a day to see its windows.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((slot) => {
                  const isSelected = slot.start === slotStart
                  const label = `${slot.start} to ${slot.end}`
                  return (
                    <Button
                      key={slot.start}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      disabled={slot.full}
                      aria-pressed={slot.full ? undefined : isSelected}
                      aria-label={slot.full ? `${label}, full` : label}
                      onClick={() => setSlotStart(slot.start)}
                      className="flex h-auto flex-col gap-0.5 py-2"
                    >
                      <span className="text-sm font-medium">
                        {slot.start}–{slot.end}
                      </span>
                      {slot.full ? (
                        <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                          <Ban className="size-3" aria-hidden="true" />
                          Full
                        </span>
                      ) : (
                        <span className="text-xs font-normal opacity-80">Available</span>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </section>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {selectedDay && selectedSlot
              ? `${selectedDay.weekday} ${selectedDay.date}, ${selectedSlot.start}–${selectedSlot.end}`
              : "No delivery window selected yet"}
          </p>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSlot}
          >
            Use this delivery slot
          </Button>
        </CardFooter>
      </Card>

      <Toaster />
    </div>
  )
}
