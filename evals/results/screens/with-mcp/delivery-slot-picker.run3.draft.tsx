import { useState } from "react"
import { CalendarDays, Check, Clock, TriangleAlert } from "lucide-react"
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

const DAYS = [
  { id: "tue", weekday: "Tue", date: "13 May" },
  { id: "wed", weekday: "Wed", date: "14 May" },
  { id: "thu", weekday: "Thu", date: "15 May" },
  { id: "fri", weekday: "Fri", date: "16 May" },
  { id: "sat", weekday: "Sat", date: "17 May" },
]

const WINDOWS = [
  "08:00–10:00",
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
]

// Windows that are full, per day id. Anything not listed is open.
const FULL_SLOTS: Record<string, string[]> = {
  tue: ["10:00–12:00", "18:00–20:00"],
  wed: ["08:00–10:00", "14:00–16:00", "16:00–18:00"],
  thu: ["16:00–18:00"],
  fri: ["12:00–14:00", "14:00–16:00"],
  sat: [
    "08:00–10:00",
    "10:00–12:00",
    "12:00–14:00",
    "14:00–16:00",
    "16:00–18:00",
    "18:00–20:00",
  ],
}

const CHIP_BASE =
  "flex min-h-11 w-full flex-col items-start justify-center gap-0.5 rounded-md border px-3 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground"
const CHIP_IDLE = "border-border bg-card text-foreground hover:bg-accent"
const CHIP_ACTIVE = "border-primary bg-info-subtle text-primary"

export default function DeliverySlotPicker() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null)

  const day = DAYS.find((d) => d.id === selectedDay) ?? null
  const fullWindows = selectedDay ? (FULL_SLOTS[selectedDay] ?? []) : []
  const allFull = day !== null && fullWindows.length === WINDOWS.length

  function pickDay(id: string) {
    if (id === selectedDay) return
    setSelectedDay(id)
    setSelectedWindow(null)
  }

  function confirmSlot() {
    if (!day || !selectedWindow) return
    toast.success(`Delivery set for ${day.weekday} ${day.date}, ${selectedWindow}`)
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Delivery slot</CardTitle>
          <CardDescription>
            Choose a day and a two-hour window. Full windows can&apos;t be selected.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              Day
            </legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {DAYS.map((d) => {
                const active = d.id === selectedDay
                return (
                  <button
                    key={d.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickDay(d.id)}
                    className={`${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_IDLE}`}
                  >
                    <span className="font-medium">{d.weekday}</span>
                    <span className={active ? "text-xs" : "text-xs text-muted-foreground"}>
                      {d.date}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
              Two-hour window
            </legend>

            {day === null ? (
              <p className="text-sm text-muted-foreground">Choose a day to see its windows.</p>
            ) : allFull ? (
              <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>No windows left on {day.weekday} {day.date}</AlertTitle>
                <AlertDescription>Pick another day to see open windows.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {WINDOWS.map((w) => {
                  const full = fullWindows.includes(w)
                  const active = w === selectedWindow
                  return (
                    <button
                      key={w}
                      type="button"
                      disabled={full}
                      aria-pressed={active}
                      onClick={() => setSelectedWindow(w)}
                      className={`${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_IDLE}`}
                    >
                      <span className="font-medium tabular-nums">{w}</span>
                      <span className={full ? "text-xs" : "text-xs text-muted-foreground"}>
                        {full ? "Full" : "Available"}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </fieldset>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p id="slot-summary" className="flex items-center gap-2 text-sm text-muted-foreground">
            {day && selectedWindow ? (
              <>
                <Check className="size-4 text-success" aria-hidden="true" />
                <span className="text-foreground">
                  {day.weekday} {day.date}, {selectedWindow}
                </span>
              </>
            ) : (
              "Pick a day and a window to continue."
            )}
          </p>
          <Button
            onClick={confirmSlot}
            disabled={!day || !selectedWindow}
            aria-describedby="slot-summary"
            className="w-full sm:w-auto"
          >
            Confirm delivery slot
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  )
}
