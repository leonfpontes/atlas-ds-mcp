import { useState } from "react"
import { toast } from "sonner"
import {
  DollarSign,
  ShoppingBag,
  Receipt,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PeriodKey = "today" | "week" | "month"

type TopProduct = {
  id: string
  name: string
  sku: string
  units: number
  revenue: number
}

type PeriodData = {
  label: string
  revenue: number
  orders: number
  returns: number
  revenueChange: number
  ordersChange: number
  returnsChange: number
  topProducts: TopProduct[]
}

const PERIOD_TABS: { value: PeriodKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

const PERIOD_DATA: Record<PeriodKey, PeriodData> = {
  today: {
    label: "Today",
    revenue: 12840,
    orders: 412,
    returns: 9,
    revenueChange: 6.2,
    ordersChange: 4.1,
    returnsChange: -12.5,
    topProducts: [
      { id: "p1", name: "Organic Free-Range Eggs (12)", sku: "FH-EGG-012", units: 186, revenue: 1674 },
      { id: "p2", name: "Sourdough Loaf, Stoneground", sku: "FH-BRD-204", units: 143, revenue: 1287 },
      { id: "p3", name: "Cold-Pressed Orange Juice 1L", sku: "FH-JCE-110", units: 121, revenue: 968 },
      { id: "p4", name: "Hand-Picked Gala Apples (1kg)", sku: "FH-PRD-031", units: 109, revenue: 764 },
      { id: "p5", name: "Oat Milk, Unsweetened 1L", sku: "FH-DRY-078", units: 98, revenue: 588 },
    ],
  },
  week: {
    label: "This week",
    revenue: 84210,
    orders: 2735,
    returns: 61,
    revenueChange: 3.8,
    ordersChange: 2.9,
    returnsChange: 1.6,
    topProducts: [
      { id: "p1", name: "Organic Free-Range Eggs (12)", sku: "FH-EGG-012", units: 1204, revenue: 10848 },
      { id: "p2", name: "Sourdough Loaf, Stoneground", sku: "FH-BRD-204", units: 982, revenue: 8838 },
      { id: "p6", name: "Single-Origin Coffee Beans 250g", sku: "FH-COF-051", units: 701, revenue: 7711 },
      { id: "p3", name: "Cold-Pressed Orange Juice 1L", sku: "FH-JCE-110", units: 815, revenue: 6520 },
      { id: "p4", name: "Hand-Picked Gala Apples (1kg)", sku: "FH-PRD-031", units: 736, revenue: 5152 },
    ],
  },
  month: {
    label: "This month",
    revenue: 362480,
    orders: 11906,
    returns: 274,
    revenueChange: -1.4,
    ordersChange: 0.7,
    returnsChange: -4.3,
    topProducts: [
      { id: "p2", name: "Sourdough Loaf, Stoneground", sku: "FH-BRD-204", units: 4311, revenue: 38799 },
      { id: "p1", name: "Organic Free-Range Eggs (12)", sku: "FH-EGG-012", units: 4087, revenue: 36783 },
      { id: "p6", name: "Single-Origin Coffee Beans 250g", sku: "FH-COF-051", units: 2945, revenue: 32395 },
      { id: "p3", name: "Cold-Pressed Orange Juice 1L", sku: "FH-JCE-110", units: 3390, revenue: 27120 },
      { id: "p7", name: "Wild Rice Blend 500g", sku: "FH-DRY-133", units: 2210, revenue: 15470 },
    ],
  },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const number = new Intl.NumberFormat("en-US")

type DeltaProps = {
  change: number
  /** When true, a decrease is good (e.g. returns). */
  lowerIsBetter?: boolean
  suffix: string
}

function Delta({ change, lowerIsBetter = false, suffix }: DeltaProps) {
  const isUp = change >= 0
  const isGood = lowerIsBetter ? !isUp : isUp
  const Icon = isUp ? TrendingUp : TrendingDown

  return (
    <Badge
      variant="outline"
      className={
        isGood
          ? "gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
          : "gap-1 border-rose-200 bg-rose-50 text-rose-700"
      }
    >
      <Icon className="size-3" />
      {isUp ? "+" : ""}
      {change.toFixed(1)}% {suffix}
    </Badge>
  )
}

type StatCardProps = {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  delta: React.ReactNode
}

function StatCard({ title, value, description, icon: Icon, delta }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{title}</CardDescription>
        <div className="rounded-md bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{description}</span>
          {delta}
        </div>
      </CardContent>
    </Card>
  )
}

function PeriodView({ data }: { data: PeriodData }) {
  const averageBasket = data.orders > 0 ? data.revenue / data.orders : 0
  const returnRate = data.orders > 0 ? (data.returns / data.orders) * 100 : 0
  const totalTopRevenue = data.topProducts.reduce((sum, p) => sum + p.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={currency.format(data.revenue)}
          description={`${data.label} gross sales`}
          icon={DollarSign}
          delta={<Delta change={data.revenueChange} suffix="vs prior" />}
        />
        <StatCard
          title="Orders"
          value={number.format(data.orders)}
          description={`${data.label} completed orders`}
          icon={ShoppingBag}
          delta={<Delta change={data.ordersChange} suffix="vs prior" />}
        />
        <StatCard
          title="Average basket"
          value={currencyPrecise.format(averageBasket)}
          description={`${returnRate.toFixed(1)}% of orders returned`}
          icon={Receipt}
          delta={<Delta change={data.revenueChange - data.ordersChange} suffix="per order" />}
        />
        <StatCard
          title="Returns"
          value={number.format(data.returns)}
          description={`${data.label} returned orders`}
          icon={RotateCcw}
          delta={<Delta change={data.returnsChange} lowerIsBetter suffix="vs prior" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 products</CardTitle>
          <CardDescription>Ranked by revenue, {data.label.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topProducts.map((product, index) => {
                const share = totalTopRevenue > 0 ? (product.revenue / totalTopRevenue) * 100 : 0
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-muted-foreground tabular-nums">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                      {product.sku}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{number.format(product.units)}</TableCell>
                    <TableCell className="text-right tabular-nums">{currency.format(product.revenue)}</TableCell>
                    <TableCell className="text-right tabular-nums">{share.toFixed(1)}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FernhillMarketDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("today")

  const handleExport = () => {
    toast.success(`Exported ${PERIOD_DATA[period].label.toLowerCase()} report`, {
      description: "The CSV will be available in your downloads shortly.",
    })
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Sales overview across all store locations</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="size-4" />
          Export
        </Button>
      </header>

      <Tabs value={period} onValueChange={(value) => setPeriod(value as PeriodKey)} className="space-y-6">
        <TabsList>
          {PERIOD_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PERIOD_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <PeriodView data={PERIOD_DATA[tab.value]} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
