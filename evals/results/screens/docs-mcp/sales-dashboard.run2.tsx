import { useState } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Period = "today" | "week" | "month"

type Delta = {
  text: string
  trend: "up" | "down"
  good: boolean
}

type Metric = {
  label: string
  value: string
  delta: Delta
  hint: string
}

type Product = {
  name: string
  sku: string
  units: number
  revenue: string
  returns: number
}

type PeriodData = {
  label: string
  metrics: {
    revenue: Metric
    orders: Metric
    basket: Metric
    returns: Metric
  }
  products: Product[]
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

const SALES_DATA: Record<Period, PeriodData> = {
  today: {
    label: "Today, Tue 14 May",
    metrics: {
      revenue: {
        label: "Revenue",
        value: "$4,812.40",
        delta: { text: "+6.2%", trend: "up", good: true },
        hint: "vs. same day last week",
      },
      orders: {
        label: "Orders",
        value: "386",
        delta: { text: "+4.1%", trend: "up", good: true },
        hint: "vs. same day last week",
      },
      basket: {
        label: "Average basket",
        value: "$12.46",
        delta: { text: "+2.0%", trend: "up", good: true },
        hint: "vs. same day last week",
      },
      returns: {
        label: "Returns",
        value: "11",
        delta: { text: "+3", trend: "up", good: false },
        hint: "3 more than last week",
      },
    },
    products: [
      { name: "Organic whole milk 1 L", sku: "DA-1042", units: 214, revenue: "$536.40", returns: 1 },
      { name: "Sourdough loaf", sku: "BK-0307", units: 98, revenue: "$470.40", returns: 2 },
      { name: "Free-range eggs, 12 pack", sku: "DA-2210", units: 87, revenue: "$548.10", returns: 0 },
      { name: "Cold brew coffee 500 ml", sku: "BV-0880", units: 76, revenue: "$380.00", returns: 3 },
      { name: "Bananas, loose 1 kg", sku: "PR-0154", units: 71, revenue: "$177.50", returns: 1 },
    ],
  },
  week: {
    label: "Mon 8 May to Sun 14 May",
    metrics: {
      revenue: {
        label: "Revenue",
        value: "$31,976.85",
        delta: { text: "+3.8%", trend: "up", good: true },
        hint: "vs. previous 7 days",
      },
      orders: {
        label: "Orders",
        value: "2,541",
        delta: { text: "+1.9%", trend: "up", good: true },
        hint: "vs. previous 7 days",
      },
      basket: {
        label: "Average basket",
        value: "$12.58",
        delta: { text: "+1.8%", trend: "up", good: true },
        hint: "vs. previous 7 days",
      },
      returns: {
        label: "Returns",
        value: "64",
        delta: { text: "-8", trend: "down", good: true },
        hint: "8 fewer than previous 7 days",
      },
    },
    products: [
      { name: "Free-range eggs, 12 pack", sku: "DA-2210", units: 641, revenue: "$4,035.20", returns: 4 },
      { name: "Organic whole milk 1 L", sku: "DA-1042", units: 1_388, revenue: "$3,477.94", returns: 7 },
      { name: "Sourdough loaf", sku: "BK-0307", units: 602, revenue: "$2,889.60", returns: 9 },
      { name: "Cold brew coffee 500 ml", sku: "BV-0880", units: 519, revenue: "$2,595.00", returns: 13 },
      { name: "Bananas, loose 1 kg", sku: "PR-0154", units: 488, revenue: "$1,220.00", returns: 5 },
    ],
  },
  month: {
    label: "1 May to 14 May",
    metrics: {
      revenue: {
        label: "Revenue",
        value: "$68,305.10",
        delta: { text: "+9.4%", trend: "up", good: true },
        hint: "vs. same period last month",
      },
      orders: {
        label: "Orders",
        value: "5,322",
        delta: { text: "+7.2%", trend: "up", good: true },
        hint: "vs. same period last month",
      },
      basket: {
        label: "Average basket",
        value: "$12.83",
        delta: { text: "+2.0%", trend: "up", good: true },
        hint: "vs. same period last month",
      },
      returns: {
        label: "Returns",
        value: "142",
        delta: { text: "+12", trend: "up", good: false },
        hint: "12 more than last month",
      },
    },
    products: [
      { name: "Organic whole milk 1 L", sku: "DA-1042", units: 2_930, revenue: "$7,337.65", returns: 16 },
      { name: "Free-range eggs, 12 pack", sku: "DA-2210", units: 1_412, revenue: "$8,887.60", returns: 9 },
      { name: "Sourdough loaf", sku: "BK-0307", units: 1_284, revenue: "$6,163.20", returns: 21 },
      { name: "Cold brew coffee 500 ml", sku: "BV-0880", units: 1_107, revenue: "$5,535.00", returns: 29 },
      { name: "Bananas, loose 1 kg", sku: "PR-0154", units: 1_046, revenue: "$2,615.00", returns: 11 },
    ],
  },
}

function DeltaLine({ delta, hint }: { delta: Delta; hint: string }) {
  const Icon = delta.trend === "up" ? ArrowUpRight : ArrowDownRight
  const tone = delta.good ? "text-success" : "text-destructive"

  return (
    <p className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      <span className={`inline-flex items-center gap-0.5 font-medium ${tone}`}>
        <Icon className="size-4" aria-hidden="true" />
        {delta.text}
      </span>
      <span>{hint}</span>
    </p>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {metric.value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DeltaLine delta={metric.delta} hint={metric.hint} />
      </CardContent>
    </Card>
  )
}

function PeriodView({ data }: { data: PeriodData }) {
  const { metrics, products } = data

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard metric={metrics.revenue} />
        <MetricCard metric={metrics.orders} />
        <MetricCard metric={metrics.basket} />
        <MetricCard metric={metrics.returns} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 products</CardTitle>
          <CardDescription>{data.label}, ranked by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Units sold</TableHead>
                <TableHead className="text-right">Returns</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.sku}>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.units.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.returns}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.revenue}
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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Fernhill Market</p>
        <h1 className="text-2xl font-semibold">Sales dashboard</h1>
      </header>

      <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
        <TabsList>
          {PERIODS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PERIODS.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-6">
            <PeriodView data={SALES_DATA[item.value]} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
