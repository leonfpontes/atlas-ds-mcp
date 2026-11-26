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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

type Product = {
  name: string
  category: string
  units: number
  revenue: number
}

type Summary = {
  revenue: number
  orders: number
  basket: number
  returns: number
}

type Deltas = {
  revenue: number
  orders: number
  basket: number
  returns: number
}

type PeriodData = {
  id: "today" | "week" | "month"
  tabLabel: string
  label: string
  compareLabel: string
  summary: Summary
  deltas: Deltas
  products: Product[]
}

const money0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const money2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const integer = new Intl.NumberFormat("en-US")

const PERIODS: PeriodData[] = [
  {
    id: "today",
    tabLabel: "Today",
    label: "Today, since 06:00",
    compareLabel: "vs same day last week",
    summary: { revenue: 4286, orders: 118, basket: 36.32, returns: 3 },
    deltas: { revenue: 6.2, orders: 4.1, basket: 2.0, returns: 50 },
    products: [
      { name: "Sourdough loaf", category: "Bakery", units: 46, revenue: 414 },
      { name: "Free-range eggs, 12", category: "Dairy & eggs", units: 38, revenue: 342 },
      { name: "Oat milk, 1 L", category: "Dairy & eggs", units: 52, revenue: 286 },
      { name: "Organic bananas, 1 kg", category: "Produce", units: 61, revenue: 183 },
      { name: "Cold brew coffee", category: "Drinks", units: 19, revenue: 171 },
    ],
  },
  {
    id: "week",
    tabLabel: "This week",
    label: "Monday to today",
    compareLabel: "vs last week",
    summary: { revenue: 27940, orders: 812, basket: 34.41, returns: 19 },
    deltas: { revenue: 5.8, orders: 4.9, basket: 0.8, returns: -3.1 },
    products: [
      { name: "Sourdough loaf", category: "Bakery", units: 212, revenue: 1908 },
      { name: "Free-range eggs, 12", category: "Dairy & eggs", units: 176, revenue: 1584 },
      { name: "Oat milk, 1 L", category: "Dairy & eggs", units: 236, revenue: 1298 },
      { name: "Olive oil, 500 ml", category: "Pantry", units: 64, revenue: 1152 },
      { name: "Organic bananas, 1 kg", category: "Produce", units: 288, revenue: 864 },
    ],
  },
  {
    id: "month",
    tabLabel: "This month",
    label: "Month to date",
    compareLabel: "vs last month",
    summary: { revenue: 118420, orders: 3371, basket: 35.13, returns: 74 },
    deltas: { revenue: 9.4, orders: 7.7, basket: 1.6, returns: 12.2 },
    products: [
      { name: "Sourdough loaf", category: "Bakery", units: 905, revenue: 8145 },
      { name: "Oat milk, 1 L", category: "Dairy & eggs", units: 1012, revenue: 5566 },
      { name: "Free-range eggs, 12", category: "Dairy & eggs", units: 741, revenue: 6669 },
      { name: "Cold brew coffee", category: "Drinks", units: 402, revenue: 4422 },
      { name: "Dark chocolate, 70%", category: "Pantry", units: 388, revenue: 2716 },
    ],
  },
]

type MetricKey = keyof Summary

const METRICS: {
  key: MetricKey
  label: string
  format: (value: number) => string
  higherIsBetter: boolean
}[] = [
  { key: "revenue", label: "Revenue", format: (v) => money0.format(v), higherIsBetter: true },
  { key: "orders", label: "Orders", format: (v) => integer.format(v), higherIsBetter: true },
  { key: "basket", label: "Average basket", format: (v) => money2.format(v), higherIsBetter: true },
  { key: "returns", label: "Returns", format: (v) => integer.format(v), higherIsBetter: false },
]

function MetricCard({
  label,
  value,
  delta,
  higherIsBetter,
  compareLabel,
}: {
  label: string
  value: string
  delta: number
  higherIsBetter: boolean
  compareLabel: string
}) {
  const up = delta >= 0
  const good = higherIsBetter ? up : !up
  const Icon = up ? ArrowUpRight : ArrowDownRight
  const tone = good ? "text-success" : "text-destructive"
  const sign = up && delta > 0 ? "+" : ""

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`flex items-center gap-1 text-sm ${tone}`}>
          <Icon className="size-4" aria-hidden="true" />
          <span className="tabular-nums">
            {sign}
            {delta.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{compareLabel}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function SalesPanel({ period }: { period: PeriodData }) {
  const totalRevenue = period.summary.revenue

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={metric.format(period.summary[metric.key])}
            delta={period.deltas[metric.key]}
            higherIsBetter={metric.higherIsBetter}
            compareLabel={period.compareLabel}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 products</CardTitle>
          <CardDescription>{period.label}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {period.products.map((product) => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {integer.format(product.units)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {money0.format(product.revenue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {((product.revenue / totalRevenue) * 100).toFixed(1)}%
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

export default function SalesDashboardScreen() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 bg-background p-6 text-foreground">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold tracking-tight">Sales dashboard</h1>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-warning-accent" aria-hidden="true" />
          Sample data
        </p>
      </header>

      <Tabs defaultValue="today">
        <TabsList>
          {PERIODS.map((period) => (
            <TabsTrigger key={period.id} value={period.id}>
              {period.tabLabel}
            </TabsTrigger>
          ))}
        </TabsList>

        {PERIODS.map((period) => (
          <TabsContent key={period.id} value={period.id} className="mt-4">
            <SalesPanel period={period} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
