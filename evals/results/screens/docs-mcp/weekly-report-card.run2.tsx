import { Download, TrendingDown, TrendingUp, Trophy, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STORE_NAME = "Fernhill Market"
const REPORT_WEEK = "3–9 March 2025"
const PREVIOUS_WEEK = "24–30 February 2025"
const REPORT_FILE_NAME = "fernhill-market-weekly-report-2025-03-03.csv"

const REVENUE = {
  currentWeek: 12480.5,
  previousWeek: 11206.0,
}

const PRODUCTS = [
  { id: "P-1001", name: "Sourdough loaf", units: 214, revenue: 1712.0 },
  { id: "P-1002", name: "Free-range eggs, 12 pack", units: 152, revenue: 1824.0 },
  { id: "P-1003", name: "Oat milk, 1 L", units: 186, revenue: 1116.0 },
  { id: "P-1004", name: "Extra virgin olive oil, 500 ml", units: 61, revenue: 915.0 },
  { id: "P-1005", name: "Seasonal fruit box", units: 74, revenue: 1258.0 },
]

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function escapeCsvCell(value: string | number): string {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export default function WeeklyReportCard() {
  const change = REVENUE.currentWeek - REVENUE.previousWeek
  const changePercent = (change / REVENUE.previousWeek) * 100
  const isUp = change >= 0
  const changeLabel = `${isUp ? "+" : "−"}${Math.abs(changePercent).toFixed(1)}%`

  const productsByUnits = [...PRODUCTS].sort((a, b) => b.units - a.units)
  const bestSeller = productsByUnits[0]

  function downloadCsv() {
    const rows: (string | number)[][] = [
      ["Report", `${STORE_NAME} weekly report card`],
      ["Week", REPORT_WEEK],
      ["Compared with", PREVIOUS_WEEK],
      [],
      ["Revenue", "This week (USD)", "Last week (USD)", "Change (%)"],
      [
        "Revenue",
        REVENUE.currentWeek.toFixed(2),
        REVENUE.previousWeek.toFixed(2),
        changePercent.toFixed(1),
      ],
      [],
      ["Product ID", "Product", "Units sold", "Revenue (USD)"],
      ...productsByUnits.map((product) => [
        product.id,
        product.name,
        product.units,
        product.revenue.toFixed(2),
      ]),
    ]

    const csv = rows
      .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = REPORT_FILE_NAME
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("Report downloaded")
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Weekly report card</h1>
            <p className="text-sm text-muted-foreground">
              {STORE_NAME} · {REPORT_WEEK}
            </p>
          </div>
          <Button onClick={downloadCsv}>
            <Download />
            Download CSV
          </Button>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning">
            <TriangleAlert />
            Example data
          </Badge>
          <span className="text-sm text-muted-foreground">
            These figures are sample values, not measured sales.
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>
                This week against last week ({PREVIOUS_WEEK})
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-4xl font-semibold tabular-nums">
                {formatCurrency(REVENUE.currentWeek)}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant={isUp ? "success" : "destructive"}>
                  {isUp ? <TrendingUp /> : <TrendingDown />}
                  {changeLabel}
                </Badge>
                <span className="text-muted-foreground">
                  {isUp ? "up" : "down"} {formatCurrency(Math.abs(change))} from{" "}
                  {formatCurrency(REVENUE.previousWeek)} last week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best-selling product</CardTitle>
              <CardDescription>Most units sold this week</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="size-4" />
                <span className="text-sm">Top seller</span>
              </div>
              <p className="text-2xl font-semibold">{bestSeller.name}</p>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">Units sold</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {bestSeller.units}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">Revenue</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatCurrency(bestSeller.revenue)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products by units sold</CardTitle>
            <CardDescription>All products tracked in this report</CardDescription>
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
                {productsByUnits.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.units}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(product.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
