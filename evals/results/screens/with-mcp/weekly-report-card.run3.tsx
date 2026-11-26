import { Download, Package, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type DayRow = {
  day: string
  revenue: number
  lastWeek: number
}

type ProductRow = {
  name: string
  units: number
  revenue: number
}

const STORE_NAME = "Fernhill Market"
const WEEK_LABEL = "Week of 9–15 June 2025"
const WEEK_SLUG = "2025-06-09"

const DAYS: DayRow[] = [
  { day: "Monday", revenue: 1640, lastWeek: 1552 },
  { day: "Tuesday", revenue: 1705, lastWeek: 1610 },
  { day: "Wednesday", revenue: 1588, lastWeek: 1702 },
  { day: "Thursday", revenue: 1772, lastWeek: 1640 },
  { day: "Friday", revenue: 2186, lastWeek: 2040 },
  { day: "Saturday", revenue: 2349, lastWeek: 2211 },
  { day: "Sunday", revenue: 1240, lastWeek: 973 },
]

const PRODUCTS: ProductRow[] = [
  { name: "Sourdough loaf, 800 g", units: 412, revenue: 2060 },
  { name: "Free-range eggs, dozen", units: 366, revenue: 1647 },
  { name: "Oat milk, 1 L", units: 298, revenue: 1043 },
  { name: "Cold brew, 500 ml", units: 251, revenue: 1004 },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function percentChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100
}

function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? "+" : "−"
  return `${sign}${Math.abs(value).toFixed(1)}%`
}

function escapeCsvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function buildCsv(): string {
  const header = ["Day", "Revenue (USD)", "Last week (USD)", "Change (%)"]
  const dayRows = DAYS.map((d) => [
    d.day,
    d.revenue.toFixed(2),
    d.lastWeek.toFixed(2),
    percentChange(d.revenue, d.lastWeek).toFixed(1),
  ])
  const totalRevenue = DAYS.reduce((sum, d) => sum + d.revenue, 0)
  const totalLastWeek = DAYS.reduce((sum, d) => sum + d.lastWeek, 0)
  const totalRow = [
    "Total",
    totalRevenue.toFixed(2),
    totalLastWeek.toFixed(2),
    percentChange(totalRevenue, totalLastWeek).toFixed(1),
  ]
  return [header, ...dayRows, totalRow]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n")
}

export default function WeeklyReportCard() {
  const totalRevenue = DAYS.reduce((sum, d) => sum + d.revenue, 0)
  const totalLastWeek = DAYS.reduce((sum, d) => sum + d.lastWeek, 0)
  const revenueChange = percentChange(totalRevenue, totalLastWeek)
  const revenueIsUp = revenueChange >= 0
  const bestSeller = PRODUCTS.reduce((best, p) => (p.revenue > best.revenue ? p : best))

  function downloadCsv() {
    const blob = new Blob([buildCsv()], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fernhill-market-report-${WEEK_SLUG}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success("CSV report downloaded")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="warning">
                <TriangleAlert />
                Example data
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Weekly report card</h1>
            <p className="text-sm text-muted-foreground">
              {STORE_NAME} · {WEEK_LABEL}
            </p>
          </div>
          <Button size="lg" onClick={downloadCsv}>
            <Download />
            Download report as CSV
          </Button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue this week</CardTitle>
              <CardDescription>Compared with the week of 2–8 June</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-4xl font-semibold tabular-nums">{currency.format(totalRevenue)}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {revenueIsUp ? (
                  <Badge variant="success">
                    <TrendingUp />
                    {formatSignedPercent(revenueChange)} vs last week
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <TrendingDown />
                    {formatSignedPercent(revenueChange)} vs last week
                  </Badge>
                )}
                <span className="text-muted-foreground">
                  Last week: {currency.format(totalLastWeek)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best-selling product</CardTitle>
              <CardDescription>Ranked by revenue this week</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Package className="mt-1 size-5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">{bestSeller.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bestSeller.units.toLocaleString("en-US")} units sold
                  </p>
                </div>
              </div>
              <p className="text-sm">
                <span className="font-medium">{currency.format(bestSeller.revenue)}</span>{" "}
                <span className="text-muted-foreground">in revenue</span>
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Daily revenue</CardTitle>
            <CardDescription>Each day against the same day last week</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Last week</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((d) => (
                  <TableRow key={d.day}>
                    <TableCell>{d.day}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency.format(d.revenue)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency.format(d.lastWeek)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatSignedPercent(percentChange(d.revenue, d.lastWeek))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {currency.format(totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {currency.format(totalLastWeek)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatSignedPercent(revenueChange)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
