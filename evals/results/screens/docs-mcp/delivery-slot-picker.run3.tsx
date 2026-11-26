import { useState } from "react"
import { CalendarDays, Check, Clock, Ban, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const DAYS = [
  { id: "2025-06-02", label: "Monday 2 June" },
  { id: "2025-06-03", label: "Tuesday 3 June" },
  { id: "2025-06-04", label: "Wednesday 4 June" },
  { id: "2025-06-05", label: "Thursday 5 June" },
  { id: "2025-06-06", label: "Friday 6 June" },
  { id: "2025-06-07", label: "Saturday 7 June" },
  { id: "2025-06-08", label: "Sunday 8 June" },
]

const WINDOWS = [
  { id: "08-10", label: "8:00 to 10:00" },
  { id: "10-12", label: "10:00 to 12:00" },
  { id: "12-14", label: "12:00 to 14:00" },
  { id: "14-16", label: "14:00 to 16:00" },
  { id: "16-18", label: "16:00 to 18:00" },
  { id: "18-20", label: "18:00 to 20:00" },
]

// Remaining delivery slots per day, in the same order as WINDOWS. 0 means full.
const AVAILABILITY: Record<string, number[]> = {
  "2025-06-02": [4, 0, 2, 3, 0, 1],
  "2025-06-03": [3, 3, 0, 0, 2, 4],
  "2025-06-04": [0, 0, 0, 1, 0, 0],
  "2025-06-05": [2, 4, 1, 0, 3, 2],
  "2025-06-06": [5, 2, 0, 0, 4, 3],
  "2025-06-07": [0, 1, 3, 2, 0, 0],
  "2025-06-08": [4, 4, 2, 0, 1, 5],
}

export default function DeliverySlotPicker() {
  const [dayId, setDayId] = useState<string>("")
  const [windowIndex, setWindowIndex] = useState<number | null>(null)

  const selectedDay = DAYS.find((day) => day.id === dayId) ?? null
  const remaining = dayId ? AVAILABILITY[dayId] : null
  const allWindowsFull = remaining !== null && remaining.every((count) => count === 0)
  const selectedWindow = windowIndex !== null ? WINDOWS[windowIndex] : null

  function handleDayChange(value: string) {
    setDayId(value)
    setWindowIndex(null)
  }

  function handleConfirm() {
    if (!selectedDay || !selectedWindow) return
    toast.success(`Delivery set for ${selectedDay.label}, ${selectedWindow.label}`)
  }

  return (
    <div className="mx-auto w-full max-w-xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Choose a delivery slot</CardTitle>
          <CardDescription>
            Pick a day, then a two-hour window. Full windows cannot be selected.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="delivery-day" className="text-sm font-medium text-foreground">
              Delivery day
            </label>
            <Select value={dayId} onValueChange={handleDayChange}>
              <SelectTrigger id="delivery-day" className="w-full">
                <CalendarDays aria-hidden="true" className="text-muted-foreground" />
                <SelectValue placeholder="Choose a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day.id} value={day.id}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium text-foreground">
              Two-hour window
            </legend>

            {!selectedDay && (
              <p className="text-sm text-muted-foreground">
                Choose a day to see its windows.
              </p>
            )}

            {selectedDay && allWindowsFull && (
              <Alert variant="warning" className="mb-2">
                <TriangleAlert />
                <AlertTitle>No windows left on {selectedDay.label}</AlertTitle>
                <AlertDescription>
                  Every window is full. Choose another day.
                </AlertDescription>
              </Alert>
            )}

            {selectedDay && remaining && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {WINDOWS.map((window, index) => {
                  const count = remaining[index]
                  const isFull = count === 0
                  const isSelected = windowIndex === index

                  return (
                    <Button
                      key={window.id}
                      type="button"
                      variant="outline"
                      aria-pressed={isSelected}
                      disabled={isFull}
                      onClick={() => setWindowIndex(index)}
                      className={`flex h-auto min-h-14 flex-col items-start gap-1 px-3 py-2 text-left ${
                        isSelected ? "border-primary bg-info-subtle text-primary ring-1 ring-primary" : ""
                      }`}
                    >
                      <span className="flex w-full items-center justify-between gap-2 text-sm font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock aria-hidden="true" className="size-4" />
                          {window.label}
                        </span>
                        {isSelected && <Check aria-hidden="true" className="size-4" />}
                      </span>
                      {isFull ? (
                        <Badge variant="secondary">
                          <Ban aria-hidden="true" />
                          Full
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {count} {count === 1 ? "slot" : "slots"} left
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </fieldset>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-2">
          {!selectedWindow && (
            <p className="text-sm text-muted-foreground">
              Choose a day and an open window to continue.
            </p>
          )}
          {selectedWindow && selectedDay && (
            <p className="text-sm text-foreground">
              Selected: {selectedDay.label}, {selectedWindow.label}
            </p>
          )}
          <Button
            type="button"
            size="lg"
            disabled={!selectedWindow}
            onClick={handleConfirm}
            className="w-full"
          >
            Save delivery slot
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
