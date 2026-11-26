import { Download, TrendingDown, TrendingUp, Trophy, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STORE_NAME = "Fernhill Market"
const REPORT_PERIOD = "Mar 9 – Mar 15, 2026"
const REPORT_FILE_NAME = "fernhill-market-weekly-report-2026-03-09.csv"

const DAILY_SALES = [
  { day: "Monday", thisWeek: 2480.5, lastWeek: 2315.0 },
  { day: "Tuesday", thisWeek: 2390.25, lastWeek: 2410.75 },
  { day: "Wednesday", thisWeek: 2555.0, lastWeek: 2287.5 },
  { day: "Thursday", thisWeek: 2612.8, lastWeek: 2398.4 },
  { day: "Friday", thisWeek: 3480.6, lastWeek: 3196.2 },
  { day: "Saturday", thisWeek: 3218.4, lastWeek: 2842.9 },
  { day: "Sunday", thisWeek: 1683.0, lastWeek: 1529.25 },
]

const BEST_SELLER = {
  name: "Stone-ground wheat loaf",
  unitsSold: 214,
  revenue: 1284.0,
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const thisWeekTotal = DAILY_SALES.reduce((sum, row) => sum + row.thisWeek, 0)
const lastWeekTotal = DAILY_SALES.reduce((sum, row) => sum + row.lastWeek, 0)
const changePercent = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
const isUp = changePercent >= 0
const changeLabel = `${isUp ? "+" : ""}${changePercent.toFixed(1)}% vs last week`

function buildCsv(): string {
  const header = "Day,This week,Last week,Change (%)"
  const rows = DAILY_SALES.map((row) => {
    const change = ((row.thisWeek - row.lastWeek) / row.lastWeek) * 100
    return [
      row.day,
      row.thisWeek.toFixed(2),
      row.lastWeek.toFixed(2),
      change.toFixed(1),
    ].join(",")
  })
  const total = [
    "Total",
    thisWeekTotal.toFixed(2),
    lastWeekTotal.toFixed(2),
    changePercent.toFixed(1),
  ].join(",")
  const bestSeller = `Best seller,${BEST_SELLER.name},${BEST_SELLER.unitsSold} units,${BEST_SELLER.revenue.toFixed(2)}`
  return [header, ...rows, total, "", bestSeller].join("\n")
}

export default function WeeklyReportCard() {
  function downloadCsv() {
    const blob = new Blob([buildCsv()], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = REPORT_FILE_NAME
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success("Report downloaded")
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 bg-background p-6 text-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Weekly report card</CardTitle>
          <CardDescription>
            {STORE_NAME} · {REPORT_PERIOD}
          </CardDescription>
          <CardAction>
            <Button onClick={downloadCsv}>
              <Download />
              Download CSV
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Badge variant="warning">
            <TriangleAlert />
            Example data
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Total sales this week</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-3xl font-semibold text-foreground">
              {currency.format(thisWeekTotal)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isUp ? "success" : "destructive"}>
                {isUp ? <TrendingUp /> : <TrendingDown />}
                {changeLabel}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Last week: {currency.format(lastWeekTotal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-selling product</CardTitle>
            <CardDescription>Most units sold this week</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <Trophy className="size-5 text-primary" aria-hidden="true" />
              <p className="text-lg font-semibold">{BEST_SELLER.name}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {BEST_SELLER.unitsSold} units · {currency.format(BEST_SELLER.revenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily revenue</CardTitle>
          <CardDescription>This week compared with last week</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead className="text-right">This week</TableHead>
                <TableHead className="text-right">Last week</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DAILY_SALES.map((row) => {
                const change = ((row.thisWeek - row.lastWeek) / row.lastWeek) * 100
                const up = change >= 0
                return (
                  <TableRow key={row.day}>
                    <TableCell>{row.day}</TableCell>
                    <TableCell className="text-right">
                      {currency.format(row.thisWeek)}
                    </TableCell>
                    <TableCell className="text-right">
                      {currency.format(row.lastWeek)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={up ? "success" : "destructive"}>
                        {up ? <TrendingUp /> : <TrendingDown />}
                        {`${up ? "+" : ""}${change.toFixed(1)}%`}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">
                  {currency.format(thisWeekTotal)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {currency.format(lastWeekTotal)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={isUp ? "success" : "destructive"}>
                    {isUp ? <TrendingUp /> : <TrendingDown />}
                    {`${isUp ? "+" : ""}${changePercent.toFixed(1)}%`}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
