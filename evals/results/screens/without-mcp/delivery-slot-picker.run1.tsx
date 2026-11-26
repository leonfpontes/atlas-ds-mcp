import { useMemo, useState } from "react"
import { CalendarDays, Check, Clock, Truck } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const DAYS_AHEAD = 7

const SLOT_WINDOWS = [
  { label: "8:00 – 10:00 AM" },
  { label: "10:00 AM – 12:00 PM" },
  { label: "12:00 – 2:00 PM" },
  { label: "2:00 – 4:00 PM" },
  { label: "4:00 – 6:00 PM" },
  { label: "6:00 – 8:00 PM" },
] as const

// Remaining delivery spots. Rows = day offset from today, columns = SLOT_WINDOWS index.
const REMAINING_SPOTS: number[][] = [
  [4, 0, 6, 2, 0, 5],
  [3, 5, 0, 1, 4, 0],
  [2, 2, 3, 0, 6, 1],
  [0, 4, 1, 5, 2, 0],
  [6, 0, 2, 3, 0, 4],
  [1, 3, 0, 2, 5, 3],
  [5, 1, 4, 0, 3, 2],
]

const LOW_STOCK_THRESHOLD = 2

export default function DeliverySlotPicker() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedWindow, setSelectedWindow] = useState<number | null>(null)

  const days = useMemo(
    () =>
      Array.from({ length: DAYS_AHEAD }, (_, offset) => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() + offset)
        return {
          offset,
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          full: date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
        }
      }),
    []
  )

  const selectedDayInfo = selectedDay !== null ? days[selectedDay] : null
  const selectedWindowInfo =
    selectedWindow !== null ? SLOT_WINDOWS[selectedWindow] : null

  function handleSelectDay(index: number) {
    setSelectedDay(index)
    setSelectedWindow(null)
  }

  function handleConfirm() {
    if (!selectedDayInfo || !selectedWindowInfo) return
    toast.success("Delivery slot saved", {
      description: `${selectedDayInfo.full}, ${selectedWindowInfo.label}`,
    })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium">Fernhill Market Delivery</span>
        </div>
        <CardTitle className="text-xl">Choose a delivery slot</CardTitle>
        <CardDescription>
          Pick a day, then a two-hour window. Full windows can't be selected.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <section aria-labelledby="day-heading" className="space-y-3">
          <h3 id="day-heading" className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4" aria-hidden="true" />
            Day
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {days.map((day, index) => {
              const isSelected = selectedDay === index
              return (
                <Button
                  key={day.offset}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  aria-pressed={isSelected}
                  onClick={() => handleSelectDay(index)}
                  className="h-auto justify-center py-3"
                >
                  {day.label}
                </Button>
              )
            })}
          </div>
        </section>

        <Separator />

        <section aria-labelledby="window-heading" className="space-y-3">
          <h3 id="window-heading" className="flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4" aria-hidden="true" />
            Time window
          </h3>

          {selectedDay === null ? (
            <p className="text-sm text-muted-foreground">
              Select a day to see available windows.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {SLOT_WINDOWS.map((slot, index) => {
                const remaining = REMAINING_SPOTS[selectedDay][index]
                const isFull = remaining === 0
                const isSelected = selectedWindow === index
                return (
                  <Button
                    key={slot.label}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    aria-pressed={isSelected}
                    disabled={isFull}
                    onClick={() => setSelectedWindow(index)}
                    className="h-auto justify-between py-3"
                  >
                    <span>{slot.label}</span>
                    {isFull ? (
                      <Badge variant="secondary">Full</Badge>
                    ) : remaining <= LOW_STOCK_THRESHOLD ? (
                      <Badge variant="outline">
                        {remaining} left
                      </Badge>
                    ) : isSelected ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : null}
                  </Button>
                )
              })}
            </div>
          )}
        </section>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {selectedDayInfo && selectedWindowInfo
            ? `${selectedDayInfo.full}, ${selectedWindowInfo.label}`
            : "No slot selected yet"}
        </p>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedDayInfo || !selectedWindowInfo}
        >
          Confirm delivery slot
        </Button>
      </CardFooter>
    </Card>
  )
}
