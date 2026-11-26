import { useMemo } from "react"
import { Download, Minus, TrendingDown, TrendingUp, Trophy } from "lucide-react"
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

const STORE = {
  name: "Fernhill Market",
  weekLabel: "Mar 9 – Mar 15, 2025",
  weekSlug: "2025-03-09_to_2025-03-15",
}

const REVENUE = {
  thisWeek: 18420.5,
  lastWeek: 16975.25,
}

const ORDERS = {
  thisWeek: 412,
  lastWeek: 389,
}

const BEST_SELLER = {
  name: "Stone-Milled Sourdough Loaf",
  category: "Bakery",
  unitsThisWeek: 286,
  unitsLastWeek: 241,
  revenue: 2288.0,
  shareOfRevenue: 12.4,
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const integer = new Intl.NumberFormat("en-US")

type Trend = "up" | "down" | "flat"

function getTrend(current: number, previous: number): {
  direction: Trend
  percent: number
} {
  if (previous === 0) {
    return { direction: current > 0 ? "up" : "flat", percent: 0 }
  }
  const percent = ((current - previous) / previous) * 100
  const direction: Trend =
    Math.abs(percent) < 0.05 ? "flat" : percent > 0 ? "up" : "down"
  return { direction, percent }
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

function escapeCsv(value: string | number) {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function TrendBadge({ direction, percent }: { direction: Trend; percent: number }) {
  const config = {
    up: {
      Icon: TrendingUp,
      className: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    down: {
      Icon: TrendingDown,
      className: "text-red-700 bg-red-50 border-red-200",
    },
    flat: {
      Icon: Minus,
      className: "text-muted-foreground bg-muted border-border",
    },
  }[direction]

  const { Icon, className } = config

  return (
    <Badge variant="outline" className={`gap-1 tabular-nums ${className}`}>
      <Icon className="size-3.5" aria-hidden="true" />
      {formatPercent(percent)} vs last week
    </Badge>
  )
}

export default function WeeklyReportCard() {
  const revenueTrend = useMemo(
    () => getTrend(REVENUE.thisWeek, REVENUE.lastWeek),
    []
  )
  const ordersTrend = useMemo(
    () => getTrend(ORDERS.thisWeek, ORDERS.lastWeek),
    []
  )
  const bestSellerTrend = useMemo(
    () => getTrend(BEST_SELLER.unitsThisWeek, BEST_SELLER.unitsLastWeek),
    []
  )

  const revenueChange = REVENUE.thisWeek - REVENUE.lastWeek
  const maxRevenue = Math.max(REVENUE.thisWeek, REVENUE.lastWeek)
  const thisWeekWidth = (REVENUE.thisWeek / maxRevenue) * 100
  const lastWeekWidth = (REVENUE.lastWeek / maxRevenue) * 100

  function downloadCsv() {
    try {
      const rows: (string | number)[][] = [
        ["Store", STORE.name],
        ["Week", STORE.weekLabel],
        [],
        ["Metric", "This week", "Last week", "Change (%)"],
        [
          "Revenue (USD)",
          REVENUE.thisWeek.toFixed(2),
          REVENUE.lastWeek.toFixed(2),
          revenueTrend.percent.toFixed(1),
        ],
        [
          "Orders",
          ORDERS.thisWeek,
          ORDERS.lastWeek,
          ordersTrend.percent.toFixed(1),
        ],
        [],
        ["Best seller", BEST_SELLER.name],
        ["Category", BEST_SELLER.category],
        [
          "Units sold",
          BEST_SELLER.unitsThisWeek,
          BEST_SELLER.unitsLastWeek,
          bestSellerTrend.percent.toFixed(1),
        ],
        ["Revenue from best seller (USD)", BEST_SELLER.revenue.toFixed(2)],
        ["Share of revenue (%)", BEST_SELLER.shareOfRevenue.toFixed(1)],
      ]

      const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `fernhill-market-report-${STORE.weekSlug}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      toast.success("Weekly report downloaded")
    } catch {
      toast.error("Could not download the report. Please try again.")
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Weekly report card</CardTitle>
        <CardDescription>
          {STORE.name} · {STORE.weekLabel}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <section aria-labelledby="revenue-heading" className="grid gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3
              id="revenue-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Revenue
            </h3>
            <TrendBadge
              direction={revenueTrend.direction}
              percent={revenueTrend.percent}
            />
          </div>

          <p className="text-3xl font-semibold tabular-nums">
            {currency.format(REVENUE.thisWeek)}
          </p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {revenueChange >= 0 ? "+" : "−"}
            {currency.format(Math.abs(revenueChange))} compared with last week (
            {currency.format(REVENUE.lastWeek)})
          </p>

          <div className="grid gap-2" aria-hidden="true">
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">This week</span>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${thisWeekWidth}%` }}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">Last week</span>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-muted-foreground/40"
                  style={{ width: `${lastWeekWidth}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground tabular-nums">
            Orders: {integer.format(ORDERS.thisWeek)} (
            {integer.format(ORDERS.lastWeek)} last week)
          </p>
        </section>

        <Separator />

        <section aria-labelledby="best-seller-heading" className="grid gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-amber-600" aria-hidden="true" />
            <h3
              id="best-seller-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              Best seller
            </h3>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <p className="text-lg font-semibold">{BEST_SELLER.name}</p>
              <Badge variant="secondary" className="w-fit">
                {BEST_SELLER.category}
              </Badge>
            </div>
            <TrendBadge
              direction={bestSellerTrend.direction}
              percent={bestSellerTrend.percent}
            />
          </div>

          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Units sold</dt>
              <dd className="font-medium tabular-nums">
                {integer.format(BEST_SELLER.unitsThisWeek)}
              </dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Revenue</dt>
              <dd className="font-medium tabular-nums">
                {currency.format(BEST_SELLER.revenue)}
              </dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Share of sales</dt>
              <dd className="font-medium tabular-nums">
                {BEST_SELLER.shareOfRevenue.toFixed(1)}%
              </dd>
            </div>
          </dl>
        </section>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Figures are for the week shown and compare with the previous seven days.
        </p>
        <Button onClick={downloadCsv}>
          <Download className="size-4" aria-hidden="true" />
          Download CSV
        </Button>
      </CardFooter>
    </Card>
  )
}
