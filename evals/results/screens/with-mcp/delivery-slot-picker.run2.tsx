import { useState } from "react"
import { CalendarDays, Clock, CircleCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

type Day = { id: string; weekday: string; date: string }
type TimeWindow = { start: string; end: string }

const DAYS: Day[] = [
  { id: "mon-12", weekday: "Mon", date: "12 May" },
  { id: "tue-13", weekday: "Tue", date: "13 May" },
  { id: "wed-14", weekday: "Wed", date: "14 May" },
  { id: "thu-15", weekday: "Thu", date: "15 May" },
  { id: "fri-16", weekday: "Fri", date: "16 May" },
]

const TIME_WINDOWS: TimeWindow[] = [
  { start: "08:00", end: "10:00" },
  { start: "10:00", end: "12:00" },
  { start: "12:00", end: "14:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
  { start: "18:00", end: "20:00" },
]

// Start times of windows that are already full, per day.
const FULL_SLOTS: Record<string, string[]> = {
  "mon-12": ["10:00", "16:00"],
  "tue-13": ["08:00", "12:00", "18:00"],
  "wed-14": [],
  "thu-15": ["14:00"],
  "fri-16": ["10:00", "12:00", "14:00", "16:00", "18:00"],
}

const selectedClass = "border-primary bg-info-subtle text-primary"

export default function DeliverySlotPicker() {
  const [dayId, setDayId] = useState<string>(DAYS[0].id)
  const [startTime, setStartTime] = useState<string | null>(null)

  const day = DAYS.find((d) => d.id === dayId) ?? DAYS[0]
  const fullStarts = FULL_SLOTS[dayId] ?? []
  const selectedWindow = TIME_WINDOWS.find((w) => w.start === startTime) ?? null

  function selectDay(id: string) {
    setDayId(id)
    setStartTime(null)
  }

  function confirmSlot() {
    if (!selectedWindow) return
    toast.success("Delivery slot saved", {
      description: `${day.weekday} ${day.date}, ${selectedWindow.start}–${selectedWindow.end}`,
    })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Delivery time</CardTitle>
        <CardDescription>
          Choose a day and a two-hour window. Full windows can't be picked.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            Day
          </h3>
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Delivery day">
            {DAYS.map((d) => {
              const isSelected = d.id === dayId
              return (
                <Button
                  key={d.id}
                  type="button"
                  variant="outline"
                  aria-pressed={isSelected}
                  onClick={() => selectDay(d.id)}
                  className={`h-auto flex-col gap-0 py-2 ${isSelected ? selectedClass : ""}`}
                >
                  <span className="text-xs text-muted-foreground">{d.weekday}</span>
                  <span className="text-sm font-medium">{d.date}</span>
                </Button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="size-4" aria-hidden="true" />
            Two-hour window
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Delivery window">
            {TIME_WINDOWS.map((w) => {
              const isFull = fullStarts.includes(w.start)
              const isSelected = w.start === startTime
              const label = `${w.start}–${w.end}`

              if (isFull) {
                return (
                  <Button
                    key={w.start}
                    type="button"
                    variant="outline"
                    disabled
                    aria-label={`${label}, full`}
                    className="h-auto justify-between gap-2 py-2"
                  >
                    <span className="text-sm text-muted-foreground line-through">{label}</span>
                    <Badge variant="secondary">Full</Badge>
                  </Button>
                )
              }

              return (
                <Button
                  key={w.start}
                  type="button"
                  variant="outline"
                  aria-pressed={isSelected}
                  onClick={() => setStartTime(w.start)}
                  className={`h-auto justify-between gap-2 py-2 ${isSelected ? selectedClass : ""}`}
                >
                  <span className="text-sm font-medium">{label}</span>
                  {isSelected && <CircleCheck className="size-4 text-primary" aria-hidden="true" />}
                </Button>
              )
            })}
          </div>
        </section>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {selectedWindow
            ? `${day.weekday} ${day.date}, ${selectedWindow.start}–${selectedWindow.end}`
            : "Choose a two-hour window to continue."}
        </p>
        <Button type="button" onClick={confirmSlot} disabled={!selectedWindow}>
          Confirm delivery slot
        </Button>
      </CardFooter>
    </Card>
  )
}
