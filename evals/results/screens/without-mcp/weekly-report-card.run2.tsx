import { useMemo } from "react"
import { Download, TrendingDown, TrendingUp, Trophy, Store } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const STORE_NAME = "Fernhill Market"
const WEEK_LABEL = "Mar 10 – Mar 16, 2025"
const WEEK_FILE_DATE = "2025-03-10"

const DAILY_REVENUE = [
  { day: "Mon", revenue: 1520.4 },
  { day: "Tue", revenue: 1388.9 },
  { day: "Wed", revenue: 1674.25 },
  { day: "Thu", revenue: 1592.1 },
  { day: "Fri", revenue: 2315.6 },
  { day: "Sat", revenue: 2684.8 },
  { day: "Sun", revenue: 1664.45 },
]

const LAST_WEEK_REVENUE = 11265.75

const BEST_SELLER = {
  name: "Fernhill Sourdough Loaf",
  category: "Bakery",
  unitsSold: 214,
  revenue: 1712.0,
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

function escapeCsv(value: string | number): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export default function WeeklyReportCard() {
  const thisWeekRevenue = useMemo(
    () => DAILY_REVENUE.reduce((sum, d) => sum + d.revenue, 0),
    []
  )

  const change = thisWeekRevenue - LAST_WEEK_REVENUE
  const changeRatio = LAST_WEEK_REVENUE === 0 ? 0 : change / LAST_WEEK_REVENUE
  const isUp = change >= 0
  const maxDaily = Math.max(...DAILY_REVENUE.map((d) => d.revenue))

  function downloadCsv() {
    const rows: (string | number)[][] = [
      ["Store", STORE_NAME],
      ["Week", WEEK_LABEL],
      [],
      ["Day", "Revenue (USD)"],
      ...DAILY_REVENUE.map((d) => [d.day, d.revenue.toFixed(2)]),
      [],
      ["Total revenue this week", thisWeekRevenue.toFixed(2)],
      ["Total revenue last week", LAST_WEEK_REVENUE.toFixed(2)],
      ["Change (USD)", change.toFixed(2)],
      ["Change (%)", (changeRatio * 100).toFixed(1)],
      [],
      ["Best seller", BEST_SELLER.name],
      ["Best seller category", BEST_SELLER.category],
      ["Best seller units sold", BEST_SELLER.unitsSold],
      ["Best seller revenue (USD)", BEST_SELLER.revenue.toFixed(2)],
    ]

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `fernhill-weekly-report-${WEEK_FILE_DATE}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

    toast.success("Weekly report downloaded", {
      description: `fernhill-weekly-report-${WEEK_FILE_DATE}.csv`,
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
          <h1 className="text-2xl font-semibold tracking-tight">Weekly report card</h1>
          <p className="text-sm text-muted-foreground">{WEEK_LABEL}</p>
        </div>
        <Button onClick={downloadCsv} className="mt-3 sm:mt-0">
          <Download className="size-4" />
          Download CSV
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs last week</CardTitle>
          <CardDescription>Total sales for this week compared with the previous week.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This week</p>
              <p className="text-4xl font-semibold tabular-nums">{currency.format(thisWeekRevenue)}</p>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <p className="text-sm text-muted-foreground">
                Last week: <span className="tabular-nums">{currency.format(LAST_WEEK_REVENUE)}</span>
              </p>
              <Badge variant={isUp ? "default" : "destructive"} className="gap-1">
                {isUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                <span className="tabular-nums">
                  {percent.format(changeRatio)} ({isUp ? "+" : "-"}
                  {currency.format(Math.abs(change))})
                </span>
              </Badge>
            </div>
          </div>

          <Separator />

          <ul className="flex flex-col gap-3" aria-label="Daily revenue">
            {DAILY_REVENUE.map((d) => {
              const widthPct = maxDaily === 0 ? 0 : (d.revenue / maxDaily) * 100
              return (
                <li key={d.day} className="grid grid-cols-[3rem_1fr_6rem] items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{d.day}</span>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="text-right tabular-nums">{currency.format(d.revenue)}</span>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best-selling product</CardTitle>
          <CardDescription>Top product by units sold this week.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Trophy className="size-5" />
            </div>
            <div>
              <p className="font-medium">{BEST_SELLER.name}</p>
              <p className="text-sm text-muted-foreground">{BEST_SELLER.category}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm sm:text-right">
            <div>
              <p className="text-muted-foreground">Units sold</p>
              <p className="text-lg font-semibold tabular-nums">{BEST_SELLER.unitsSold}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revenue</p>
              <p className="text-lg font-semibold tabular-nums">{currency.format(BEST_SELLER.revenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Store className="size-3.5" />
        Figures reflect completed sales for {WEEK_LABEL}.
      </p>
    </main>
  )
}
