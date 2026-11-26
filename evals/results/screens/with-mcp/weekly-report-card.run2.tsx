import { Award, Download, TrendingDown, TrendingUp } from "lucide-react"
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
const REPORT_FILE_NAME = "fernhill-market-weekly-report-2025-06-09.csv"

const REVENUE_THIS_WEEK = 18420
const REVENUE_LAST_WEEK = 16905

const PRODUCTS = [
  { name: "Free-range eggs, 12 pack", units: 143, revenue: 2717 },
  { name: "Coffee beans, 250 g", units: 97, revenue: 1455 },
  { name: "Oat milk, 1 L", units: 412, revenue: 1648 },
  { name: "Sourdough loaf", units: 186, revenue: 1116 },
  { name: "Bananas, 1 kg", units: 358, revenue: 1074 },
  { name: "All other products", units: 1284, revenue: 10410 },
]

const BEST_SELLER = PRODUCTS.reduce((best, product) =>
  product.units > best.units ? product : best
)

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const number = new Intl.NumberFormat("en-US")

function formatChange(current: number, previous: number) {
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? "+" : "−"
  return `${sign}${Math.abs(change).toFixed(1)}%`
}

function escapeCsv(value: string | number) {
  const text = String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function downloadCsv() {
  const totalUnits = PRODUCTS.reduce((sum, p) => sum + p.units, 0)
  const totalRevenue = PRODUCTS.reduce((sum, p) => sum + p.revenue, 0)

  const rows: (string | number)[][] = [
    [STORE_NAME, "Weekly report", WEEK_LABEL],
    [],
    ["Metric", "Value"],
    ["Revenue this week (USD)", REVENUE_THIS_WEEK],
    ["Revenue last week (USD)", REVENUE_LAST_WEEK],
    ["Change vs last week", formatChange(REVENUE_THIS_WEEK, REVENUE_LAST_WEEK)],
    ["Best-selling product", BEST_SELLER.name],
    [],
    ["Product", "Units sold", "Revenue (USD)"],
    ...PRODUCTS.map((p) => [p.name, p.units, p.revenue]),
    ["Total", totalUnits, totalRevenue],
  ]

  const csv = rows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
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

export default function WeeklyReportCard() {
  const change = formatChange(REVENUE_THIS_WEEK, REVENUE_LAST_WEEK)
  const isUp = REVENUE_THIS_WEEK >= REVENUE_LAST_WEEK
  const totalUnits = PRODUCTS.reduce((sum, p) => sum + p.units, 0)
  const totalRevenue = PRODUCTS.reduce((sum, p) => sum + p.revenue, 0)

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
          <h1 className="text-2xl font-semibold">Weekly report</h1>
          <p className="text-sm text-muted-foreground">Week of {WEEK_LABEL}</p>
        </div>
        <Button onClick={downloadCsv}>
          <Download />
          Download report as CSV
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Compared with last week</CardDescription>
            <CardAction>
              <Badge variant="warning">Example data</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-4xl font-semibold tabular-nums">
              {currency.format(REVENUE_THIS_WEEK)}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={isUp ? "success" : "destructive"}>
                {isUp ? <TrendingUp /> : <TrendingDown />}
                {change} vs last week
              </Badge>
              <span className="text-muted-foreground">
                Last week: {currency.format(REVENUE_LAST_WEEK)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-selling product</CardTitle>
            <CardDescription>Most units sold this week</CardDescription>
            <CardAction>
              <Badge variant="warning">Example data</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Award className="size-6 text-primary" aria-hidden="true" />
              <p className="text-xl font-semibold">{BEST_SELLER.name}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {number.format(BEST_SELLER.units)} units sold ·{" "}
              {currency.format(BEST_SELLER.revenue)} revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by product</CardTitle>
          <CardDescription>Units and revenue for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Units sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUCTS.map((product) => (
                <TableRow key={product.name}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {number.format(product.units)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {currency.format(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {number.format(totalUnits)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {currency.format(totalRevenue)}
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
