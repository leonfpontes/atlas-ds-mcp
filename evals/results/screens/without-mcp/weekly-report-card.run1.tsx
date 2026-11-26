import { useState } from "react"
import { Download, Loader2, TrendingDown, TrendingUp, Trophy } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const STORE_NAME = "Fernhill Market"
const REPORT_TITLE = "Weekly report card"
const WEEK_LABEL = "Week of 9 June 2025"
const REPORT_FILE_NAME = "fernhill-market-weekly-report-2025-06-09.csv"

const REVENUE_THIS_WEEK = 18420.5
const REVENUE_LAST_WEEK = 16975.25

const BEST_SELLER = {
  name: "Heirloom tomatoes (1 kg)",
  category: "Produce",
  unitsSold: 412,
  revenue: 2884,
}

const DAILY_REVENUE: { day: string; revenue: number }[] = [
  { day: "Mon", revenue: 2410.2 },
  { day: "Tue", revenue: 2295.8 },
  { day: "Wed", revenue: 2538.1 },
  { day: "Thu", revenue: 2602.45 },
  { day: "Fri", revenue: 3188.75 },
  { day: "Sat", revenue: 3612.9 },
  { day: "Sun", revenue: 1772.3 },
]

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function escapeCsvField(value: string | number): string {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function buildReportCsv(): string {
  const change = (REVENUE_THIS_WEEK - REVENUE_LAST_WEEK) / REVENUE_LAST_WEEK
  const bestSellerShare = BEST_SELLER.revenue / REVENUE_THIS_WEEK

  const rows: (string | number)[][] = [
    ["Section", "Metric", "Value"],
    ["Report", "Store", STORE_NAME],
    ["Report", "Period", WEEK_LABEL],
    ["Revenue", "This week", REVENUE_THIS_WEEK.toFixed(2)],
    ["Revenue", "Last week", REVENUE_LAST_WEEK.toFixed(2)],
    ["Revenue", "Change vs last week (%)", (change * 100).toFixed(1)],
    ["Best seller", "Product", BEST_SELLER.name],
    ["Best seller", "Category", BEST_SELLER.category],
    ["Best seller", "Units sold", BEST_SELLER.unitsSold],
    ["Best seller", "Revenue", BEST_SELLER.revenue.toFixed(2)],
    ["Best seller", "Share of weekly revenue (%)", (bestSellerShare * 100).toFixed(1)],
    [],
    ["Daily", "Day", "Revenue"],
    ...DAILY_REVENUE.map((entry) => [
      "Daily",
      entry.day,
      entry.revenue.toFixed(2),
    ]),
  ]

  return rows
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n")
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function WeeklyReportCard() {
  const [isDownloading, setIsDownloading] = useState(false)

  const revenueChange =
    (REVENUE_THIS_WEEK - REVENUE_LAST_WEEK) / REVENUE_LAST_WEEK
  const isUp = revenueChange >= 0
  const TrendIcon = isUp ? TrendingUp : TrendingDown
  const bestSellerShare = BEST_SELLER.revenue / REVENUE_THIS_WEEK
  const maxDailyRevenue = Math.max(...DAILY_REVENUE.map((d) => d.revenue))

  const handleDownload = () => {
    setIsDownloading(true)
    try {
      downloadCsv(REPORT_FILE_NAME, buildReportCsv())
      toast.success("Report downloaded", {
        description: REPORT_FILE_NAME,
      })
    } catch {
      toast.error("Could not download the report", {
        description: "Please try again.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            {STORE_NAME}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {REPORT_TITLE}
          </h1>
          <p className="text-sm text-muted-foreground">{WEEK_LABEL}</p>
        </div>
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Download aria-hidden="true" />
          )}
          Download CSV
        </Button>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {formatCurrency(REVENUE_THIS_WEEK)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={isUp ? "default" : "destructive"}>
                <TrendIcon aria-hidden="true" />
                {percentFormatter.format(revenueChange)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                vs last week ({formatCurrency(REVENUE_LAST_WEEK)})
              </span>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Daily revenue</p>
              <ul className="flex flex-col gap-2">
                {DAILY_REVENUE.map((entry) => {
                  const width = (entry.revenue / maxDailyRevenue) * 100
                  return (
                    <li
                      key={entry.day}
                      className="grid grid-cols-[2.5rem_1fr_6rem] items-center gap-3 text-sm"
                    >
                      <span className="text-muted-foreground">{entry.day}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <span className="text-right tabular-nums">
                        {formatCurrency(entry.revenue)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Best-selling product</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="size-5 text-primary" aria-hidden="true" />
              {BEST_SELLER.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit">
              {BEST_SELLER.category}
            </Badge>

            <dl className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted-foreground">Units sold</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {BEST_SELLER.unitsSold.toLocaleString("en-US")}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted-foreground">Revenue</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(BEST_SELLER.revenue)}
                </dd>
              </div>
            </dl>

            <Separator />

            <p className="text-sm text-muted-foreground">
              Accounts for{" "}
              <span className="font-medium text-foreground">
                {(bestSellerShare * 100).toFixed(1)}%
              </span>{" "}
              of this week&apos;s revenue.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
