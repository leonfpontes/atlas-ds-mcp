import { useState } from "react"
import { TrendingDown, TrendingUp, TriangleAlert } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Period = "today" | "week" | "month"

type Summary = {
  label: string
  value: string
  delta: string
  up: boolean
  good: boolean
}

type Product = {
  name: string
  sku: string
  units: number
  revenue: number
}

type PeriodData = {
  summary: Summary[]
  products: Product[]
}

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
}

const PERIOD_DATA: Record<Period, PeriodData> = {
  today: {
    summary: [
      { label: "Revenue today", value: "$4,862.40", delta: "+8.2% vs last Tue", up: true, good: true },
      { label: "Orders", value: "263", delta: "+12 vs last Tue", up: true, good: true },
      { label: "Average basket", value: "$18.49", delta: "−$0.62 vs last Tue", up: false, good: false },
      { label: "Returns", value: "7", delta: "+2 vs last Tue", up: true, good: false },
    ],
    products: [
      { name: "Oat milk, 1 L", sku: "DR-1021", units: 118, revenue: 412.3 },
      { name: "Sourdough loaf", sku: "BK-2290", units: 64, revenue: 352.0 },
      { name: "Free-range eggs, 12", sku: "DA-0457", units: 57, revenue: 399.0 },
      { name: "Bananas, per kg", sku: "PR-0112", units: 49, revenue: 118.6 },
      { name: "Olive oil, 500 ml", sku: "PA-0803", units: 31, revenue: 325.5 },
    ],
  },
  week: {
    summary: [
      { label: "Revenue this week", value: "$31,248.75", delta: "+4.1% vs last week", up: true, good: true },
      { label: "Orders", value: "1,718", delta: "+60 vs last week", up: true, good: true },
      { label: "Average basket", value: "$18.19", delta: "−$0.31 vs last week", up: false, good: false },
      { label: "Returns", value: "41", delta: "−5 vs last week", up: false, good: true },
    ],
    products: [
      { name: "Oat milk, 1 L", sku: "DR-1021", units: 812, revenue: 2836.4 },
      { name: "Free-range eggs, 12", sku: "DA-0457", units: 438, revenue: 3066.0 },
      { name: "Sourdough loaf", sku: "BK-2290", units: 402, revenue: 2211.0 },
      { name: "Bananas, per kg", sku: "PR-0112", units: 376, revenue: 910.7 },
      { name: "Olive oil, 500 ml", sku: "PA-0803", units: 214, revenue: 2247.0 },
    ],
  },
  month: {
    summary: [
      { label: "Revenue this month", value: "$128,904.10", delta: "+6.7% vs last month", up: true, good: true },
      { label: "Orders", value: "7,046", delta: "+391 vs last month", up: true, good: true },
      { label: "Average basket", value: "$18.30", delta: "+$0.12 vs last month", up: true, good: true },
      { label: "Returns", value: "162", delta: "+18 vs last month", up: true, good: false },
    ],
    products: [
      { name: "Free-range eggs, 12", sku: "DA-0457", units: 1845, revenue: 12915.0 },
      { name: "Oat milk, 1 L", sku: "DR-1021", units: 3390, revenue: 11856.6 },
      { name: "Sourdough loaf", sku: "BK-2290", units: 1702, revenue: 9361.0 },
      { name: "Olive oil, 500 ml", sku: "PA-0803", units: 866, revenue: 9093.0 },
      { name: "Bananas, per kg", sku: "PR-0112", units: 1588, revenue: 3848.0 },
    ],
  },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const integer = new Intl.NumberFormat("en-US")

function SummaryCard({ item }: { item: Summary }) {
  const Icon = item.up ? TrendingUp : TrendingDown
  return (
    <Card>
      <CardHeader>
        <CardDescription>{item.label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{item.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={
            "flex items-center gap-1 text-sm " +
            (item.good ? "text-success" : "text-destructive")
          }
        >
          <Icon aria-hidden="true" className="size-4" />
          <span>{item.delta}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function PeriodReport({ data, period }: { data: PeriodData; period: Period }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 products</CardTitle>
          <CardDescription>{PERIOD_LABELS[period]}, ranked by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Units sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
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
    </div>
  )
}

export default function SalesDashboard() {
  const [period, setPeriod] = useState<Period>("today")

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Fernhill Market</h1>
            <p className="text-sm text-muted-foreground">Sales overview</p>
          </div>
          <Badge variant="warning">
            <TriangleAlert aria-hidden="true" className="size-3.5" />
            Example data
          </Badge>
        </header>

        <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <TabsList>
            {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {PERIOD_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(PERIOD_DATA) as Period[]).map((key) => (
            <TabsContent key={key} value={key} className="mt-6">
              <PeriodReport data={PERIOD_DATA[key]} period={key} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
