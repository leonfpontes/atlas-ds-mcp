import { useState } from "react"
import { Clock, Truck, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/sonner"

type Slot = {
  id: string
  start: string
  end: string
  available: boolean
}

type DeliveryDay = {
  id: string
  weekday: string
  date: string
  slots: Slot[]
}

const DELIVERY_DAYS: DeliveryDay[] = [
  {
    id: "mon-12",
    weekday: "Monday",
    date: "12 May",
    slots: [
      { id: "mon-12-0800", start: "08:00", end: "10:00", available: true },
      { id: "mon-12-1000", start: "10:00", end: "12:00", available: false },
      { id: "mon-12-1200", start: "12:00", end: "14:00", available: true },
      { id: "mon-12-1400", start: "14:00", end: "16:00", available: true },
      { id: "mon-12-1600", start: "16:00", end: "18:00", available: false },
      { id: "mon-12-1800", start: "18:00", end: "20:00", available: true },
    ],
  },
  {
    id: "tue-13",
    weekday: "Tuesday",
    date: "13 May",
    slots: [
      { id: "tue-13-0800", start: "08:00", end: "10:00", available: false },
      { id: "tue-13-1000", start: "10:00", end: "12:00", available: true },
      { id: "tue-13-1200", start: "12:00", end: "14:00", available: false },
      { id: "tue-13-1400", start: "14:00", end: "16:00", available: true },
      { id: "tue-13-1600", start: "16:00", end: "18:00", available: true },
      { id: "tue-13-1800", start: "18:00", end: "20:00", available: false },
    ],
  },
  {
    id: "wed-14",
    weekday: "Wednesday",
    date: "14 May",
    slots: [
      { id: "wed-14-0800", start: "08:00", end: "10:00", available: false },
      { id: "wed-14-1000", start: "10:00", end: "12:00", available: false },
      { id: "wed-14-1200", start: "12:00", end: "14:00", available: false },
      { id: "wed-14-1400", start: "14:00", end: "16:00", available: false },
      { id: "wed-14-1600", start: "16:00", end: "18:00", available: false },
      { id: "wed-14-1800", start: "18:00", end: "20:00", available: false },
    ],
  },
  {
    id: "thu-15",
    weekday: "Thursday",
    date: "15 May",
    slots: [
      { id: "thu-15-0800", start: "08:00", end: "10:00", available: true },
      { id: "thu-15-1000", start: "10:00", end: "12:00", available: true },
      { id: "thu-15-1200", start: "12:00", end: "14:00", available: true },
      { id: "thu-15-1400", start: "14:00", end: "16:00", available: false },
      { id: "thu-15-1600", start: "16:00", end: "18:00", available: true },
      { id: "thu-15-1800", start: "18:00", end: "20:00", available: true },
    ],
  },
  {
    id: "fri-16",
    weekday: "Friday",
    date: "16 May",
    slots: [
      { id: "fri-16-0800", start: "08:00", end: "10:00", available: true },
      { id: "fri-16-1000", start: "10:00", end: "12:00", available: false },
      { id: "fri-16-1200", start: "12:00", end: "14:00", available: true },
      { id: "fri-16-1400", start: "14:00", end: "16:00", available: true },
      { id: "fri-16-1600", start: "16:00", end: "18:00", available: true },
      { id: "fri-16-1800", start: "18:00", end: "20:00", available: true },
    ],
  },
]

export default function DeliverySlotPicker() {
  const [dayId, setDayId] = useState<string>(DELIVERY_DAYS[0].id)
  const [slotId, setSlotId] = useState<string | null>(null)

  const selectedDay =
    DELIVERY_DAYS.find((day) => day.id === dayId) ?? DELIVERY_DAYS[0]
  const selectedSlot =
    selectedDay.slots.find((slot) => slot.id === slotId) ?? null
  const availableCount = selectedDay.slots.filter((s) => s.available).length

  function chooseDay(id: string) {
    setDayId(id)
    setSlotId(null)
  }

  function confirmSlot() {
    if (!selectedSlot) return
    toast.success(
      `Delivery set for ${selectedDay.weekday} ${selectedDay.date}, ${selectedSlot.start}–${selectedSlot.end}`
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4" aria-hidden="true" />
              <span className="text-sm">Fernhill Market</span>
            </div>
            <CardTitle>Choose a delivery slot</CardTitle>
            <CardDescription>
              Pick a day, then a two-hour window. Full windows can't be booked.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-medium">Day</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {DELIVERY_DAYS.map((day) => {
                  const isSelected = day.id === selectedDay.id
                  return (
                    <Button
                      key={day.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      aria-pressed={isSelected}
                      onClick={() => chooseDay(day.id)}
                      className="h-auto flex-col items-start gap-0 py-2"
                    >
                      <span className="text-sm font-medium">{day.weekday}</span>
                      <span
                        className={
                          isSelected
                            ? "text-xs text-primary-foreground"
                            : "text-xs text-muted-foreground"
                        }
                      >
                        {day.date}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4" aria-hidden="true" />
                Two-hour window on {selectedDay.weekday} {selectedDay.date}
              </legend>

              {availableCount === 0 ? (
                <Alert variant="warning">
                  <TriangleAlert />
                  <AlertTitle>No windows left on this day</AlertTitle>
                  <AlertDescription>
                    Every window is full. Choose another day to continue.
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-muted-foreground" role="status">
                  {availableCount} of {selectedDay.slots.length} windows open
                </p>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {selectedDay.slots.map((slot) => {
                  const isSelected = slot.id === selectedSlot?.id
                  const label = `${slot.start} to ${slot.end}${
                    slot.available ? "" : ", full"
                  }`
                  return (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      disabled={!slot.available}
                      aria-pressed={slot.available ? isSelected : undefined}
                      aria-label={label}
                      onClick={() => setSlotId(slot.id)}
                      className="h-auto justify-between py-3"
                    >
                      <span className="text-sm font-medium">
                        {slot.start}–{slot.end}
                      </span>
                      {slot.available ? (
                        isSelected ? (
                          <span className="text-xs text-primary-foreground">
                            Selected
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Open
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Full
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </fieldset>
          </CardContent>

          <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedSlot
                ? `Delivery: ${selectedDay.weekday} ${selectedDay.date}, ${selectedSlot.start}–${selectedSlot.end}`
                : "Choose a window to continue."}
            </p>
            <Button
              type="button"
              size="lg"
              disabled={!selectedSlot}
              onClick={confirmSlot}
            >
              Use this delivery slot
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
