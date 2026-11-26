import { useMemo } from "react"
import { Download, TrendingDown, TrendingUp, Trophy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

const STORE_NAME = "Fernhill Market"
const WEEK_LABEL = "Week 24 · 9–15 June 2025"

const REVENUE = {
  thisWeek: 18420.5,
  lastWeek: 16975,
}

const TOP_PRODUCTS = [
  { name: "Fernhill wildflower honey, 500 g", category: "Pantry", units: 312, revenue: 2184 },
  { name: "Sourdough loaf, large", category: "Bakery", units: 286, revenue: 1716 },
  { name: "Free-range eggs, box of 12", category: "Dairy & eggs", units: 198, revenue: 1386 },
  { name: "Oat milk, 1 L", category: "Dairy & eggs", units: 241, revenue: 1205 },
  { name: "Cold brew concentrate, 750 ml", category: "Drinks", units: 164, revenue: 1148 },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const integer = new Intl.NumberFormat("en-US")

function escapeCsv(value: string | number): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function buildCsv(): string {
  const change = REVENUE.thisWeek - REVENUE.lastWeek
  const summary: (string | number)[][] = [
    ["Store", STORE_NAME],
    ["Week", WEEK_LABEL],
    ["Revenue this week", REVENUE.thisWeek.toFixed(2)],
    ["Revenue last week", REVENUE.lastWeek.toFixed(2)],
    ["Change", change.toFixed(2)],
    [],
    ["Product", "Category", "Units sold", "Revenue"],
    ...TOP_PRODUCTS.map((p) => [p.name, p.category, p.units, p.revenue.toFixed(2)]),
  ]
  return summary.map((row) => row.map(escapeCsv).join(",")).join("\n")
}

export default function WeeklyReportCard() {
  const change = REVENUE.thisWeek - REVENUE.lastWeek
  const changePct = (change / REVENUE.lastWeek) * 100
  const isUp = change >= 0
  const TrendIcon = isUp ? TrendingUp : TrendingDown
  const sign = isUp ? "+" : "−"

  const bestSeller = useMemo(
    () => [...TOP_PRODUCTS].sort((a, b) => b.revenue - a.revenue)[0],
    []
  )

  function handleDownload() {
    const blob = new Blob([buildCsv()], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "fernhill-market-weekly-report.csv"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success("Report downloaded")
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">Weekly report</h1>
          <Badge variant="warning">
            <span aria-hidden="true">●</span> Example data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {STORE_NAME} · {WEEK_LABEL}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This week against last week</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-3xl font-semibold tabular-nums text-foreground">
              {currency.format(REVENUE.thisWeek)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isUp ? "success" : "destructive"}>
                <TrendIcon aria-hidden="true" />
                {sign}
                {Math.abs(changePct).toFixed(1)}%
              </Badge>
              <span className="text-sm text-muted-foreground tabular-nums">
                {sign}
                {currency.format(Math.abs(change))} vs {currency.format(REVENUE.lastWeek)} last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-selling product</CardTitle>
            <CardDescription>Most revenue this week</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Trophy className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">{bestSeller.name}</p>
                <p className="text-sm text-muted-foreground">{bestSeller.category}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground tabular-nums">
              {integer.format(bestSeller.units)} units · {currency.format(bestSeller.revenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top products</CardTitle>
          <CardDescription>Ranked by revenue this week</CardDescription>
          <CardAction>
            <Button onClick={handleDownload}>
              <Download aria-hidden="true" />
              Download CSV
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_PRODUCTS.map((product) => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {integer.format(product.units)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {currency.format(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}
