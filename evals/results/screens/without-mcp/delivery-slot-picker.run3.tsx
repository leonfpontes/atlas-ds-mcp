import { useMemo, useState } from "react"
import { CalendarDays, CheckCircle2, Clock, Truck } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

const DELIVERY_FEE = 4.5

const WINDOWS = [
  { id: "08-10", label: "8:00 – 10:00" },
  { id: "10-12", label: "10:00 – 12:00" },
  { id: "12-14", label: "12:00 – 14:00" },
  { id: "14-16", label: "14:00 – 16:00" },
  { id: "16-18", label: "16:00 – 18:00" },
  { id: "18-20", label: "18:00 – 20:00" },
] as const

// Remaining deliveries per window, indexed by day offset from today (0 = today).
const REMAINING_SLOTS: Record<string, number>[] = [
  { "08-10": 0, "10-12": 2, "12-14": 0, "14-16": 4, "16-18": 1, "18-20": 3 },
  { "08-10": 3, "10-12": 0, "12-14": 5, "14-16": 0, "16-18": 2, "18-20": 0 },
  { "08-10": 6, "10-12": 4, "12-14": 0, "14-16": 2, "16-18": 0, "18-20": 5 },
  { "08-10": 1, "10-12": 0, "12-14": 3, "14-16": 0, "16-18": 4, "18-20": 2 },
  { "08-10": 4, "10-12": 5, "12-14": 2, "14-16": 0, "16-18": 0, "18-20": 6 },
  { "08-10": 0, "10-12": 0, "12-14": 0, "14-16": 0, "16-18": 0, "18-20": 0 },
  { "08-10": 5, "10-12": 3, "12-14": 4, "14-16": 1, "16-18": 0, "18-20": 2 },
]

const DAY_COUNT = REMAINING_SLOTS.length
const LOW_STOCK_THRESHOLD = 2

type WindowId = (typeof WINDOWS)[number]["id"]

export default function DeliverySlotPicker() {
  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: DAY_COUNT }, (_, offset) => {
      const date = new Date(today)
      date.setDate(today.getDate() + offset)
      return {
        offset,
        weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date),
        dayOfMonth: new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(date),
        month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date),
        full: new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(date),
        isToday: offset === 0,
      }
    })
  }, [])

  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedWindow, setSelectedWindow] = useState<WindowId | null>(null)

  const remainingFor = (dayOffset: number, windowId: WindowId) =>
    REMAINING_SLOTS[dayOffset]?.[windowId] ?? 0

  const handleSelectDay = (offset: number) => {
    setSelectedDay(offset)
    if (selectedWindow !== null && remainingFor(offset, selectedWindow) === 0) {
      setSelectedWindow(null)
    }
  }

  const handleConfirm = () => {
    if (selectedDay === null || selectedWindow === null) return
    const day = days[selectedDay]
    const window = WINDOWS.find((w) => w.id === selectedWindow)
    toast.success("Delivery slot reserved", {
      description: `${day.full}, ${window?.label}`,
    })
  }

  const chosenDay = selectedDay !== null ? days[selectedDay] : null
  const chosenWindow = WINDOWS.find((w) => w.id === selectedWindow)
  const canConfirm = selectedDay !== null && selectedWindow !== null

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="size-4" aria-hidden="true" />
            <span className="text-sm font-medium">Fernhill Market delivery</span>
          </div>
          <CardTitle className="text-2xl">Choose a delivery slot</CardTitle>
          <CardDescription>
            Pick a day, then a two-hour window. Fully booked slots are unavailable.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <section aria-labelledby="day-heading" className="flex flex-col gap-3">
            <h2 id="day-heading" className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="size-4" aria-hidden="true" />
              Day
            </h2>
            <div role="group" aria-labelledby="day-heading" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((day) => {
                const isSelected = selectedDay === day.offset
                return (
                  <button
                    key={day.offset}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={day.full}
                    onClick={() => handleSelectDay(day.offset)}
                    className={[
                      "flex flex-col items-center justify-center rounded-md border px-2 py-3 text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    ].join(" ")}
                  >
                    <span className="text-xs opacity-80">
                      {day.isToday ? "Today" : day.weekday}
                    </span>
                    <span className="text-lg font-semibold leading-tight">{day.dayOfMonth}</span>
                    <span className="text-xs opacity-80">{day.month}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <Separator />

          <section aria-labelledby="window-heading" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 id="window-heading" className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="size-4" aria-hidden="true" />
                Time window
              </h2>
              {chosenDay && (
                <span className="text-xs text-muted-foreground">{chosenDay.full}</span>
              )}
            </div>

            {selectedDay === null ? (
              <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Select a day to see available windows.
              </p>
            ) : (
              <div role="group" aria-labelledby="window-heading" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {WINDOWS.map((window) => {
                  const remaining = remainingFor(selectedDay, window.id)
                  const isFull = remaining === 0
                  const isSelected = selectedWindow === window.id
                  const isLow = !isFull && remaining <= LOW_STOCK_THRESHOLD
                  return (
                    <button
                      key={window.id}
                      type="button"
                      disabled={isFull}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedWindow(window.id)}
                      className={[
                        "flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isFull
                          ? "cursor-not-allowed border-dashed bg-muted text-muted-foreground opacity-60"
                          : isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                      ].join(" ")}
                    >
                      <span className="font-medium">{window.label}</span>
                      {isFull ? (
                        <Badge variant="secondary">Full</Badge>
                      ) : isLow ? (
                        <Badge variant="outline">Only {remaining} left</Badge>
                      ) : isSelected ? (
                        <CheckCircle2 className="size-4 text-primary" aria-label="Selected" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Available</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {chosenDay && chosenWindow ? (
              <p>
                <span className="font-medium">{chosenDay.full}</span>
                <span className="text-muted-foreground">, {chosenWindow.label}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">No slot selected yet</p>
            )}
            <p className="text-xs text-muted-foreground">
              Delivery fee: ${DELIVERY_FEE.toFixed(2)}
            </p>
          </div>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Confirm slot
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
