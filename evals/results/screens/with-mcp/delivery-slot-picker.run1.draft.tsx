import { useId, useState } from "react"
import { CalendarDays, Clock, Truck, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
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
import { Toaster } from "@/components/ui/sonner"

type TimeWindow = { id: string; label: string }
type DeliveryDay = {
  id: string
  label: string
  remaining: Record<string, number>
}

const WINDOWS: TimeWindow[] = [
  { id: "08-10", label: "8:00 – 10:00" },
  { id: "10-12", label: "10:00 – 12:00" },
  { id: "12-14", label: "12:00 – 14:00" },
  { id: "14-16", label: "14:00 – 16:00" },
  { id: "16-18", label: "16:00 – 18:00" },
  { id: "18-20", label: "18:00 – 20:00" },
]

const DAYS: DeliveryDay[] = [
  {
    id: "mon",
    label: "Monday, 2 June",
    remaining: { "08-10": 3, "10-12": 0, "12-14": 5, "14-16": 2, "16-18": 0, "18-20": 4 },
  },
  {
    id: "tue",
    label: "Tuesday, 3 June",
    remaining: { "08-10": 0, "10-12": 0, "12-14": 1, "14-16": 6, "16-18": 4, "18-20": 0 },
  },
  {
    id: "wed",
    label: "Wednesday, 4 June",
    remaining: { "08-10": 4, "10-12": 2, "12-14": 0, "14-16": 5, "16-18": 3, "18-20": 2 },
  },
  {
    id: "thu",
    label: "Thursday, 5 June",
    remaining: { "08-10": 0, "10-12": 0, "12-14": 0, "14-16": 0, "16-18": 0, "18-20": 0 },
  },
  {
    id: "fri",
    label: "Friday, 6 June",
    remaining: { "08-10": 6, "10-12": 6, "12-14": 3, "14-16": 0, "16-18": 1, "18-20": 5 },
  },
  {
    id: "sat",
    label: "Saturday, 7 June",
    remaining: { "08-10": 2, "10-12": 4, "12-14": 4, "14-16": 4, "16-18": 0, "18-20": 0 },
  },
  {
    id: "sun",
    label: "Sunday, 8 June",
    remaining: { "08-10": 5, "10-12": 5, "12-14": 5, "14-16": 3, "16-18": 2, "18-20": 0 },
  },
]

export default function DeliverySlotPicker() {
  const dayFieldId = useId()
  const windowGroupId = useId()

  const [dayId, setDayId] = useState<string>(DAYS[0].id)
  const [windowId, setWindowId] = useState<string | null>(null)

  const day = DAYS.find((d) => d.id === dayId) ?? DAYS[0]
  const selectedWindow = WINDOWS.find((w) => w.id === windowId) ?? null
  const openWindows = WINDOWS.filter((w) => (day.remaining[w.id] ?? 0) > 0).length

  function handleDayChange(value: string | null) {
    if (!value) return
    setDayId(value)
    setWindowId(null)
  }

  function handleConfirm() {
    if (!selectedWindow) return
    toast.success(`Delivery set for ${day.label}, ${selectedWindow.label}`)
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5" aria-hidden="true" />
            Choose a delivery slot
          </CardTitle>
          <CardDescription>
            Pick a day and a two-hour window. Full windows can't be booked.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor={dayFieldId} className="text-sm font-medium">
              Delivery day
            </label>
            <Select value={dayId} onValueChange={handleDayChange}>
              <SelectTrigger id={dayFieldId} className="w-full">
                <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span id={windowGroupId} className="flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
              Two-hour window
            </span>

            {openWindows === 0 ? (
              <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>No windows left on this day</AlertTitle>
                <AlertDescription>Choose another day to see open windows.</AlertDescription>
              </Alert>
            ) : null}

            <div
              role="group"
              aria-labelledby={windowGroupId}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {WINDOWS.map((w) => {
                const left = day.remaining[w.id] ?? 0
                const full = left === 0
                const selected = w.id === windowId
                return (
                  <Button
                    key={w.id}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    size="lg"
                    disabled={full}
                    aria-pressed={selected}
                    onClick={() => setWindowId(w.id)}
                    className="h-auto flex-col items-start gap-0.5 py-2"
                  >
                    <span className="font-medium">{w.label}</span>
                    <span className="text-xs font-normal">
                      {full ? "Full" : left <= 2 ? `Only ${left} left` : `${left} left`}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {selectedWindow ? (
              <>
                Delivery on <span className="font-medium text-foreground">{day.label}</span>,{" "}
                {selectedWindow.label}
              </>
            ) : (
              "Pick an open window to continue."
            )}
          </p>
          <Button onClick={handleConfirm} disabled={!selectedWindow}>
            Reserve this slot
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </main>
  )
}
