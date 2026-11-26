import { useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Receipt,
  RotateCcw,
  ShoppingBag,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  category: string
  unitsSold: number
  revenue: number
}

type PeriodStats = {
  revenue: number
  revenueChangePct: number
  comparisonLabel: string
  orders: number
  returns: number
  topProducts: TopProduct[]
}

const PERIOD_TABS: { value: PeriodKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

const PERIOD_DATA: Record<PeriodKey, PeriodStats> = {
  today: {
    revenue: 4820.5,
    revenueChangePct: 6.2,
    comparisonLabel: "vs yesterday",
    orders: 186,
    returns: 7,
    topProducts: [
      { id: "p-101", name: "Sourdough loaf", category: "Bakery", unitsSold: 94, revenue: 655.6 },
      { id: "p-214", name: "Oat milk 1L", category: "Dairy alternatives", unitsSold: 128, revenue: 512.0 },
      { id: "p-087", name: "Free-range eggs (12)", category: "Dairy & eggs", unitsSold: 71, revenue: 497.0 },
      { id: "p-352", name: "Cold brew coffee 500ml", category: "Drinks", unitsSold: 66, revenue: 462.0 },
      { id: "p-419", name: "Organic bananas (1kg)", category: "Produce", unitsSold: 83, revenue: 290.5 },
    ],
  },
  week: {
    revenue: 31240.75,
    revenueChangePct: 3.8,
    comparisonLabel: "vs last week",
    orders: 1204,
    returns: 38,
    topProducts: [
      { id: "p-214", name: "Oat milk 1L", category: "Dairy alternatives", unitsSold: 804, revenue: 3216.0 },
      { id: "p-101", name: "Sourdough loaf", category: "Bakery", unitsSold: 611, revenue: 4276.1 },
      { id: "p-352", name: "Cold brew coffee 500ml", category: "Drinks", unitsSold: 455, revenue: 3185.0 },
      { id: "p-087", name: "Free-range eggs (12)", category: "Dairy & eggs", unitsSold: 432, revenue: 3024.0 },
      { id: "p-538", name: "Dark chocolate 85%", category: "Snacks", unitsSold: 389, revenue: 1556.0 },
    ],
  },
  month: {
    revenue: 128910.2,
    revenueChangePct: -1.4,
    comparisonLabel: "vs last month",
    orders: 5012,
    returns: 171,
    topProducts: [
      { id: "p-214", name: "Oat milk 1L", category: "Dairy alternatives", unitsSold: 3350, revenue: 13400.0 },
      { id: "p-101", name: "Sourdough loaf", category: "Bakery", unitsSold: 2487, revenue: 17409.0 },
      { id: "p-087", name: "Free-range eggs (12)", category: "Dairy & eggs", unitsSold: 1904, revenue: 13328.0 },
      { id: "p-352", name: "Cold brew coffee 500ml", category: "Drinks", unitsSold: 1768, revenue: 12376.0 },
      { id: "p-419", name: "Organic bananas (1kg)", category: "Produce", unitsSold: 1532, revenue: 5362.0 },
    ],
  },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
const integer = new Intl.NumberFormat("en-US")

type StatCardProps = {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  change?: { pct: number; label: string }
}

function StatCard({ title, value, description, icon: Icon, change }: StatCardProps) {
  const positive = change !== undefined && change.pct >= 0
  const TrendIcon = positive ? ArrowUpRight : ArrowDownRight

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change && (
          <p
            className={`flex items-center gap-1 text-xs font-medium ${
              positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            <TrendIcon className="size-3" />
            {Math.abs(change.pct).toFixed(1)}% {change.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function FernhillMarketSalesDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("today")
  const stats = PERIOD_DATA[period]

  const averageBasket = stats.orders > 0 ? stats.revenue / stats.orders : 0
  const returnRate = stats.orders > 0 ? (stats.returns / stats.orders) * 100 : 0
  const periodName = PERIOD_TABS.find((t) => t.value === period)?.label ?? ""

  const maxRevenue = Math.max(...stats.topProducts.map((p) => p.revenue), 1)

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Sales overview</p>
        </div>

        <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodKey)}>
          <TabsList>
            {PERIOD_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={currency.format(stats.revenue)}
          description={`${periodName} total`}
          icon={DollarSign}
          change={{ pct: stats.revenueChangePct, label: stats.comparisonLabel }}
        />
        <StatCard
          title="Orders"
          value={integer.format(stats.orders)}
          description={`Completed orders, ${periodName.toLowerCase()}`}
          icon={ShoppingBag}
        />
        <StatCard
          title="Average basket"
          value={currency.format(averageBasket)}
          description="Revenue per order"
          icon={Receipt}
        />
        <StatCard
          title="Returns"
          value={integer.format(stats.returns)}
          description={`${returnRate.toFixed(1)}% of orders`}
          icon={RotateCcw}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Top products</CardTitle>
          <CardDescription>Best sellers by revenue, {periodName.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="w-48">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topProducts.map((product, index) => {
                const widthPct = (product.revenue / maxRevenue) * 100
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {integer.format(product.unitsSold)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                        <span className="w-24 text-right tabular-nums">
                          {currency.format(product.revenue)}
                        </span>
                      </div>
                    </TableCell>
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
