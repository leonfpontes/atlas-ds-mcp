import { useState } from "react"
import { CalendarDays, Check, Clock, Truck } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Day = {
  id: string
  weekday: string
  date: string
}

type TimeWindow = {
  id: string
  start: string
  end: string
}

const DAYS: Day[] = [
  { id: "2025-06-12", weekday: "Thu", date: "12 Jun" },
  { id: "2025-06-13", weekday: "Fri", date: "13 Jun" },
  { id: "2025-06-14", weekday: "Sat", date: "14 Jun" },
  { id: "2025-06-15", weekday: "Sun", date: "15 Jun" },
  { id: "2025-06-16", weekday: "Mon", date: "16 Jun" },
]

const TIME_WINDOWS: TimeWindow[] = [
  { id: "08-10", start: "08:00", end: "10:00" },
  { id: "10-12", start: "10:00", end: "12:00" },
  { id: "12-14", start: "12:00", end: "14:00" },
  { id: "14-16", start: "14:00", end: "16:00" },
  { id: "16-18", start: "16:00", end: "18:00" },
  { id: "18-20", start: "18:00", end: "20:00" },
]

// Remaining delivery capacity per day and window. A value of 0 means the slot is full.
const REMAINING_CAPACITY: Record<string, Record<string, number>> = {
  "2025-06-12": {
    "08-10": 0,
    "10-12": 4,
    "12-14": 2,
    "14-16": 0,
    "16-18": 6,
    "18-20": 1,
  },
  "2025-06-13": {
    "08-10": 3,
    "10-12": 0,
    "12-14": 0,
    "14-16": 5,
    "16-18": 0,
    "18-20": 2,
  },
  "2025-06-14": {
    "08-10": 8,
    "10-12": 8,
    "12-14": 0,
    "14-16": 4,
    "16-18": 3,
    "18-20": 0,
  },
  "2025-06-15": {
    "08-10": 0,
    "10-12": 0,
    "12-14": 0,
    "14-16": 0,
    "16-18": 0,
    "18-20": 0,
  },
  "2025-06-16": {
    "08-10": 5,
    "10-12": 2,
    "12-14": 6,
    "14-16": 0,
    "16-18": 4,
    "18-20": 7,
  },
}

const LOW_STOCK_THRESHOLD = 3

function getRemaining(dayId: string, windowId: string): number {
  return REMAINING_CAPACITY[dayId]?.[windowId] ?? 0
}

function getOpenSlotCount(dayId: string): number {
  return TIME_WINDOWS.filter((w) => getRemaining(dayId, w.id) > 0).length
}

function formatWindow(w: TimeWindow): string {
  return `${w.start}–${w.end}`
}

export default function DeliverySlotPicker() {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null)

  const selectedDay = DAYS.find((d) => d.id === selectedDayId) ?? null
  const selectedWindow = TIME_WINDOWS.find((w) => w.id === selectedWindowId) ?? null

  const canConfirm =
    selectedDay !== null &&
    selectedWindow !== null &&
    getRemaining(selectedDay.id, selectedWindow.id) > 0

  function handleDaySelect(dayId: string) {
    setSelectedDayId(dayId)
    setSelectedWindowId(null)
  }

  function handleConfirm() {
    if (!selectedDay || !selectedWindow || !canConfirm) return
    toast.success("Delivery slot saved", {
      description: `${selectedDay.weekday} ${selectedDay.date}, ${formatWindow(selectedWindow)}`,
    })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="size-5" aria-hidden="true" />
          Choose a delivery slot
        </CardTitle>
        <CardDescription>
          Pick a day, then a two-hour window. Full windows can't be selected.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <section aria-labelledby="delivery-day-heading" className="flex flex-col gap-3">
          <h3 id="delivery-day-heading" className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            Day
          </h3>

          <div role="radiogroup" aria-labelledby="delivery-day-heading" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {DAYS.map((day) => {
              const openCount = getOpenSlotCount(day.id)
              const isFullDay = openCount === 0
              const isSelected = day.id === selectedDayId

              return (
                <button
                  key={day.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isFullDay}
                  onClick={() => handleDaySelect(day.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-md border px-2 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">{day.weekday}</span>
                  <span className="text-sm font-semibold">{day.date}</span>
                  <span className="text-xs text-muted-foreground">
                    {isFullDay ? "Fully booked" : `${openCount} open`}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="delivery-window-heading" className="flex flex-col gap-3">
          <h3 id="delivery-window-heading" className="flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
            Time window
          </h3>

          {selectedDay === null ? (
            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              Choose a day to see available time windows.
            </p>
          ) : (
            <div role="radiogroup" aria-labelledby="delivery-window-heading" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TIME_WINDOWS.map((w) => {
                const remaining = getRemaining(selectedDay.id, w.id)
                const isFull = remaining === 0
                const isLow = !isFull && remaining <= LOW_STOCK_THRESHOLD
                const isSelected = w.id === selectedWindowId

                return (
                  <button
                    key={w.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={isFull}
                    disabled={isFull}
                    onClick={() => setSelectedWindowId(w.id)}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-input hover:bg-accent"
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className={`text-sm font-semibold ${isFull ? "line-through" : ""}`}>
                        {formatWindow(w)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isFull ? "No longer available" : isLow ? `Only ${remaining} left` : "Available"}
                      </span>
                    </span>

                    {isFull ? (
                      <Badge variant="secondary">Full</Badge>
                    ) : isSelected ? (
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </CardContent>

      <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedDay && selectedWindow
            ? `Selected: ${selectedDay.weekday} ${selectedDay.date}, ${formatWindow(selectedWindow)}`
            : "No delivery slot selected"}
        </p>
        <Button onClick={handleConfirm} disabled={!canConfirm} className="w-full sm:w-auto">
          Confirm slot
        </Button>
      </CardFooter>
    </Card>
  )
}
