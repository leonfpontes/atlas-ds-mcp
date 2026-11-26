import { Download, TrendingDown, TrendingUp, Trophy } from "lucide-react"
import { toast } from "sonner"

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
import { Toaster } from "@/components/ui/sonner"

const STORE_NAME = "Fernhill Market"
const WEEK_LABEL = "9–15 June 2025"
const CSV_FILE_NAME = "fernhill-market-weekly-report-2025-06-09.csv"

const DAILY_REVENUE = [
  { day: "Monday", thisWeek: 2410.25, lastWeek: 2286.0 },
  { day: "Tuesday", thisWeek: 2518.0, lastWeek: 2355.5 },
  { day: "Wednesday", thisWeek: 2644.75, lastWeek: 2412.25 },
  { day: "Thursday", thisWeek: 2580.5, lastWeek: 2398.75 },
  { day: "Friday", thisWeek: 3012.0, lastWeek: 2749.5 },
  { day: "Saturday", thisWeek: 3460.25, lastWeek: 3106.0 },
  { day: "Sunday", thisWeek: 1794.75, lastWeek: 1597.0 },
]

const BEST_SELLER = {
  name: "Fernhill Sourdough Loaf",
  unitsSold: 412,
  revenue: 2060.0,
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "always",
})

export default function WeeklyReportCard() {
  const thisWeekTotal = DAILY_REVENUE.reduce((sum, d) => sum + d.thisWeek, 0)
  const lastWeekTotal = DAILY_REVENUE.reduce((sum, d) => sum + d.lastWeek, 0)
  const change = lastWeekTotal === 0 ? 0 : (thisWeekTotal - lastWeekTotal) / lastWeekTotal
  const isUp = change >= 0
  const bestSellerShare = thisWeekTotal === 0 ? 0 : BEST_SELLER.revenue / thisWeekTotal

  function downloadCsv() {
    const rows = [
      ["Day", "This week (USD)", "Last week (USD)"],
      ...DAILY_REVENUE.map((d) => [d.day, d.thisWeek.toFixed(2), d.lastWeek.toFixed(2)]),
      ["Total", thisWeekTotal.toFixed(2), lastWeekTotal.toFixed(2)],
    ]
    const csv = rows.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = CSV_FILE_NAME
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success("Report downloaded")
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <Toaster />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Weekly report card</h1>
            <Badge variant="warning">Example data</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {STORE_NAME} · {WEEK_LABEL}
          </p>
        </div>
        <Button onClick={downloadCsv}>
          <Download />
          Download report as CSV
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This week against last week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold tabular-nums text-foreground">
              {currency.format(thisWeekTotal)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isUp ? "success" : "destructive"}>
                {isUp ? <TrendingUp /> : <TrendingDown />}
                {signedPercent.format(change)} vs last week
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Last week: <span className="tabular-nums">{currency.format(lastWeekTotal)}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-selling product</CardTitle>
            <CardDescription>By revenue this week</CardDescription>
            <CardAction>
              <Badge variant="info">
                <Trophy />
                Top seller
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold text-foreground">{BEST_SELLER.name}</p>
            <p className="text-sm text-muted-foreground tabular-nums">
              {BEST_SELLER.unitsSold} units · {currency.format(BEST_SELLER.revenue)} ·{" "}
              {percent.format(bestSellerShare)} of revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily revenue</CardTitle>
          <CardDescription>Each day this week against the same day last week</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead className="text-right">This week</TableHead>
                <TableHead className="text-right">Last week</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DAILY_REVENUE.map((d) => (
                <TableRow key={d.day}>
                  <TableCell>{d.day}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {currency.format(d.thisWeek)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {currency.format(d.lastWeek)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {currency.format(thisWeekTotal)}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {currency.format(lastWeekTotal)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
